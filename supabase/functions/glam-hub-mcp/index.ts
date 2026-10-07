// Glam Hub AI booking app: remote MCP server (stateless Streamable HTTP,
// JSON-RPC over POST /). Sells Trinidad Carnival 2027 makeup and
// photoshoot appointments with live slots and Stripe Checkout.
// Catalogue is generated from src/data; never hand-edit catalogue.json.
import { createClient } from "npm:@supabase/supabase-js@2";
import catalogue from "./catalogue.json" with { type: "json" };
import { WIDGET_URI, widgetHtml } from "./widget.ts";
import { markPaidFromSession, sendBookingEmails } from "../_shared/glamHubFulfil.ts";
import { prePaymentSummary, startBookingText, statusSummary } from "./copy.ts";

type Product = { id: string; label: string; day: "monday" | "tuesday" | "both"; price: number; tags: string[]; image_url: string; image_alt: string };
const CAT = catalogue as unknown as {
  event: string; venue: string; inclusions: string[]; products: Product[];
  slot_times: string[]; slot_capacity: number; dates: { day: string; display: string }[];
  terms: { summary: string[]; url: string };
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Expose-Headers": "Mcp-Session-Id",
};
const WHATSAPP = (catalogue as { whatsapp: string }).whatsapp; // from src/lib/constants.ts
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const FN_URL = `${SUPABASE_URL}/functions/v1/glam-hub-mcp`;
const LOGO = "https://www.carnivalglamhub.com/brand-logo.png";
const DAY_NAME: Record<string, string> = { monday: "Monday", tuesday: "Tuesday" };

function db() {
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!SUPABASE_URL || !key) throw new Error("Server not configured");
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false } });
}

type Avail = Record<string, { time: string; spots_left: number }[]>;
async function availability(): Promise<Avail> {
  const { data, error } = await db().rpc("ai_slot_availability");
  if (error) throw new Error(error.message);
  const out: Avail = { monday: [], tuesday: [] };
  for (const r of data as { event_day: string; slot_time: string; spots_left: number }[]) {
    out[r.event_day]?.push({ time: r.slot_time.slice(0, 5), spots_left: r.spots_left });
  }
  return out;
}

const UI_META = { ui: { resourceUri: WIDGET_URI }, "openai/outputTemplate": WIDGET_URI, "openai/widgetAccessible": true };
const SLOT_ENUM = CAT.slot_times;

