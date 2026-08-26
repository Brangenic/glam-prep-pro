REVOKE ALL ON FUNCTION public.glam_match_purge_uploads() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.glam_match_purge_previews_and_leads() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.glam_match_purge_uploads() TO postgres, service_role;
GRANT EXECUTE ON FUNCTION public.glam_match_purge_previews_and_leads() TO postgres, service_role;