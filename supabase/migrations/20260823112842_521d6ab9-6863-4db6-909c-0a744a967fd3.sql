CREATE TABLE public.station_rental_enquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  business_name text,
  service_type text NOT NULL,
  territory text NOT NULL,
  days_needed text NOT NULL,
  email text NOT NULL,
  whatsapp text NOT NULL,
  instagram text,
  message text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.station_rental_enquiries TO anon;
GRANT INSERT ON public.station_rental_enquiries TO authenticated;
GRANT ALL ON public.station_rental_enquiries TO service_role;

ALTER TABLE public.station_rental_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a station rental enquiry"
ON public.station_rental_enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);