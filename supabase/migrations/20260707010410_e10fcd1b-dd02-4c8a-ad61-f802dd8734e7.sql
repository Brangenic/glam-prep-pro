
-- Trigger/helper functions should not be callable from the API
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- private.has_role: only authenticated users need to execute during RLS checks
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
-- Keep EXECUTE for authenticated + service_role (already granted)

-- Lock schema usage so anon can't traverse private
REVOKE USAGE ON SCHEMA private FROM anon;
