// Gate for autopilot-content, autopilot-engine and generate-content.
// Returns null when the caller may proceed, otherwise a 401/403 JSON response.
import { createClient } from "npm:@supabase/supabase-js@2";
import { authoriseAdminOrCron, type Claims } from "./adminOrCronCore.ts";

export async function requireAdminOrCron(req: Request, corsHeaders: Record<string, string>): Promise<Response | null> {
  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "";
  const respond = (status: number, error: string) =>
    new Response(JSON.stringify({ error }), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  if (!url || !serviceRoleKey) return respond(500, "Server not configured");

  const service = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
  try {
    const result = await authoriseAdminOrCron(req.headers, {
      serviceRoleKey,
      getCronSecret: async () => {
        const { data, error } = await service.rpc("internal_secret", { p_name: "cron_secret" });
        if (error) { console.error("cron secret lookup failed", error.message); return null; }
        return typeof data === "string" ? data : null;
      },
      getClaims: async (token: string) => {
        const client = createClient(url, anonKey, {
          auth: { persistSession: false },
          global: { headers: { Authorization: `Bearer ${token}` } },
        });
        const { data, error } = await client.auth.getClaims(token);
        if (error || !data?.claims) return null;
        return data.claims as Claims;
      },
      isAdmin: async (userId: string) => {
        const { data } = await service.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin");
        return (data?.length ?? 0) > 0;
      },
    });
    return result.ok ? null : respond(result.status, result.error);
  } catch (e) {
    console.error("requireAdminOrCron failed", (e as Error).message);
    return respond(401, "Unauthorized");
  }
}
