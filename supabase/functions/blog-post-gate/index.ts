import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BASE_URL = "https://www.carnivalglamhub.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const bannedSlugPatterns = [
  /^atlanta-/i,
  /^antigua-/i,
  /^spicemas-/i,
  /^crop-over-/i,
  /^chatgpt/i,
  /gpt/i,
  /^ai-/i,
  /-ai-/i,
  /artificial/i,
];

const isBannedSlug = (slug: string) => bannedSlugPatterns.some((re) => re.test(slug));

const isPublished = (post: { published_date?: string | null; raw_payload?: Record<string, unknown> | null } | null) => {
  if (!post) return false;
  const status = typeof post.raw_payload?.status === "string" ? post.raw_payload.status.toLowerCase() : null;
  if (status) return status === "published";
  if (typeof post.raw_payload?.published === "boolean") return post.raw_payload.published;
  return Boolean(post.published_date);
};

const removedHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    <title>This post has been removed | Carnival Glam Hub</title>
  </head>
  <body>
    <main>
      <h1>This post has been removed.</h1>
      <p>This journal post is no longer available.</p>
      <p><a href="/blogs">Back to journal</a> <a href="/about">About Carnival Glam Hub</a></p>
    </main>
  </body>
</html>`;

const getSlug = (req: Request) => {
  const url = new URL(req.url);
  const afterFunctionName = url.pathname.replace(/^\/blog-post-gate\/?/, "");
  return decodeURIComponent(afterFunctionName.split("/").filter(Boolean).pop() ?? url.searchParams.get("slug") ?? "");
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET" && req.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const slug = getSlug(req);
  const removedResponse = () =>
    new Response(req.method === "HEAD" ? null : removedHtml, {
      status: 410,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex",
        "Cache-Control": "public, max-age=0, s-maxage=300",
      },
    });

  if (!slug || isBannedSlug(slug)) return removedResponse();

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("published_date, raw_payload")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !isPublished(post)) return removedResponse();

  const appShell = await fetch(`${BASE_URL}/index.html`, {
    headers: { Accept: "text/html" },
  });
  const html = await appShell.text();

  return new Response(req.method === "HEAD" ? null : html, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, must-revalidate, max-age=0",
    },
  });
});