// Shared configuration and helpers for the Glam Match backend.
//
// MODEL RETIREMENT NOTES
// TEXT_MODEL default "gpt-4o". The pinned snapshot gpt-4o-2024-05-13 retires on
// 23 October 2026 and its successor is gpt-5.6-sol.
// IMAGE_MODEL default "gpt-image-2". The gpt-image-1 family retires on
// 1 December 2026, which falls inside the Trinidad Carnival 2027 selling season,
// so we build on gpt-image-2 from the start.
// IMAGE_QUALITY default "medium". Medium is roughly a quarter of the cost of high
// and the difference is close to invisible on a phone. High is used only when the
// caller explicitly asks to regenerate.
//
// All three are overridable by environment variable so the model can be changed
// without a deploy.

export const TEXT_MODEL = Deno.env.get("GLAM_MATCH_TEXT_MODEL") ?? "gpt-4o";
export const IMAGE_MODEL = Deno.env.get("GLAM_MATCH_IMAGE_MODEL") ?? "gpt-image-2";
export const IMAGE_QUALITY = Deno.env.get("GLAM_MATCH_IMAGE_QUALITY") ?? "medium";

export const OPENAI_BASE = "https://api.openai.com/v1";

export const UPLOADS_BUCKET = "glam-match-uploads";
export const PREVIEWS_BUCKET = "glam-match-previews";

export const MAX_LEADS_PER_IP_PER_DAY = 5;
export const MAX_IMAGES_PER_LEAD = 3;

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") ?? "unknown";
}

/** Hashes the caller IP with a salt. The raw IP is never stored. */
export async function hashIp(ip: string): Promise<string> {
  const salt = Deno.env.get("GLAM_MATCH_IP_SALT") ?? Deno.env.get("SUPABASE_URL") ?? "glam-match";
  const bytes = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Extracts the first JSON object from a model reply, tolerating code fences. */
export function parseJsonReply<T>(raw: string): T | null {
  if (!raw) return null;
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

export function requireOpenAiKey(): string {
  const key = Deno.env.get("OPENAI_API_KEY");
  if (!key) throw new Error("OPENAI_API_KEY is not configured");
  return key;
}

export async function logEvent(
  supabase: { from: (t: string) => { insert: (v: unknown) => Promise<unknown> } },
  leadId: string | null,
  event: string,
  detail: Record<string, unknown> = {},
) {
  try {
    await supabase.from("glam_match_events").insert({ lead_id: leadId, event, detail });
  } catch (_error) {
    // Logging must never break the request.
  }
}
