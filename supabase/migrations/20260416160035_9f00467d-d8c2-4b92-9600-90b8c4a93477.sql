INSERT INTO public.user_roles (user_id, role)
VALUES ('60359854-d81f-4a49-98ca-3c3300be9d91', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;