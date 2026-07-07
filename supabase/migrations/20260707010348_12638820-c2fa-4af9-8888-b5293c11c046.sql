
-- 1. Restrict profiles SELECT to owner only
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 2. Move has_role to private schema so it isn't exposed via PostgREST
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, anon, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Recreate policies that referenced public.has_role to use private.has_role
-- site_config
DROP POLICY IF EXISTS "Admins can delete site config" ON public.site_config;
DROP POLICY IF EXISTS "Admins can insert site config" ON public.site_config;
DROP POLICY IF EXISTS "Admins can update site config" ON public.site_config;
CREATE POLICY "Admins can delete site config" ON public.site_config
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can insert site config" ON public.site_config
  FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update site config" ON public.site_config
  FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- generated_content
DROP POLICY IF EXISTS "Admins can delete content" ON public.generated_content;
DROP POLICY IF EXISTS "Admins can insert content" ON public.generated_content;
DROP POLICY IF EXISTS "Admins can read all content" ON public.generated_content;
DROP POLICY IF EXISTS "Admins can update content" ON public.generated_content;
CREATE POLICY "Admins can delete content" ON public.generated_content
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can insert content" ON public.generated_content
  FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can read all content" ON public.generated_content
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update content" ON public.generated_content
  FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- user_roles
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can read roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can read roles" ON public.user_roles
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- storage.objects (blog-images admin policies)
DROP POLICY IF EXISTS "Admins can delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload blog images" ON storage.objects;
CREATE POLICY "Admins can delete blog images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'blog-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update blog images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can upload blog images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-images' AND private.has_role(auth.uid(), 'admin'::public.app_role));

-- Remove the public listing policy on blog-images (files remain accessible via public URL because bucket is public)
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;

-- Drop the old public.has_role now that nothing references it
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
