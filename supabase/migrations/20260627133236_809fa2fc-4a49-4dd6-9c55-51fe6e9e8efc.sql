
-- Tighten blog-images bucket: remove permissive public write policies.
-- Service role bypasses RLS, so backend/admin uploads continue to work.
-- Public SELECT policy is preserved so images remain readable on the site.
DROP POLICY IF EXISTS "Service role can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can delete blog images" ON storage.objects;

-- Restrict writes to admins (service_role bypasses RLS regardless).
CREATE POLICY "Admins can upload blog images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blog images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blog images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));
