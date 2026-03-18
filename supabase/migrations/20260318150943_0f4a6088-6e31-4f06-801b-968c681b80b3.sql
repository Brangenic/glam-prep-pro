-- Create helper function for updated_at timestamps
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Reviews synced from public Google page
CREATE TABLE IF NOT EXISTS public.google_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text NOT NULL UNIQUE,
  author_name text,
  rating integer CHECK (rating BETWEEN 1 AND 5),
  quote text NOT NULL,
  location text,
  review_date text,
  review_url text,
  raw_payload jsonb,
  synced_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Products synced from Amazon storefront
CREATE TABLE IF NOT EXISTS public.amazon_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text NOT NULL UNIQUE,
  title text NOT NULL,
  price_text text,
  image_url text,
  product_url text NOT NULL,
  category text,
  raw_payload jsonb,
  synced_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Last sync timestamps and status per source
CREATE TABLE IF NOT EXISTS public.sync_state (
  source_key text PRIMARY KEY,
  source_url text NOT NULL,
  last_synced_at timestamptz,
  status text NOT NULL DEFAULT 'idle',
  message text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.google_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amazon_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_state ENABLE ROW LEVEL SECURITY;

-- Public read policies for website pages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'google_reviews' AND policyname = 'Public can read google reviews'
  ) THEN
    CREATE POLICY "Public can read google reviews"
    ON public.google_reviews
    FOR SELECT
    USING (true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'amazon_products' AND policyname = 'Public can read amazon products'
  ) THEN
    CREATE POLICY "Public can read amazon products"
    ON public.amazon_products
    FOR SELECT
    USING (true);
  END IF;
END
$$;

-- Restrict sync_state read to authenticated users only (operational metadata)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'sync_state' AND policyname = 'Authenticated can read sync state'
  ) THEN
    CREATE POLICY "Authenticated can read sync state"
    ON public.sync_state
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;
END
$$;

-- Timestamps triggers
DROP TRIGGER IF EXISTS set_google_reviews_updated_at ON public.google_reviews;
CREATE TRIGGER set_google_reviews_updated_at
BEFORE UPDATE ON public.google_reviews
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_amazon_products_updated_at ON public.amazon_products;
CREATE TRIGGER set_amazon_products_updated_at
BEFORE UPDATE ON public.amazon_products
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_sync_state_updated_at ON public.sync_state;
CREATE TRIGGER set_sync_state_updated_at
BEFORE UPDATE ON public.sync_state
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Seed sync sources
INSERT INTO public.sync_state (source_key, source_url, status)
VALUES
  ('google_reviews', 'https://www.google.com/search?q=carnival+glam+hub+reviews', 'idle'),
  ('amazon_store', 'https://www.amazon.com/shop/carnivalglamhub?ccs_id=7e98f14b-a852-49d9-a50d-4fb90fee34c8', 'idle')
ON CONFLICT (source_key) DO NOTHING;