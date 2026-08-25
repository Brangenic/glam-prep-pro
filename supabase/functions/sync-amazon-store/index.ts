import { createClient } from "npm:@supabase/supabase-js@2";
import { syncAmazonStorefront } from "../_shared/amazonStore.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Backend credentials are not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  try {
    const report = await syncAmazonStorefront(supabaseAdmin);

    await supabaseAdmin
      .from("sync_state")
      .update({
        status: report.image_failures.length > 0 ? "success" : "success",
        message: `Synced ${report.rows_upserted} lists, mirrored ${report.images_mirrored} images`,
        last_synced_at: new Date().toISOString(),
      })
      .eq("source_key", "amazon_store");

    return new Response(JSON.stringify({ success: true, ...report }, null, 2), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown sync error";
    console.error("sync-amazon-store failed:", message);

    await supabaseAdmin
      .from("sync_state")
      .update({ status: "error", message })
      .eq("source_key", "amazon_store");

    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
