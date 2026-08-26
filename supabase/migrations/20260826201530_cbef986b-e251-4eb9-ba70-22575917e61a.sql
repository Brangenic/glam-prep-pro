-- Glam Match backend: leads, uploads, analysis, looks and events.
-- LEGAL REQUIREMENT: we publish to customers that "your photo is deleted within 24 hours".
-- The retention jobs scheduled at the bottom of this migration are therefore a legal
-- requirement, not a nicety. They must remain scheduled and working at all times.

CREATE TABLE public.glam_match_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  consent_at timestamptz NOT NULL,
  ip_hash text,
  destination_slug text,
  placement text,
  email text,
  whatsapp text,
  marketing_opt_in boolean NOT NULL DEFAULT false,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days')
);

CREATE TABLE public.glam_match_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.glam_match_leads(id) ON DELETE CASCADE,
  costume_path text,
  selfie_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  purge_after timestamptz NOT NULL DEFAULT (now() + interval '24 hours')
);

CREATE TABLE public.glam_match_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.glam_match_leads(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  skin_tone text,
  undertone text,
  depth_notes text,
  primary_colour text,
  secondary_colour text,
  accent_colour text,
  metallic_colour text,
  gem_tone text,
  mood text,
  intensity text,
  direction jsonb,
  confidence text,
  notes text
);

CREATE TABLE public.glam_match_looks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.glam_match_leads(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  look_type text,
  look_name text,
  eye_description text,
  lid_colour text,
  crease_colour text,
  glitter text,
  liner text,
  lash text,
  lip_colour text,
  bronzing text,
  gem_placement text,
  hair text,
  why_it_works text,
  best_match boolean NOT NULL DEFAULT false,
  preview_path text
);

CREATE TABLE public.glam_match_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  lead_id uuid,
  event text,
  detail jsonb
);

CREATE INDEX glam_match_uploads_purge_after_idx ON public.glam_match_uploads (purge_after);
CREATE INDEX glam_match_looks_lead_idx ON public.glam_match_looks (lead_id);
CREATE INDEX glam_match_leads_ip_hash_idx ON public.glam_match_leads (ip_hash, created_at);

-- Service role only. The browser never queries these tables; the edge functions
-- return everything the page needs in their JSON responses.
GRANT ALL ON public.glam_match_leads TO service_role;
GRANT ALL ON public.glam_match_uploads TO service_role;
GRANT ALL ON public.glam_match_analysis TO service_role;
GRANT ALL ON public.glam_match_looks TO service_role;
GRANT ALL ON public.glam_match_events TO service_role;

ALTER TABLE public.glam_match_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glam_match_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glam_match_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glam_match_looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glam_match_events ENABLE ROW LEVEL SECURITY;
-- No policies for anon or authenticated, deliberately. Service role bypasses RLS.

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Hourly purge of uploaded photos. Publishing "deleted within 24 hours" makes this
-- job a legal requirement, not a nicety.
CREATE OR REPLACE FUNCTION public.glam_match_purge_uploads()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  purged integer;
BEGIN
  DELETE FROM storage.objects o
  USING public.glam_match_uploads u
  WHERE o.bucket_id = 'glam-match-uploads'
    AND u.purge_after < now()
    AND o.name IN (u.costume_path, u.selfie_path);

  DELETE FROM public.glam_match_uploads WHERE purge_after < now();
  GET DIAGNOSTICS purged = ROW_COUNT;

  INSERT INTO public.glam_match_events (event, detail)
  VALUES ('retention.uploads_purged', jsonb_build_object('rows', purged));
END;
$$;

CREATE OR REPLACE FUNCTION public.glam_match_purge_previews_and_leads()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  previews integer;
  leads integer;
BEGIN
  DELETE FROM storage.objects
  WHERE bucket_id = 'glam-match-previews'
    AND created_at < now() - interval '30 days';
  GET DIAGNOSTICS previews = ROW_COUNT;

  UPDATE public.glam_match_looks
  SET preview_path = NULL
  WHERE preview_path IS NOT NULL
    AND created_at < now() - interval '30 days';

  DELETE FROM public.glam_match_leads
  WHERE expires_at < now()
    AND email IS NULL
    AND whatsapp IS NULL;
  GET DIAGNOSTICS leads = ROW_COUNT;

  INSERT INTO public.glam_match_events (event, detail)
  VALUES ('retention.daily_purge', jsonb_build_object('previews', previews, 'leads', leads));
END;
$$;

SELECT cron.schedule(
  'glam-match-purge-uploads-hourly',
  '7 * * * *',
  $$SELECT public.glam_match_purge_uploads();$$
);

SELECT cron.schedule(
  'glam-match-purge-daily',
  '23 3 * * *',
  $$SELECT public.glam_match_purge_previews_and_leads();$$
);