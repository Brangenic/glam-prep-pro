import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";

const migration = readFileSync("drizzle/migrations/0003_restrict_sync_records_to_service_role.sql", "utf8");
let db: PGlite;

beforeEach(async () => {
  db = new PGlite();
  await db.exec(`
    CREATE ROLE anon;
    CREATE ROLE authenticated;
    CREATE ROLE service_role BYPASSRLS;
    CREATE TABLE public.sync_state (source_key text PRIMARY KEY, status text);
    INSERT INTO public.sync_state VALUES ('blog_posts', 'success');
    GRANT ALL ON public.sync_state TO anon, authenticated, service_role;
    ALTER TABLE public.sync_state ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Authenticated can read sync state" ON public.sync_state
      FOR SELECT TO authenticated USING (true);
  `);
  await db.exec(migration);
});

afterEach(async () => { await db.close(); });

describe("operational sync records", () => {
  it("denies ordinary signed-in users every table privilege and actual reads", async () => {
    await db.exec("SET ROLE authenticated");
    for (const command of ["SELECT", "INSERT", "UPDATE", "DELETE"]) {
      const result = await db.query<{ allowed: boolean }>(
        "SELECT has_table_privilege(current_user, 'public.sync_state', $1) AS allowed", [command]);
      expect(result.rows[0].allowed).toBe(false);
    }
    await expect(db.query("SELECT * FROM public.sync_state")).rejects.toThrow(/permission denied/);
  });

  it("denies anonymous reads and writes", async () => {
    await db.exec("SET ROLE anon");
    await expect(db.query("SELECT * FROM public.sync_state")).rejects.toThrow(/permission denied/);
    await expect(db.exec("UPDATE public.sync_state SET status = 'error'")).rejects.toThrow(/permission denied/);
  });

  it("keeps existing records and service reads and writes working", async () => {
    await db.exec("SET ROLE service_role");
    expect((await db.query("SELECT * FROM public.sync_state")).rows).toEqual([
      { source_key: "blog_posts", status: "success" },
    ]);
    await db.exec("UPDATE public.sync_state SET status = 'syncing' WHERE source_key = 'blog_posts'");
    expect((await db.query<{ status: string }>("SELECT status FROM public.sync_state")).rows[0].status).toBe("syncing");
  });
});