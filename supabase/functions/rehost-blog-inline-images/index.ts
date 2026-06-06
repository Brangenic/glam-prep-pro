// Migration 3 (deferred): re-upload inline static.wixstatic.com images embedded in
// blog_posts.content to the blog-images bucket under inline/{slug}/{filename},
// then rewrite the src in content. Idempotent: skips a post when content no
// longer contains static.wixstatic.com.
//
// Invoke when ready: POST /functions/v1/rehost-blog-inline-images
// Optional body: { "limit": 5 } to process a small batch first.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BUCKET = "blog-images";
const WIX_URL_RE = /https?:\/\/static\.wixstatic\.com\/[^\s)"'>]+/g;

const extFromContentType = (ct: string | null, url: string): string => {
  const u = url.toLowerCase().split("?")[0];
  for (const e of ["jpg", "jpeg", "png", "webp", "gif", "avif"]) {
    if (u.endsWith("." + e)) return e === "jpeg" ? "jpg" : e;
  }
  if (ct?.includes("jpeg")) return "jpg";
  if (ct?.includes("png")) return "png";
  if (ct?.includes("webp")) return "webp";
  if (ct?.includes("gif")) return "gif";
  if (ct?.includes("avif")) return "avif";
  return "jpg";
};

const safeFilename = (url: string, idx: number, ext: string): string => {
  try {
    const u = new URL(url);
    const last = u.pathname.split("/").filter(Boolean).pop() ?? `img-${idx}`;
    const base = last.replace(/\.[a-zA-Z0-9]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80);
    return `${idx.toString().padStart(3, "0")}-${base}.${ext}`;
  } catch {
    return `${idx.toString().padStart(3, "0")}-img.${ext}`;
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    let limit = 1000;
    if (req.method === "POST") {
      try {
        const body = await req.json();
        if (typeof body?.limit === "number" && body.limit > 0) limit = body.limit;
      } catch { /* no body */ }
    }

    const { data: rows, error } = await supabase
      .from("blog_posts")
      .select("id, slug, content")
      .ilike("content", "%static.wixstatic.com%")
      .limit(limit);
    if (error) throw error;

    const summary: { slug: string | null; ok: boolean; rewritten: number; failed: number; errors?: string[] }[] = [];

    for (const row of rows ?? []) {
      if (!row.slug || !row.content) {
        summary.push({ slug: row.slug, ok: false, rewritten: 0, failed: 0, errors: ["missing slug or content"] });
        continue;
      }
      const matches = Array.from(new Set(row.content.match(WIX_URL_RE) ?? []));
      let content = row.content;
      let rewritten = 0;
      let failed = 0;
      const errors: string[] = [];

      for (let i = 0; i < matches.length; i++) {
        const url = matches[i];
        try {
          const res = await fetch(url, { headers: { "User-Agent": "carnivalglamhub-rehost/1.0" } });
          if (!res.ok) { failed++; errors.push(`${url} -> ${res.status}`); continue; }
          const bytes = new Uint8Array(await res.arrayBuffer());
          const ext = extFromContentType(res.headers.get("content-type"), url);
          const filename = safeFilename(url, i + 1, ext);
          const path = `inline/${row.slug}/${filename}`;
          const contentType = res.headers.get("content-type") ?? `image/${ext === "jpg" ? "jpeg" : ext}`;
          const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, bytes, { contentType, upsert: true });
          if (upErr) { failed++; errors.push(`${url} upload: ${upErr.message}`); continue; }
          const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
          // Replace all occurrences of this exact URL in content
          content = content.split(url).join(pub.publicUrl);
          rewritten++;
        } catch (e) {
          failed++;
          errors.push(`${url}: ${(e as Error).message}`);
        }
      }

      if (rewritten > 0) {
        const { error: updErr } = await supabase
          .from("blog_posts")
          .update({ content })
          .eq("id", row.id);
        if (updErr) errors.push(`db update: ${updErr.message}`);
      }
      summary.push({ slug: row.slug, ok: failed === 0, rewritten, failed, errors: errors.length ? errors : undefined });
    }

    const totals = summary.reduce(
      (acc, s) => ({ rewritten: acc.rewritten + s.rewritten, failed: acc.failed + s.failed }),
      { rewritten: 0, failed: 0 },
    );
    return new Response(JSON.stringify({ scanned: rows?.length ?? 0, ...totals, posts: summary }, null, 2), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("inline rehost error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});