const TOOLS = [
  {
    name: "get_trinidad_glam_options",
    title: "Trinidad Carnival 2027 glam options",
    description:
      "Returns Carnival Glam Hub's Trinidad Carnival 2027 makeup and photoshoot services at the Hilton Hotel, Port of Spain (Carnival Monday 8 and Tuesday 9 February 2027): venue, free inclusions, the eight services with US dollar prices, a Terms summary and live time-slot availability. Displays a booking card.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false },
    _meta: UI_META,
  },
  {
    name: "check_slot_availability",
    title: "Check time slots",
    description:
      "Returns the remaining places at each start time (04:00 to 08:00) for Carnival Monday, Carnival Tuesday or both days.",
    inputSchema: {
      type: "object",
      properties: { day: { type: "string", enum: ["monday", "tuesday", "both"] } },
      required: ["day"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "start_booking",
    title: "Start a booking",
    description:
      "Holds the chosen appointment time for 30 minutes and returns a Stripe Checkout link where the customer pays in full, plus a booking reference. Requires the service, a time for each booked day, first name, last name, email, cell number and accepted_terms, which records that the customer accepted the Terms. Prices are fixed; no discounts.",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", enum: CAT.products.map((p) => p.id) },
        monday_slot: { type: "string", enum: SLOT_ENUM },
        tuesday_slot: { type: "string", enum: SLOT_ENUM },
        first_name: { type: "string", minLength: 1, maxLength: 80 },
        last_name: { type: "string", minLength: 1, maxLength: 80 },
        email: { type: "string", format: "email", maxLength: 254 },
        phone: { type: "string", description: "Cell number with country code, for example +1 868 555 0100.", maxLength: 25 },
        accepted_terms: {
          type: "boolean",
          const: true,
          description: "True when the customer has accepted the booking Terms at https://www.carnivalglamhub.com/policies.",
        },
      },
      required: ["product_id", "first_name", "last_name", "email", "phone", "accepted_terms"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, openWorldHint: true, destructiveHint: false },
  },
  {
    name: "get_booking_status",
    title: "Booking status",
    description: "Returns whether a booking is pending or paid, given its reference and the email used to book.",
    inputSchema: {
      type: "object",
      properties: { reference: { type: "string", maxLength: 20 }, email: { type: "string", maxLength: 254 } },
      required: ["reference", "email"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
];
// Directory review: annotations.title mirrors each tool's top-level title.
for (const t of TOOLS) (t as { annotations: Record<string, unknown> }).annotations = { title: t.title, ...t.annotations };

function text(t: string, structured?: unknown, isError = false) {
  return { content: [{ type: "text", text: t }], ...(structured ? { structuredContent: structured } : {}), ...(isError ? { isError: true } : {}) };
}

function optionsPayload(av: Avail) {
  return {
    event: CAT.event, dates: CAT.dates, venue: CAT.venue, inclusions: CAT.inclusions,
    products: CAT.products.map((p) => ({ id: p.id, label: p.label, day: p.day, price_usd: p.price, image_url: p.image_url, image_alt: p.image_alt })),
    terms: CAT.terms, availability: av, payment: "Payable in full at booking. No discounts or codes.",
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function normPhone(p: string): string | null {
  const d = p.replace(/[\s().-]/g, "");
  return /^\+?\d{7,15}$/.test(d) ? (d.startsWith("+") ? d : `+${d}`) : null;
}

const SITE = "https://www.carnivalglamhub.com";

// One booking path for every channel. The AI app returns to the hosted
// confirmation pages; the website returns to carnivalglamhub.com.
async function startBooking(a: Record<string, unknown>, source: string) {
  const allowed = new Set(["product_id", "monday_slot", "tuesday_slot", "first_name", "last_name", "email", "phone", "accepted_terms"]);
  for (const k of Object.keys(a)) if (!allowed.has(k)) return text(`Unexpected field: ${k}. Prices are fixed and there are no discounts.`, undefined, true);
  if (a.accepted_terms !== true) return text(`The Terms must be accepted before booking: ${CAT.terms.url}`, undefined, true);
  const p = CAT.products.find((x) => x.id === a.product_id);
  if (!p) return text("Unknown service. Use one of the listed product ids.", undefined, true);
  const first = String(a.first_name ?? "").trim(), last = String(a.last_name ?? "").trim();
  const email = String(a.email ?? "").trim().toLowerCase();
  const phone = normPhone(String(a.phone ?? ""));
  if (!first || !last || first.length > 80 || last.length > 80) return text("First and last name are required.", undefined, true);
  if (!EMAIL_RE.test(email)) return text("Please give a valid email address.", undefined, true);
  if (!phone) return text("Please give a valid cell number with country code.", undefined, true);
  const days = p.day === "both" ? ["monday", "tuesday"] : [p.day];
  const picks: Record<string, string> = {};
  for (const d of days) {
    const s = a[`${d}_slot`];
    if (typeof s !== "string" || !SLOT_ENUM.includes(s)) return text(`Please choose a ${DAY_NAME[d]} time: ${SLOT_ENUM.join(", ")}.`, undefined, true);
    picks[d] = s;
  }
  for (const d of ["monday", "tuesday"]) if (!days.includes(d) && a[`${d}_slot`]) return text(`This service has no ${DAY_NAME[d]} appointment.`, undefined, true);

  const client = db();
  const { data: slots, error: se } = await client.from("ai_booking_slots").select("id,event_day,slot_time");
  if (se) throw new Error(se.message);
  const ids = days.map((d) => (slots as { id: string; event_day: string; slot_time: string }[]).find((s) => s.event_day === d && s.slot_time.slice(0, 5) === picks[d])?.id);
  if (ids.some((x) => !x)) return text("That time is not available.", undefined, true);

  const when = days.map((d) => `${DAY_NAME[d]} ${picks[d]}`).join(" and ");
  const { data: res, error } = await client.rpc("reserve_ai_booking", {
    p_first: first, p_last: last, p_email: email, p_phone: phone, p_product_id: p.id, p_product_label: p.label,
    p_day_key: p.day, p_amount: p.price, p_slot_ids: ids, p_source: source,
  });
  if (error) {
    if (error.message.includes("SLOT_FULL")) {
      const av = await availability();
      const open = days.map((d) => `${DAY_NAME[d]}: ${av[d].filter((s) => s.spots_left > 0).map((s) => s.time).join(", ") || "fully booked"}`).join("; ");
      return text(`Sorry, that time has just filled. Times still open, ${open}.`, { message: `That time has just filled. Still open, ${open}.`, availability: av });
    }
    throw new Error(error.message);
  }
  const row = (Array.isArray(res) ? res[0] : res) as { id: string; reference: string };
  const summary = prePaymentSummary(CAT.event, p.label, when, CAT.venue, p.price);

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    await client.from("ai_bookings").update({ status: "cancelled" }).eq("id", row.id);
    const m = `Online payment is being switched on, please Talk to JADE on WhatsApp ${WHATSAPP}`;
    return text(m, { message: m });
  }
  const f = new URLSearchParams();
  f.set("mode", "payment");
  f.set("customer_email", email);
  f.set("allow_promotion_codes", "false");
  // Collect nothing beyond name, email and cell, which we already hold.
  f.set("billing_address_collection", "auto");
  f.set("expires_at", String(Math.floor(Date.now() / 1000) + 30 * 60));
  f.set("line_items[0][quantity]", "1");
  f.set("line_items[0][price_data][currency]", "usd");
  f.set("line_items[0][price_data][unit_amount]", String(p.price * 100));
  f.set("line_items[0][price_data][product_data][name]", `Trinidad Carnival 2027, ${p.label}, ${when}`);
  for (const pre of ["metadata", "payment_intent_data[metadata]"]) {
    f.set(`${pre}[booking_id]`, row.id);
    f.set(`${pre}[reference]`, row.reference);
  }
  if (source === "website") {
    f.set("success_url", `${SITE}/trinidad/book/confirmed`);
    f.set("cancel_url", `${SITE}/trinidad/book/cancelled`);
  } else {
    f.set("success_url", `${FN_URL}/confirmed?ref=${row.reference}`);
    f.set("cancel_url", `${FN_URL}/cancelled?ref=${row.reference}`);
  }
  const sr = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${stripeKey}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: f,
  });
  const sj = await sr.json();
  if (!sr.ok) {
    console.error(`Stripe failed [${sr.status}]: ${JSON.stringify(sj)}`);
    await client.from("ai_bookings").update({ status: "cancelled" }).eq("id", row.id);
    const m = `We could not open checkout just now. Please try again, or Talk to JADE on WhatsApp ${WHATSAPP}`;
    return text(m, { message: m }, true);
  }
  await client.from("ai_bookings").update({ stripe_checkout_session_id: sj.id }).eq("id", row.id);
  const out = { reference: row.reference, checkout_url: sj.url, amount_usd: p.price, summary };
  return text(startBookingText(summary, row.reference, sj.url), out);
}

async function bookingStatus(a: Record<string, unknown>) {
  const ref = String(a.reference ?? "").trim().toUpperCase();
  const email = String(a.email ?? "").trim().toLowerCase();
  const { data } = await db().from("ai_bookings").select("reference,email,status,stripe_checkout_session_id,product_label,day_key,amount_usd,hold_expires_at").eq("reference", ref).maybeSingle();
  if (!data || data.email !== email) return text("No booking matches that reference and email.");
  // Fallback for a late webhook: reconcile a pending booking with Stripe.
  const key = Deno.env.get("STRIPE_SECRET_KEY");
  if (data.status === "pending_payment" && data.stripe_checkout_session_id && key) {
    try {
      const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${data.stripe_checkout_session_id}`, { headers: { Authorization: `Bearer ${key}` } });
      if (r.ok) {
        const id = await markPaidFromSession(db(), await r.json());
        if (id) { data.status = "paid"; await sendBookingEmails(db(), id); }
      } else console.error(`Stripe session fetch failed [${r.status}]`);
    } catch (e) { console.error("reconcile failed", (e as Error).message); }
  }
  const status = data.status === "pending_payment" && new Date(data.hold_expires_at) < new Date() ? "expired" : data.status;
  const out = { reference: data.reference, status, summary: statusSummary(CAT.event, data.product_label, data.amount_usd, status) };
  return text(`Booking ${out.reference}: ${status}. ${out.summary}`, out);
}

function detectSource(req: Request, clientName?: string): string {
  const s = `${clientName ?? ""} ${req.headers.get("user-agent") ?? ""}`.toLowerCase();
  if (s.includes("openai") || s.includes("chatgpt")) return "chatgpt";
  if (s.includes("claude") || s.includes("anthropic")) return "claude";
  return "other";
}

async function handle(msg: { id?: unknown; method: string; params?: Record<string, unknown> }, req: Request) {
  const params = msg.params ?? {};
  switch (msg.method) {
    case "initialize":
      return {
        protocolVersion: (params.protocolVersion as string) ?? "2025-06-18",
        capabilities: { tools: {}, resources: {} },
        serverInfo: { name: "glam-hub", title: "Carnival Glam Hub", version: "1.0.0" },
        instructions: "Book Trinidad Carnival 2027 makeup and photoshoot appointments with Carnival Glam Hub. Full payment at booking, no discounts.",
      };
    case "ping":
      return {};
    case "tools/list":
      return { tools: TOOLS };
    case "resources/list":
      return { resources: [{ uri: WIDGET_URI, name: "Glam Hub booking card", mimeType: "text/html;profile=mcp-app" }] };
    case "resources/read": {
      if (params.uri !== WIDGET_URI) throw Object.assign(new Error("Unknown resource"), { code: -32002 });
      const csp = { connect_domains: [SUPABASE_URL], resource_domains: ["https://www.carnivalglamhub.com"] };
      return {
        contents: [{
          uri: WIDGET_URI, mimeType: "text/html;profile=mcp-app", text: widgetHtml(CAT),
          _meta: { "openai/widgetCSP": csp, "openai/widgetPrefersBorder": true, ui: { csp: { connectDomains: [SUPABASE_URL], resourceDomains: ["https://www.carnivalglamhub.com"] } } },
        }],
      };
    }
    case "tools/call": {
      const name = params.name as string;
      const args = (params.arguments ?? {}) as Record<string, unknown>;
      const ua = req.headers.get("x-mcp-client") ?? undefined;
      if (name === "get_trinidad_glam_options") {
        const o = optionsPayload(await availability());
        const lines = o.products.map((p) => `${p.id}: ${p.label}, ${p.day}, US$${p.price_usd}`).join("; ");
        return { ...text(`${CAT.event} at ${CAT.venue}. Included free: ${CAT.inclusions.join(", ")}. Services: ${lines}. Terms: ${CAT.terms.url}`, o), _meta: UI_META };
      }
      if (name === "check_slot_availability") {
        const d = args.day as string;
        if (!["monday", "tuesday", "both"].includes(d)) return text("day must be monday, tuesday or both.", undefined, true);
        const av = await availability();
        const pick: Avail = d === "both" ? av : { [d]: av[d] };
        const t = Object.entries(pick).map(([k, v]) => `${DAY_NAME[k]}: ${v.map((s) => `${s.time} ${s.spots_left} left`).join(", ")}`).join("; ");
        return text(t, { availability: pick });
      }
      if (name === "start_booking") return await startBooking(args, detectSource(req, ua));
      if (name === "get_booking_status") return await bookingStatus(args);
      throw Object.assign(new Error(`Unknown tool ${name}`), { code: -32602 });
    }
    default:
      throw Object.assign(new Error(`Method not found: ${msg.method}`), { code: -32601 });
  }
}

function page(title: string, body: string) {
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0d0d0d;color:#f4efe6;font-family:system-ui,sans-serif;text-align:center;padding:24px}
.c{max-width:420px}img{width:140px;margin-bottom:20px}h1{font-family:Georgia,serif;color:#e6c878;font-weight:600}p{color:#cfc6b6;line-height:1.5}</style></head>
<body><div class="c"><img src="${LOGO}" alt="Carnival Glam Hub"><h1>${title}</h1>${body}</div></body></html>`;
}
const esc = (s: string) => s.replace(/[^A-Z0-9-]/gi, "");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const path = new URL(req.url).pathname;
  const ref = esc(new URL(req.url).searchParams.get("ref") ?? "");
  if (req.method === "GET" && path.endsWith("/confirmed")) {
    return new Response(page("Payment received", `<p>Thank you. Your Trinidad Carnival 2027 appointment${ref ? `, reference ${ref},` : ""} is paid. A receipt is on its way to your email.</p><p>You can return to your chat.</p>`), { headers: { ...CORS, "Content-Type": "text/html; charset=utf-8" } });
  }
  if (req.method === "GET" && path.endsWith("/cancelled")) {
    return new Response(page("No payment taken", `<p>No payment was taken${ref ? ` for ${ref}` : ""}. Your time slot will be released shortly.</p><p>You can return to your chat to try again.</p>`), { headers: { ...CORS, "Content-Type": "text/html; charset=utf-8" } });
  }
  // Public JSON endpoints for the /trinidad/book page. Same catalogue,
  // same reservation and same Checkout as the MCP tools.
  const JSON_H = { ...CORS, "Content-Type": "application/json" };
  if (req.method === "GET" && path.endsWith("/web/options")) {
    try { return new Response(JSON.stringify(optionsPayload(await availability())), { headers: JSON_H }); }
    catch (e) { console.error("web options", (e as Error).message); return new Response(JSON.stringify({ error: "Availability is unavailable just now." }), { status: 503, headers: JSON_H }); }
  }
  if (req.method === "POST" && path.endsWith("/web/book")) {
    let a: Record<string, unknown>;
    try { a = await req.json(); } catch { return new Response(JSON.stringify({ error: "Invalid request." }), { status: 400, headers: JSON_H }); }
    if (!a || typeof a !== "object" || Array.isArray(a)) return new Response(JSON.stringify({ error: "Invalid request." }), { status: 400, headers: JSON_H });
    try {
      const res = await startBooking(a, "website") as { content: { text: string }[]; structuredContent?: { checkout_url?: string; message?: string; availability?: unknown }; isError?: boolean };
      const sc = res.structuredContent;
      if (sc?.checkout_url) return new Response(JSON.stringify({ checkout_url: sc.checkout_url }), { headers: JSON_H });
      return new Response(JSON.stringify({ error: sc?.message ?? res.content[0].text, availability: sc?.availability }), { status: 409, headers: JSON_H });
    } catch (e) {
      console.error("web book", (e as Error).message);
      return new Response(JSON.stringify({ error: "We could not start your booking just now. Please try again." }), { status: 500, headers: JSON_H });
    }
  }
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { ...CORS, Allow: "POST" } });

  let body: unknown;
  try { body = await req.json(); } catch {
    return Response.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, { status: 400, headers: CORS });
  }
  const batch = Array.isArray(body) ? body : [body];
  const replies = [];
  for (const m of batch as { id?: unknown; method: string; params?: Record<string, unknown> }[]) {
    if (m?.id === undefined || m?.id === null) continue; // notification
    try {
      replies.push({ jsonrpc: "2.0", id: m.id, result: await handle(m, req) });
    } catch (e) {
      const err = e as Error & { code?: number };
      console.error("mcp error", m.method, err.message);
      replies.push({ jsonrpc: "2.0", id: m.id, error: { code: err.code ?? -32603, message: err.code ? err.message : "Internal error" } });
    }
  }
  if (!replies.length) return new Response(null, { status: 202, headers: CORS });
  return Response.json(Array.isArray(body) ? replies : replies[0], { headers: CORS });
});
