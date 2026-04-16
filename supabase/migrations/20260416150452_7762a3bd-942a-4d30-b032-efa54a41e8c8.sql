
-- Carnival territories configuration
CREATE TABLE public.territories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  country text NOT NULL,
  slug text NOT NULL UNIQUE,
  event_dates text,
  keywords text[] DEFAULT '{}',
  hashtags text[] DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.territories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read territories" ON public.territories FOR SELECT USING (true);

CREATE TRIGGER update_territories_updated_at
  BEFORE UPDATE ON public.territories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- AI-generated content pieces
CREATE TABLE public.generated_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  territory_id uuid REFERENCES public.territories(id) ON DELETE CASCADE,
  content_type text NOT NULL DEFAULT 'social_post',
  channel text NOT NULL DEFAULT 'instagram',
  title text,
  body text NOT NULL,
  hashtags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft',
  source_data jsonb,
  ai_model text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published content" ON public.generated_content
  FOR SELECT USING (status = 'published');

CREATE TRIGGER update_generated_content_updated_at
  BEFORE UPDATE ON public.generated_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed carnival territories
INSERT INTO public.territories (name, country, slug, event_dates, keywords, hashtags) VALUES
  ('Trinidad Carnival', 'Trinidad and Tobago', 'trinidad', 'February - March', ARRAY['soca','mas','fete','road march'], ARRAY['#TrinidadCarnival','#Soca','#MasDay']),
  ('Jamaica Carnival', 'Jamaica', 'jamaica', 'April', ARRAY['soca','dancehall','road march'], ARRAY['#JamaicaCarnival','#Bacchanal']),
  ('Antigua Carnival', 'Antigua and Barbuda', 'antigua', 'July - August', ARRAY['j''ouvert','mas','calypso'], ARRAY['#AntiguaCarnival']),
  ('Barbados Crop Over', 'Barbados', 'barbados', 'June - August', ARRAY['crop over','kadooment','soca'], ARRAY['#CropOver','#Kadooment']),
  ('St. Lucia Carnival', 'Saint Lucia', 'st-lucia', 'July', ARRAY['lucian carnival','soca','mas'], ARRAY['#SaintLuciaCarnival']),
  ('Grenada Spicemas', 'Grenada', 'grenada', 'August', ARRAY['spicemas','j''ouvert','shortknee'], ARRAY['#Spicemas','#GrenadaCarnival']),
  ('Tobago Carnival', 'Tobago', 'tobago', 'October', ARRAY['tobago carnival','soca'], ARRAY['#TobagoCarnival']),
  ('Miami Carnival', 'United States', 'miami', 'October', ARRAY['miami carnival','soca','jouvert'], ARRAY['#MiamiCarnival']),
  ('Atlanta Caribbean Carnival', 'United States', 'atlanta', 'May - June', ARRAY['atlanta carnival','caribbean'], ARRAY['#AtlantaCarnival']),
  ('Toronto Caribbean Carnival', 'Canada', 'toronto', 'July - August', ARRAY['caribana','toronto carnival'], ARRAY['#Caribana','#TorontoCarnival']);
