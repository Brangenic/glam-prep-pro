CREATE TABLE public.ai_booking_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_day text NOT NULL CHECK (event_day IN ('monday','tuesday')),
  event_date date NOT NULL,
  slot_time time NOT NULL,
  capacity int NOT NULL DEFAULT 3,
  UNIQUE (event_day, slot_time)
);
GRANT ALL ON public.ai_booking_slots TO service_role;
ALTER TABLE public.ai_booking_slots ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.ai_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  product_id text NOT NULL,
  product_label text NOT NULL,
  day_key text NOT NULL CHECK (day_key IN ('monday','tuesday','both')),
  amount_usd int NOT NULL,
  status text NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment','paid','expired','cancelled')),
  stripe_checkout_session_id text UNIQUE,
  stripe_payment_intent_id text,
  hold_expires_at timestamptz NOT NULL,
  terms_accepted_at timestamptz NOT NULL,
  source text DEFAULT 'other',
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz,
  notification_sent_at timestamptz,
  receipt_sent_at timestamptz
);
GRANT ALL ON public.ai_bookings TO service_role;
ALTER TABLE public.ai_bookings ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.ai_booking_slot_holds (
  booking_id uuid NOT NULL REFERENCES public.ai_bookings(id) ON DELETE CASCADE,
  slot_id uuid NOT NULL REFERENCES public.ai_booking_slots(id),
  PRIMARY KEY (booking_id, slot_id)
);
GRANT ALL ON public.ai_booking_slot_holds TO service_role;
ALTER TABLE public.ai_booking_slot_holds ENABLE ROW LEVEL SECURITY;

INSERT INTO public.ai_booking_slots (event_day, event_date, slot_time)
SELECT d.day, d.dt, t.tm
FROM (VALUES ('monday', DATE '2027-02-08'), ('tuesday', DATE '2027-02-09')) AS d(day, dt)
CROSS JOIN (VALUES (TIME '04:00'), (TIME '05:00'), (TIME '06:00'), (TIME '07:00'), (TIME '08:00')) AS t(tm);

CREATE OR REPLACE FUNCTION public.reserve_ai_booking(
  p_first text, p_last text, p_email text, p_phone text,
  p_product_id text, p_product_label text, p_day_key text, p_amount int,
  p_slot_ids uuid[], p_source text
) RETURNS TABLE (id uuid, reference text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  s record;
  used int;
  ref text;
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  new_id uuid;
  i int;
BEGIN
  IF p_slot_ids IS NULL OR array_length(p_slot_ids, 1) IS NULL THEN
    RAISE EXCEPTION 'NO_SLOTS';
  END IF;
  FOR s IN SELECT sl.id, sl.capacity FROM public.ai_booking_slots sl
           WHERE sl.id = ANY(p_slot_ids) ORDER BY sl.id FOR UPDATE LOOP
    SELECT count(*) INTO used FROM public.ai_booking_slot_holds h
      JOIN public.ai_bookings b ON b.id = h.booking_id
      WHERE h.slot_id = s.id
        AND (b.status = 'paid' OR (b.status = 'pending_payment' AND b.hold_expires_at > now()));
    IF used >= s.capacity THEN
      RAISE EXCEPTION 'SLOT_FULL';
    END IF;
  END LOOP;
  IF (SELECT count(*) FROM public.ai_booking_slots WHERE public.ai_booking_slots.id = ANY(p_slot_ids)) <> array_length(p_slot_ids, 1) THEN
    RAISE EXCEPTION 'BAD_SLOT';
  END IF;
  LOOP
    ref := 'CGH-TT27-';
    FOR i IN 1..5 LOOP
      ref := ref || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.ai_bookings WHERE public.ai_bookings.reference = ref);
  END LOOP;
  INSERT INTO public.ai_bookings (reference, first_name, last_name, email, phone, product_id, product_label,
    day_key, amount_usd, hold_expires_at, terms_accepted_at, source)
  VALUES (ref, p_first, p_last, p_email, p_phone, p_product_id, p_product_label,
    p_day_key, p_amount, now() + interval '31 minutes', now(), coalesce(p_source, 'other'))
  RETURNING public.ai_bookings.id INTO new_id;
  INSERT INTO public.ai_booking_slot_holds (booking_id, slot_id) SELECT new_id, unnest(p_slot_ids);
  RETURN QUERY SELECT new_id, ref;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.reserve_ai_booking(text,text,text,text,text,text,text,int,uuid[],text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_ai_booking(text,text,text,text,text,text,text,int,uuid[],text) TO service_role;

CREATE OR REPLACE FUNCTION public.ai_slot_availability()
RETURNS TABLE (event_day text, slot_time time, capacity int, spots_left int)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT sl.event_day, sl.slot_time, sl.capacity,
    greatest(0, sl.capacity - (
      SELECT count(*)::int FROM public.ai_booking_slot_holds h
      JOIN public.ai_bookings b ON b.id = h.booking_id
      WHERE h.slot_id = sl.id
        AND (b.status = 'paid' OR (b.status = 'pending_payment' AND b.hold_expires_at > now()))
    )) AS spots_left
  FROM public.ai_booking_slots sl
  ORDER BY sl.event_day, sl.slot_time;
$$;
REVOKE EXECUTE ON FUNCTION public.ai_slot_availability() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ai_slot_availability() TO service_role;