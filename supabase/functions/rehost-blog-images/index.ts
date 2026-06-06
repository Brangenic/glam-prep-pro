import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BUCKET = "blog-images";

const extFromContentType = (ct: string | null, url: string): string => {
  const u = url.toLowerCase().split("?")[0];
  if (u.endsWith(".jpg") || u.endsWith(".jpeg")) return "jpg";
  if (u.endsWith(".png")) return "png";
  if (u.endsWith(".webp")) return "webp";
  if (u.endsWith(".gif")) return "gif";
  if (u.endsWith(".avif")) return "avif";
  if (ct?.includes("jpeg")) return "jpg";
  if (ct?.includes("png")) return "png";
  if (ct?.includes("webp")) return "webp";
  if (ct?.includes("gif")) return "gif";
  if (ct?.includes("avif")) return "avif";
  return "jpg";
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: rows, error } = await supabase
      .from("blog_posts")
      .select("id, slug, image_url, image_url_legacy")
      .ilike("image_url", "%wixstatic.com%")
      .is("image_url_legacy", null);

    if (error) throw error;

    const results: { slug: string | null; ok: boolean; error?: string; newUrl?: string }[] = [];

    for (const row of rows ?? []) {
      try {
        if (!row.slug || !row.image_url) {
          results.push({ slug: row.slug, ok: false, error: "missing slug or image_url" });
          continue;
        }
        const res = await fetch(row.image_url, {
          headers: { "User-Agent": "carnivalglamhub-rehost/1.0" },
        });
        if (!res.ok) {
          results.push({ slug: row.slug, ok: false, error: `fetch ${res.status}` });
          continue;
        }
        const bytes = new Uint8Array(await res.arrayBuffer());
        const ext = extFromContentType(res.headers.get("content-type"), row.image_url);
        const path = `heroes/${row.slug}.${ext}`;
        const contentType = res.headers.get("content-type") ?? `image/${ext === "jpg" ? "jpeg" : ext}`;

        const { error: uploadErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, bytes, { contentType, upsert: true });
        if (uploadErr) {
          results.push({ slug: row.slug, ok: false, error: `upload: ${uploadErr.message}` });
          continue;
        }

        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        const newUrl = pub.publicUrl;

        const { error: updErr } = await supabase
          .from("blog_posts")
          .update({ image_url_legacy: row.image_url, image_url: newUrl })
          .eq("id", row.id);
        if (updErr) {
          results.push({ slug: row.slug, ok: false, error: `update: ${updErr.message}` });
          continue;
        }
        results.push({ slug: row.slug, ok: true, newUrl });
      } catch (e) {
        results.push({ slug: row.slug, ok: false, error: (e as Error).message });
      }
    }

    const ok = results.filter((r) => r.ok).length;
    const failed = results.length - ok;
    return new Response(JSON.stringify({ scanned: rows?.length ?? 0, ok, failed, results }, null, 2), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("rehost error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});