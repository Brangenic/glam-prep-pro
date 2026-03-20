import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const firecrawlApiKey = Deno.env.get("FIRECRAWL_API_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!firecrawlApiKey || !supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Missing env config" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const body = await req.json().catch(() => ({}));
  const slug = body?.slug;

  if (!slug) {
    return new Response(JSON.stringify({ error: "slug is required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  // Find the post by slug, external_id, or post_url
  let post: { external_id: string; post_url: string; content: string | null } | null = null;

  for (const field of ["slug", "external_id"] as const) {
    const { data } = await supabaseAdmin
      .from("blog_posts")
      .select("external_id, post_url, content")
      .eq(field, slug)
      .maybeSingle();
    if (data) { post = data; break; }
  }

  if (!post) {
    const { data } = await supabaseAdmin
      .from("blog_posts")
      .select("external_id, post_url, content")
      .ilike("post_url", `%/post/${slug}`)
      .maybeSingle();
    if (data) post = data;
  }

  if (!post) {
    return new Response(JSON.stringify({ error: "Post not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (post.content) {
    return new Response(JSON.stringify({ content: post.content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Scrape content
  try {
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${firecrawlApiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(45000),
      body: JSON.stringify({
        url: post.post_url,
        formats: ["markdown"],
        onlyMainContent: true,
        waitFor: 3000,
      }),
    });

    const payload = await response.json();
    const content = payload?.data?.markdown ?? payload?.markdown ?? null;

    if (content) {
      await supabaseAdmin
        .from("blog_posts")
        .update({ content })
        .eq("external_id", post.external_id);

      return new Response(JSON.stringify({ content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Could not extract content" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Scrape failed";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});