// Shared payment reconciliation and email sending for the AI booking app.
import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";
import { accountsEmail, receiptEmail, ACCOUNTS_EMAIL, type EmailBooking } from "./glamHubEmails.ts";

import catalogue from "./glamHubCatalogue.json" with { type: "json" };

// Venue and inclusions come from the generated catalogue, never retyped.
export const TRINIDAD_VENUE: string = catalogue.venue;
export const INCLUSIONS: string[] = catalogue.inclusions;

export function serviceClient(): SupabaseClient {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });
}

type StripeSession = {
  id: string;
  payment_status?: string;
  amount_total?: number | null;
  currency?: string | null;
  payment_intent?: string | { id: string } | null;
  metadata?: Record<string, string> | null;
};

/** Marks a booking paid from a Stripe Checkout Session. Returns the booking id or null. */
export async function markPaidFromSession(db: SupabaseClient, s: StripeSession): Promise<string | null> {
  if (s.payment_status !== "paid") return null;
  const bookingId = s.metadata?.booking_id;
  if (!bookingId) { console.error("ALERT session without booking_id", s.id); return null; }
  const { data: b } = await db.from("ai_bookings").select("id,amount_usd,status").eq("id", bookingId).eq("stripe_checkout_session_id", s.id).maybeSingle();
  if (!b) { console.error("ALERT no booking matches session", s.id, bookingId); return null; }
  if (s.amount_total !== b.amount_usd * 100 || (s.currency ?? "").toLowerCase() !== "usd") {
    console.error(`ALERT amount mismatch for ${bookingId}: got ${s.amount_total} ${s.currency}, expected ${b.amount_usd * 100} usd`);
    return null;
  }
  if (b.status !== "paid") {
    const pi = typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id ?? null;
    const { error } = await db.from("ai_bookings").update({ status: "paid", paid_at: new Date().toISOString(), stripe_payment_intent_id: pi }).eq("id", bookingId);
    if (error) throw new Error(error.message);
  }
  return bookingId;
}

async function loadEmailBooking(db: SupabaseClient, id: string) {
  const { data: b } = await db.from("ai_bookings").select("*").eq("id", id).maybeSingle();
  if (!b) return null;
  const { data: holds } = await db.from("ai_booking_slot_holds").select("slot_id, ai_booking_slots(id,event_day,slot_time,capacity)").eq("booking_id", id);
  const { data: avail } = await db.rpc("ai_slot_availability");
  let overbooked = false;
  const days = (holds ?? []).map((h: any) => {
    const sl = h.ai_booking_slots;
    // Paid count per slot, to detect overbooking.
    const a = (avail as any[] | null)?.find((r) => r.event_day === sl.event_day && r.slot_time === sl.slot_time);
    return { day: sl.event_day, time: String(sl.slot_time).slice(0, 5), spotsLeft: a?.spots_left, slotId: sl.id, capacity: sl.capacity };
  });
  for (const d of days) {
    const { data: rows } = await db.from("ai_booking_slot_holds").select("booking_id, ai_bookings!inner(status)").eq("slot_id", d.slotId).eq("ai_bookings.status", "paid");
    if ((rows?.length ?? 0) > d.capacity) overbooked = true;
  }
  const eb: EmailBooking = {
    reference: b.reference, firstName: b.first_name, lastName: b.last_name, email: b.email, phone: b.phone,
    productLabel: b.product_label, amountUsd: b.amount_usd,
    days: days.map(({ day, time, spotsLeft }) => ({ day, time, spotsLeft })),
    paymentIntentId: b.stripe_payment_intent_id, paidAt: b.paid_at ?? new Date().toISOString(),
    source: b.source ?? "other", venue: TRINIDAD_VENUE, inclusions: INCLUSIONS, overbooked,
  };
  return { row: b, eb };
}

const b64 = (s: string) => btoa(Array.from(new TextEncoder().encode(s), (c) => String.fromCharCode(c)).join(""));
const hdr = (v: string) => (/^[\x00-\x7F]*$/.test(v) ? v : `=?UTF-8?B?${b64(v)}?=`);

async function gmailSend(to: string, subject: string, text: string, html?: string): Promise<boolean> {
  const lovable = Deno.env.get("LOVABLE_API_KEY");
  const gmail = Deno.env.get("GOOGLE_MAIL_API_KEY");
  if (!lovable || !gmail) { console.warn("Gmail connector not linked, skipping send to", to); return false; }
  const boundary = `cgh${crypto.randomUUID().replace(/-/g, "")}`;
  const head = [`From: Carnival Glam Hub <${ACCOUNTS_EMAIL}>`, `To: ${to}`, `Subject: ${hdr(subject)}`, "MIME-Version: 1.0"];
  const msg = html
    ? [...head, `Content-Type: multipart/alternative; boundary="${boundary}"`, "",
       `--${boundary}`, 'Content-Type: text/plain; charset="UTF-8"', "Content-Transfer-Encoding: base64", "", b64(text),
       `--${boundary}`, 'Content-Type: text/html; charset="UTF-8"', "Content-Transfer-Encoding: base64", "", b64(html),
       `--${boundary}--`].join("\r\n")
    : [...head, 'Content-Type: text/plain; charset="UTF-8"', "Content-Transfer-Encoding: base64", "", b64(text)].join("\r\n");
  const raw = b64(msg).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const r = await fetch("https://connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${lovable}`, "X-Connection-Api-Key": gmail, "Content-Type": "application/json" },
    body: JSON.stringify({ raw }),
  });
  if (!r.ok) { console.error(`Gmail send failed [${r.status}]: ${await r.text()}`); return false; }
  return true;
}

/** Sends whichever of the two emails has not yet gone. Safe to call repeatedly. */
export async function sendBookingEmails(db: SupabaseClient, id: string): Promise<{ notification: boolean; receipt: boolean }> {
  const loaded = await loadEmailBooking(db, id);
  if (!loaded || loaded.row.status !== "paid") return { notification: false, receipt: false };
  const { row, eb } = loaded;
  let notification = !!row.notification_sent_at, receipt = !!row.receipt_sent_at;
  if (!notification) {
    const a = accountsEmail(eb);
    if (await gmailSend(ACCOUNTS_EMAIL, a.subject, a.text)) {
      notification = true;
      await db.from("ai_bookings").update({ notification_sent_at: new Date().toISOString() }).eq("id", id).is("notification_sent_at", null);
    }
  }
  if (!receipt) {
    const r = receiptEmail(eb);
    if (await gmailSend(eb.email, r.subject, r.text, r.html)) {
      receipt = true;
      await db.from("ai_bookings").update({ receipt_sent_at: new Date().toISOString() }).eq("id", id).is("receipt_sent_at", null);
    }
  }
  return { notification, receipt };
}
