ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS content text;