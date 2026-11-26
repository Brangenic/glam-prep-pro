-- Sync records are operational only; the admin dashboard never queries this table.
DROP POLICY IF EXISTS "Authenticated can read sync state" ON public.sync_state;
REVOKE ALL PRIVILEGES ON TABLE public.sync_state FROM PUBLIC, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.sync_state TO service_role;
ALTER TABLE public.sync_state ENABLE ROW LEVEL SECURITY;