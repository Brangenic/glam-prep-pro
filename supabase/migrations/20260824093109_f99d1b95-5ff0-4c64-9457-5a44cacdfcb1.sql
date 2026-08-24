ALTER TABLE public.station_rental_enquiries
  ADD COLUMN IF NOT EXISTS enquiry_type text NOT NULL DEFAULT 'Station rental';

ALTER TABLE public.station_rental_enquiries
  ALTER COLUMN service_type DROP NOT NULL;