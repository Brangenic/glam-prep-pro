import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  MAX_LEADS_PER_IP_PER_DAY,
  UPLOADS_BUCKET,
  clientIp,
  corsHeaders,
  hashIp,
  json,
  logEvent,
} from "../_shared/glamMatch.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, message: "Method not allowed" }, 405);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const body = await req.json().catch(() => ({}));
    const { destination_slug, placement, consent } = body ?? {};

    if (consent !== true) {
      return json(
        { ok: false, message: "We need your consent before we can start your Glam Match." },
        400,
      );
    }

    const ipHash = await hashIp(clientIp(req));

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from("glam_match_leads")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);

    if (countError) throw countError;

    if ((count ?? 0) >= MAX_LEADS_PER_IP_PER_DAY) {
      await logEvent(supabase, null, "start.rate_limited", { ip_hash: ipHash });
      return json({
        ok: false,
        rate_limited: true,
        message:
          "You have already created a few Glam Matches today. Please try again tomorrow, or message our team and we will help you personally.",
      });
    }

    const { data: lead, error: leadError } = await supabase
      .from("glam_match_leads")
      .insert({
        consent_at: new Date().toISOString(),
        ip_hash: ipHash,
        destination_slug: typeof destination_slug === "string" ? destination_slug : null,
        placement: typeof placement === "string" ? placement : null,
      })
      .select("id")
      .single();

    if (leadError) throw leadError;

    const leadId = lead.id as string;
    const costumePath = `${leadId}/costume.jpg`;
    const selfiePath = `${leadId}/selfie.jpg`;

    const [costumeSigned, selfieSigned] = await Promise.all([
      supabase.storage.from(UPLOADS_BUCKET).createSignedUploadUrl(costumePath),
      supabase.storage.from(UPLOADS_BUCKET).createSignedUploadUrl(selfiePath),
    ]);

    if (costumeSigned.error) throw costumeSigned.error;
    if (selfieSigned.error) throw selfieSigned.error;

    const { error: uploadRowError } = await supabase.from("glam_match_uploads").insert({
      lead_id: leadId,
      costume_path: costumePath,
      selfie_path: selfiePath,
    });
    if (uploadRowError) throw uploadRowError;

    await logEvent(supabase, leadId, "start.created", {
      destination_slug: destination_slug ?? null,
      placement: placement ?? null,
    });

    return json({
      ok: true,
      lead_id: leadId,
      costume_upload: {
        signed_url: costumeSigned.data.signedUrl,
        token: costumeSigned.data.token,
      },
      selfie_upload: {
        signed_url: selfieSigned.data.signedUrl,
        token: selfieSigned.data.token,
      },
    });
  } catch (error) {
    console.error("glam-match-start error", error);
    await logEvent(supabase, null, "start.error", { message: String(error) });
    return json({ ok: false, message: "We could not start your Glam Match. Please try again." }, 500);
  }
});
