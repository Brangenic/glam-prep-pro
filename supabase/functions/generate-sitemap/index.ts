import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const baseUrl = "https://www.carnivalglamhub.com";

    // Fetch all blog posts
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, source")
      .order("created_at", { ascending: false })
      .limit(500);

    // Static pages
    const staticPages = [
      { loc: "/", priority: "1.0", changefreq: "daily" },
      { loc: "/blogs", priority: "0.9", changefreq: "daily" },
      { loc: "/reviews", priority: "0.8", changefreq: "weekly" },
      { loc: "/about", priority: "0.7", changefreq: "monthly" },
      { loc: "/services/carnival-makeup", priority: "0.8", changefreq: "monthly" },
      { loc: "/services/carnival-photoshoot", priority: "0.8", changefreq: "monthly" },
      { loc: "/amazon-store", priority: "0.7", changefreq: "weekly" },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static pages
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Add blog posts
    if (posts) {
      for (const post of posts) {
        if (!post.slug) continue;
        const lastmod = post.updated_at ? new Date(post.updated_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
        xml += `  <url>
    <loc>${baseUrl}/blogs/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
      }
    }

    xml += `</urlset>`;

    // Store in site_config for static serving
    await supabase.from("site_config").upsert({
      key: "sitemap_xml",
      value: xml,
    }, { onConflict: "key" });

    console.log(`Sitemap generated with ${staticPages.length + (posts?.length ?? 0)} URLs`);

    return new Response(xml, {
      headers: { ...corsHeaders, "Content-Type": "application/xml" },
    });
  } catch (e: any) {
    console.error("Sitemap generation error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
