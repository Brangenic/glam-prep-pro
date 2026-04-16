-- Add source and meta_description to blog_posts
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'wix_sync',
  ADD COLUMN IF NOT EXISTS meta_description text;

-- Add auto_publish to generated_content
ALTER TABLE public.generated_content
  ADD COLUMN IF NOT EXISTS auto_publish boolean NOT NULL DEFAULT false;

-- Enable extensions for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;