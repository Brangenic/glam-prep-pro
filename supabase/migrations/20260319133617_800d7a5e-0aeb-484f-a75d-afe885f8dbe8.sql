CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  image_url text,
  post_url text NOT NULL,
  author_name text,
  author_avatar_url text,
  published_date text,
  read_time text,
  raw_payload jsonb,
  synced_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read blog posts"
  ON public.blog_posts
  FOR SELECT
  TO public
  USING (true);

CREATE TRIGGER set_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.sync_state (source_key, source_url, status)
VALUES ('blog_posts', 'https://kibwemcgann.wixsite.com/website-5/blog', 'idle')
ON CONFLICT (source_key) DO NOTHING;