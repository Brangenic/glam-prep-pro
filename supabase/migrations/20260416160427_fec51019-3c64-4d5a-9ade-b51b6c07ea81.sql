
-- Key-value store for dynamic site configuration
CREATE TABLE public.site_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Anyone can read site config (frontend needs it)
CREATE POLICY "Public can read site config"
  ON public.site_config FOR SELECT
  USING (true);

-- Only admins can modify
CREATE POLICY "Admins can insert site config"
  ON public.site_config FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site config"
  ON public.site_config FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site config"
  ON public.site_config FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Seed default values
INSERT INTO public.site_config (key, value) VALUES
  ('hero_headline', 'Your Carnival Morning Starts Here'),
  ('hero_subtitle', 'Luxury glam, costume dressing, and concierge-style preparation for masqueraders who want to hit the road looking flawless.'),
  ('hero_subtext', 'From makeup to final touches — we handle everything so you can focus on the experience.'),
  ('hero_cta_text', 'Book Your Carnival Glam'),
  ('cta_headline', 'Secure Your Carnival Glam Slot'),
  ('cta_description', 'Carnival morning appointments are limited and typically sell out early. Reserve your spot now to ensure a smooth, stress-free start to your Carnival day.'),
  ('cta_button_text', 'Book Your Glam Appointment'),
  ('announcement_banner', '');
