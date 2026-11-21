// Pure authorisation rules for the content generators. Import-free so
// vitest can test it; requireAdminOrCron.ts wires it to Deno and the backend.

export type Claims = { sub?: string; role?: string } & Record<string, unknown>;

export type AdminOrCronDeps = {
  /** SUPABASE_SERVICE_ROLE_KEY, accepted as an internal caller (admin-chat). */
  serviceRoleKey?: string | null;
  /** private.internal_secrets cron_secret, or null when unavailable. */
  getCronSecret: () => Promise<string | null>;
  /** Verified JWT claims (auth.getClaims), or null when the token is invalid. */
  getClaims: (token: string) => Promise<Claims | null>;
  /** True when the user holds the admin role in user_roles. */
  isAdmin: (userId: string) => Promise<boolean>;
};

export type AdminOrCronResult =
  | { ok: true; caller: "cron" | "service" | "admin"; userId?: string }
  | { ok: false; status: 401 | 403; error: string };

/** Constant-time string comparison. Length differences still take the full loop. */
export function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const x = enc.encode(a);
  const y = enc.encode(b);
  const len = Math.max(x.length, y.length);
  let diff = x.length ^ y.length;
  for (let i = 0; i < len; i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

const deny = (status: 401 | 403, error: string): AdminOrCronResult => ({ ok: false, status, error });

/**
 * Allows a request only when it carries the correct x-cron-secret, the
 * service-role key as bearer, or a signed-in user's JWT whose user is an
 * admin. The anon key is a valid JWT with role "anon" and no user, so it is
 * rejected.
 */
export async function authoriseAdminOrCron(headers: Headers, deps: AdminOrCronDeps): Promise<AdminOrCronResult> {
  const cron = headers.get("x-cron-secret");
  if (cron !== null) {
    const secret = await deps.getCronSecret();
    if (secret && cron.length > 0 && timingSafeEqual(cron, secret)) return { ok: true, caller: "cron" };
    return deny(401, "Unauthorized");
  }

  const auth = headers.get("authorization") ?? "";
  if (!/^Bearer\s+\S+/i.test(auth)) return deny(401, "Unauthorized");
  const token = auth.replace(/^Bearer\s+/i, "").trim();

  if (deps.serviceRoleKey && timingSafeEqual(token, deps.serviceRoleKey)) return { ok: true, caller: "service" };

  const claims = await deps.getClaims(token);
  if (!claims || claims.role !== "authenticated" || typeof claims.sub !== "string" || !claims.sub) {
    return deny(401, "Unauthorized");
  }
  if (!(await deps.isAdmin(claims.sub))) return deny(403, "Admin access required");
  return { ok: true, caller: "admin", userId: claims.sub };
}
