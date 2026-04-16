
-- Create blog-images storage bucket (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true);

-- Public read access for blog images
CREATE POLICY "Public can view blog images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-images');

-- Service role can upload (edge functions use service role key)
CREATE POLICY "Service role can upload blog images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Service role can update blog images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'blog-images');

CREATE POLICY "Service role can delete blog images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'blog-images');
