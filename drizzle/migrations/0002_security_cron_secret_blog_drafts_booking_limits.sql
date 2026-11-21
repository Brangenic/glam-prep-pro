-- Security fix: internal cron secret, blog drafts, booking anti-hoarding.

-- 1. Internal secrets, readable only by service_role and the database owner.
CREATE SCHEMA IF NOT EXISTS private;
CREATE TABLE private.internal_secrets (
  name text PRIMARY KEY,
  value text NOT NULL
);
REVOKE ALL ON private.internal_secrets FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO service_role;
GRANT SELECT ON private.internal_secrets TO service_role;
ALTER TABLE private.internal_secrets ENABLE ROW LEVEL SECURITY;
INSERT INTO private.internal_secrets (name, value)
VALUES ('cron_secret', encode(extensions.gen_random_bytes(32), 'hex'))
ON CONFLICT (name) DO NOTHING;

-- The private schema is not exposed to the Data API, so edge functions read
-- a secret through this service_role-only accessor.
CREATE OR REPLACE FUNCTION public.internal_secret(p_name text)
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT s.value FROM private.internal_secrets s WHERE s.name = p_name $$;
REVOKE ALL ON FUNCTION public.internal_secret(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.internal_secret(text) TO service_role;

-- 2. Blog drafts. Every existing post stays published; AI posts arrive as drafts.
ALTER TABLE public.blog_posts ADD COLUMN status text NOT NULL DEFAULT 'published';
ALTER TABLE public.blog_posts ADD CONSTRAINT blog_posts_status_check CHECK (status IN ('draft', 'published'));
CREATE INDEX blog_posts_status_idx ON public.blog_posts (status);
DROP POLICY IF EXISTS "Public can read blog posts" ON public.blog_posts;
CREATE POLICY "Public can read published blog posts" ON public.blog_posts
  FOR SELECT TO public USING (status = 'published');
CREATE POLICY "Admins can read all blog posts" ON public.blog_posts
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update blog posts" ON public.blog_posts
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- BEGIN booking-limits
CREATE TABLE public.ai_booking_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text,
  email text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON public.ai_booking_attempts FROM anon, authenticated;
GRANT ALL ON public.ai_booking_attempts TO service_role;
ALTER TABLE public.ai_booking_attempts ENABLE ROW LEVEL SECURITY;
CREATE INDEX ai_booking_attempts_ip_idx ON public.ai_booking_attempts (ip_hash, created_at);
CREATE INDEX ai_booking_attempts_email_idx ON public.ai_booking_attempts (email, created_at);
CREATE INDEX ai_booking_attempts_phone_idx ON public.ai_booking_attempts (phone, created_at);
CREATE INDEX ai_booking_attempts_created_idx ON public.ai_booking_attempts (created_at);

CREATE TABLE public.ai_booking_guard (
  name text PRIMARY KEY,
  until timestamptz NOT NULL
);
REVOKE ALL ON public.ai_booking_guard FROM anon, authenticated;
GRANT ALL ON public.ai_booking_guard TO service_role;
ALTER TABLE public.ai_booking_guard ENABLE ROW LEVEL SECURITY;

DROP FUNCTION IF EXISTS public.reserve_ai_booking(text, text, text, text, text, text, text, integer, uuid[], text);

-- Limits: 5 attempts per IP hash per 15 minutes, 3 per email and 3 per phone
-- per hour, one live pending hold per email and per phone (a new attempt
-- releases the previous one), holds last 15 minutes, and new holds stop for
-- 5 minutes once live pending holds would exceed half of total capacity.
-- Limit outcomes return an error code instead of raising, so the attempt
-- log and the breaker survive the call.
CREATE OR REPLACE FUNCTION public.reserve_ai_booking(
  p_first text, p_last text, p_email text, p_phone text,
  p_product_id text, p_product_label text, p_day_key text, p_amount int,
  p_slot_ids uuid[], p_source text, p_ip_hash text DEFAULT NULL
) RETURNS TABLE (id uuid, reference text, error text, cancelled_sessions text[])
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  s record;
  used int;
  n int;
  ref text;
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  new_id uuid;
  i int;
  v_email text := lower(trim(p_email));
  v_phone text := trim(p_phone);
  prev_ids uuid[];
  prev_sessions text[];
  total_cap int;
  live_pending int;
BEGIN
  INSERT INTO public.ai_booking_attempts (ip_hash, email, phone) VALUES (p_ip_hash, v_email, v_phone);

  -- One reservation at a time, so counts, releases and holds are atomic.
  PERFORM pg_advisory_xact_lock(hashtext('reserve_ai_booking'));

  IF p_ip_hash IS NOT NULL THEN
    SELECT count(*) INTO n FROM public.ai_booking_attempts a
      WHERE a.ip_hash = p_ip_hash AND a.created_at > now() - interval '15 minutes';
    IF n > 5 THEN
      RETURN QUERY SELECT NULL::uuid, NULL::text, 'IP_LIMIT'::text, '{}'::text[]; RETURN;
    END IF;
  END IF;
  SELECT count(*) INTO n FROM public.ai_booking_attempts a
    WHERE a.email = v_email AND a.created_at > now() - interval '1 hour';
  IF n > 3 THEN
    RETURN QUERY SELECT NULL::uuid, NULL::text, 'EMAIL_LIMIT'::text, '{}'::text[]; RETURN;
  END IF;
  SELECT count(*) INTO n FROM public.ai_booking_attempts a
    WHERE a.phone = v_phone AND a.created_at > now() - interval '1 hour';
  IF n > 3 THEN
    RETURN QUERY SELECT NULL::uuid, NULL::text, 'PHONE_LIMIT'::text, '{}'::text[]; RETURN;
  END IF;
  IF EXISTS (SELECT 1 FROM public.ai_booking_guard g WHERE g.name = 'hoard_breaker' AND g.until > now()) THEN
    RETURN QUERY SELECT NULL::uuid, NULL::text, 'BUSY'::text, '{}'::text[]; RETURN;
  END IF;

  IF p_slot_ids IS NULL OR array_length(p_slot_ids, 1) IS NULL THEN
    RETURN QUERY SELECT NULL::uuid, NULL::text, 'NO_SLOTS'::text, '{}'::text[]; RETURN;
  END IF;
  IF (SELECT count(*) FROM public.ai_booking_slots sl WHERE sl.id = ANY(p_slot_ids)) <> array_length(p_slot_ids, 1) THEN
    RETURN QUERY SELECT NULL::uuid, NULL::text, 'BAD_SLOT'::text, '{}'::text[]; RETURN;
  END IF;

  -- This customer's live holds are released by this attempt.
  SELECT coalesce(array_agg(b.id), '{}'),
         coalesce(array_agg(b.stripe_checkout_session_id) FILTER (WHERE b.stripe_checkout_session_id IS NOT NULL), '{}')
    INTO prev_ids, prev_sessions
    FROM public.ai_bookings b
    WHERE b.status = 'pending_payment' AND b.hold_expires_at > now()
      AND (b.email = v_email OR b.phone = v_phone);

  FOR s IN SELECT sl.id, sl.capacity FROM public.ai_booking_slots sl
           WHERE sl.id = ANY(p_slot_ids) ORDER BY sl.id FOR UPDATE LOOP
    SELECT count(*) INTO used FROM public.ai_booking_slot_holds h
      JOIN public.ai_bookings b ON b.id = h.booking_id
      WHERE h.slot_id = s.id
        AND NOT (b.id = ANY(prev_ids))
        AND (b.status = 'paid' OR (b.status = 'pending_payment' AND b.hold_expires_at > now()));
    IF used >= s.capacity THEN
      RETURN QUERY SELECT NULL::uuid, NULL::text, 'SLOT_FULL'::text, '{}'::text[]; RETURN;
    END IF;
  END LOOP;

  SELECT coalesce(sum(sl.capacity), 0) INTO total_cap FROM public.ai_booking_slots sl;
  SELECT count(*) INTO live_pending FROM public.ai_booking_slot_holds h
    JOIN public.ai_bookings b ON b.id = h.booking_id
    WHERE b.status = 'pending_payment' AND b.hold_expires_at > now() AND NOT (b.id = ANY(prev_ids));
  IF (live_pending + array_length(p_slot_ids, 1)) * 2 > total_cap THEN
    INSERT INTO public.ai_booking_guard (name, until) VALUES ('hoard_breaker', now() + interval '5 minutes')
      ON CONFLICT (name) DO UPDATE SET until = EXCLUDED.until;
    RETURN QUERY SELECT NULL::uuid, NULL::text, 'HOARD_TRIPPED'::text, '{}'::text[]; RETURN;
  END IF;

  IF array_length(prev_ids, 1) IS NOT NULL THEN
    UPDATE public.ai_bookings b SET status = 'cancelled' WHERE b.id = ANY(prev_ids);
  END IF;

  LOOP
    ref := 'CGH-TT27-';
    FOR i IN 1..5 LOOP
      ref := ref || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.ai_bookings b WHERE b.reference = ref);
  END LOOP;
  INSERT INTO public.ai_bookings (reference, first_name, last_name, email, phone, product_id, product_label,
    day_key, amount_usd, hold_expires_at, terms_accepted_at, source)
  VALUES (ref, p_first, p_last, v_email, v_phone, p_product_id, p_product_label,
    p_day_key, p_amount, now() + interval '15 minutes', now(), coalesce(p_source, 'other'))
  RETURNING public.ai_bookings.id INTO new_id;
  INSERT INTO public.ai_booking_slot_holds (booking_id, slot_id) SELECT new_id, unnest(p_slot_ids);
  RETURN QUERY SELECT new_id, ref, NULL::text, prev_sessions;
END;
$$;
REVOKE ALL ON FUNCTION public.reserve_ai_booking(text, text, text, text, text, text, text, integer, uuid[], text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_ai_booking(text, text, text, text, text, text, text, integer, uuid[], text, text) TO service_role;
-- END booking-limits
