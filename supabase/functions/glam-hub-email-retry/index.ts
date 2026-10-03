// Internal retry: sends any paid AI booking whose accounts email or receipt
// has not gone. Callable only with the service role key.
import { sendBookingEmails, serviceClient } from "../_shared/glamHubFulfil.ts";

Deno.serve(async (req) => {
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const auth = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!key || auth !== key) return new Response("Forbidden", { status: 403 });
  const db = serviceClient();
  const { data, error } = await db.from("ai_bookings").select("id").eq("status", "paid")
    .or("notification_sent_at.is.null,receipt_sent_at.is.null").limit(50);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  const results: Record<string, unknown> = {};
  for (const r of data ?? []) results[r.id] = await sendBookingEmails(db, r.id);
  return Response.json({ checked: data?.length ?? 0, results });
});
