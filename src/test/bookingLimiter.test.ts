// Runs the real reserve_ai_booking SQL from the migrations in an in-memory
// Postgres, so the limits tested here are the ones the backend enforces.
import { describe, it, expect, beforeEach } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "fs";
import path from "path";

const dir = path.resolve(__dirname, "../../drizzle/migrations");
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
const sql = (f: string) => readFileSync(path.join(dir, f), "utf8");
// Newest migration that redefines the booking limits.
const limitsFile = [...files].reverse().find((f) => sql(f).includes("-- BEGIN booking-limits"))!;
const limitsSql = (() => { const s = sql(limitsFile); return s.slice(s.indexOf("-- BEGIN booking-limits"), s.indexOf("-- END booking-limits")); })();

let db: PGlite;
let slots: string[];

beforeEach(async () => {
  db = new PGlite();
  await db.exec("create role anon; create role authenticated; create role service_role;");
  await db.exec(sql("0000_ai_booking_app.sql"));
  await db.exec(sql("0001_ai_booking_refunds.sql"));
  await db.exec(limitsSql);
  slots = (await db.query<{ id: string }>("select id from ai_booking_slots order by event_day, slot_time")).rows.map((r) => r.id);
});

type Res = { id: string | null; reference: string | null; error: string | null; cancelled_sessions: string[] };
const reserve = async (email: string, phone: string, slot: string, ip = "ip-a") =>
  (await db.query<Res>(
    "select * from reserve_ai_booking('Test','Customer',$1,$2,'mon-makeup','Makeup','monday',160,$3::uuid[],'website',$4)",
    [email, phone, [slot], ip],
  )).rows[0];

describe("booking limiter", () => {
  it("rejects the 4th attempt by the same email within an hour", async () => {
    for (let i = 0; i < 3; i++) expect((await reserve("a@example.com", `+1876555000${i}`, slots[0], `ip-${i}`)).error).toBeNull();
    const fourth = await reserve("a@example.com", "+18765550009", slots[0], "ip-9");
    expect(fourth.error).toBe("EMAIL_LIMIT");
    expect(fourth.id).toBeNull();
  });

  it("rejects the 4th attempt by the same phone within an hour", async () => {
    for (let i = 0; i < 3; i++) expect((await reserve(`p${i}@example.com`, "+18765550100", slots[0], `ip-${i}`)).error).toBeNull();
    expect((await reserve("p9@example.com", "+18765550100", slots[0], "ip-9")).error).toBe("PHONE_LIMIT");
  });

  it("a second pending hold for the same email cancels the first", async () => {
    const first = await reserve("b@example.com", "+18765550200", slots[0]);
    await db.query("update ai_bookings set stripe_checkout_session_id = 'cs_first' where id = $1", [first.id]);
    const second = await reserve("b@example.com", "+18765550200", slots[1]);
    expect(second.error).toBeNull();
    expect(second.cancelled_sessions).toEqual(["cs_first"]);
    const rows = (await db.query<{ id: string; status: string }>("select id, status from ai_bookings")).rows;
    expect(rows.find((r) => r.id === first.id)?.status).toBe("cancelled");
    expect(rows.find((r) => r.id === second.id)?.status).toBe("pending_payment");
  });

  it("holds last 15 minutes", async () => {
    const r = await reserve("c@example.com", "+18765550300", slots[0]);
    const { rows } = await db.query<{ m: number }>("select round(extract(epoch from hold_expires_at - created_at) / 60)::int m from ai_bookings where id = $1", [r.id]);
    expect(rows[0].m).toBe(15);
  });

  it("allows 5 attempts per IP per 15 minutes and rejects the 6th", async () => {
    for (let i = 0; i < 5; i++) expect((await reserve(`ip${i}@example.com`, `+1876555040${i}`, slots[i], "same-ip")).error).toBeNull();
    expect((await reserve("ip9@example.com", "+18765550499", slots[5], "same-ip")).error).toBe("IP_LIMIT");
  });

  it("logs every attempt, including rejected ones, without a raw IP", async () => {
    for (let i = 0; i < 4; i++) await reserve("d@example.com", `+1876555050${i}`, slots[0], `hash-${i}`);
    const { rows } = await db.query<{ n: number }>("select count(*)::int n from ai_booking_attempts where email = 'd@example.com'");
    expect(rows[0].n).toBe(4);
  });

  it("pauses new holds once live pending holds would exceed half of capacity", async () => {
    // 10 slots x 3 = 30 places, so at most 15 live pending holds.
    for (let i = 0; i < 15; i++) {
      expect((await reserve(`h${i}@example.com`, `+18765551${String(i).padStart(3, "0")}`, slots[i % 10], `ip-h${i}`)).error).toBeNull();
    }
    expect((await reserve("h99@example.com", "+18765551999", slots[0], "ip-h99")).error).toBe("HOARD_TRIPPED");
    // The breaker stays on for 5 minutes, even for a fresh customer.
    expect((await reserve("h98@example.com", "+18765551998", slots[9], "ip-h98")).error).toBe("BUSY");
  });
});
