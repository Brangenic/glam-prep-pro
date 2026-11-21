import { describe, it, expect } from "vitest";
import { authoriseAdminOrCron, timingSafeEqual, type AdminOrCronDeps } from "../../supabase/functions/_shared/adminOrCronCore";

const CRON = "c".repeat(64);
const SERVICE = "service-role-key";
const ANON = "anon-key-jwt";
const ADMIN_JWT = "admin-user-jwt";
const USER_JWT = "plain-user-jwt";

const deps: AdminOrCronDeps = {
  serviceRoleKey: SERVICE,
  getCronSecret: async () => CRON,
  getClaims: async (token) => {
    if (token === ANON) return { role: "anon" }; // the anon key is a valid JWT with no user
    if (token === ADMIN_JWT) return { role: "authenticated", sub: "admin-id" };
    if (token === USER_JWT) return { role: "authenticated", sub: "user-id" };
    return null;
  },
  isAdmin: async (id) => id === "admin-id",
};

const run = (h: Record<string, string>) => authoriseAdminOrCron(new Headers(h), deps);

describe("requireAdminOrCron", () => {
  it("rejects a request with no header", async () => {
    expect(await run({})).toMatchObject({ ok: false, status: 401 });
  });
  it("rejects the anon key as bearer", async () => {
    expect(await run({ Authorization: `Bearer ${ANON}` })).toMatchObject({ ok: false, status: 401 });
  });
  it("rejects a signed-in user who is not an admin", async () => {
    expect(await run({ Authorization: `Bearer ${USER_JWT}` })).toMatchObject({ ok: false, status: 403 });
  });
  it("rejects a wrong cron secret even with a valid admin bearer", async () => {
    expect(await run({ "x-cron-secret": "wrong", Authorization: `Bearer ${ADMIN_JWT}` })).toMatchObject({ ok: false, status: 401 });
  });
  it("accepts the correct cron secret", async () => {
    expect(await run({ "x-cron-secret": CRON })).toMatchObject({ ok: true, caller: "cron" });
  });
  it("accepts an admin", async () => {
    expect(await run({ Authorization: `Bearer ${ADMIN_JWT}` })).toMatchObject({ ok: true, caller: "admin", userId: "admin-id" });
  });
  it("accepts the service-role key as bearer", async () => {
    expect(await run({ Authorization: `Bearer ${SERVICE}` })).toMatchObject({ ok: true, caller: "service" });
  });
  it("rejects a cron secret when none is stored", async () => {
    const r = await authoriseAdminOrCron(new Headers({ "x-cron-secret": "" }), { ...deps, getCronSecret: async () => null });
    expect(r).toMatchObject({ ok: false, status: 401 });
  });
  it("compares in constant time without length leaks", () => {
    expect(timingSafeEqual("abc", "abc")).toBe(true);
    expect(timingSafeEqual("abc", "abd")).toBe(false);
    expect(timingSafeEqual("abc", "abcd")).toBe(false);
  });
});
