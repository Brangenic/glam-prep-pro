import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BASE_URL = "https://www.carnivalglamhub.com";
const TODAY = new Date().toISOString().split("T")[0];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type SitemapEntry = {
  path: string;
  lastmod: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: string;
};

const staticEntries: SitemapEntry[] = [
  { path: "/", lastmod: TODAY, changefreq: "weekly", priority: "1.0" },
  { path: "/blogs", lastmod: TODAY, changefreq: "daily", priority: "0.9" },
  { path: "/reviews", lastmod: TODAY, changefreq: "weekly", priority: "0.8" },
  { path: "/about", lastmod: TODAY, changefreq: "monthly", priority: "0.7" },
  { path: "/faq", lastmod: TODAY, changefreq: "monthly", priority: "0.5" },
  { path: "/services/carnival-makeup", lastmod: TODAY, changefreq: "monthly", priority: "0.8" },
  { path: "/services/carnival-hair", lastmod: TODAY, changefreq: "monthly", priority: "0.8" },
  { path: "/services/carnival-photoshoot", lastmod: TODAY, changefreq: "monthly", priority: "0.8" },
  { path: "/services/carnival-shuttle", lastmod: TODAY, changefreq: "monthly", priority: "0.8" },
  { path: "/services/getting-dressed", lastmod: TODAY, changefreq: "monthly", priority: "0.8" },
  { path: "/trinidad-carnival-2027", lastmod: TODAY, changefreq: "weekly", priority: "0.9" },
  { path: "/amazon-store", lastmod: TODAY, changefreq: "weekly", priority: "0.7" },
  { path: "/jamaica", lastmod: TODAY, changefreq: "weekly", priority: "0.8" },
  { path: "/trinidad", lastmod: TODAY, changefreq: "weekly", priority: "0.8" },
  { path: "/saint-lucia", lastmod: TODAY, changefreq: "weekly", priority: "0.8" },
  { path: "/grenada", lastmod: TODAY, changefreq: "weekly", priority: "0.8" },
  { path: "/antigua", lastmod: TODAY, changefreq: "weekly", priority: "0.8" },
  { path: "/barbados", lastmod: TODAY, changefreq: "weekly", priority: "0.8" },
  { path: "/miami", lastmod: TODAY, changefreq: "weekly", priority: "0.8" },
  { path: "/toronto", lastmod: TODAY, changefreq: "weekly", priority: "0.8" },
  { path: "/guyana", lastmod: TODAY, changefreq: "weekly", priority: "0.8" },
  { path: "/epic-cruise", lastmod: TODAY, changefreq: "weekly", priority: "0.8" },
];

const excludedSlugPatterns = [
  /^atlanta-/i,
  /^antigua-/i,
  /^spicemas-/i,
  /crop-over-/i,
  /^chatgpt/i,
  /gpt/i,
  /^ai-/i,
  /-ai-/i,
  /artificial/i,
];

const isExcludedSlug = (slug: string | null | undefined) =>
  !slug || excludedSlugPatterns.some((re) => re.test(slug));

const getSlugFromPostUrl = (postUrl: string | null | undefined) => {
  if (!postUrl) return null;
  const match = postUrl.match(/\/(?:post|blogs?)\/([^/?#]+)/i);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
};

const isPublished = (post: { published_date?: string | null; raw_payload?: Record<string, unknown> | null }) => {
  const status = typeof post.raw_payload?.status === "string" ? post.raw_payload.status.toLowerCase() : null;
  if (status) return status === "published";
  if (typeof post.raw_payload?.published === "boolean") return post.raw_payload.published;
  return Boolean(post.published_date);
};

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const toXml = (entries: SitemapEntry[]) => {
  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(`${BASE_URL}${entry.path}`)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select("slug, post_url, updated_at, published_date, raw_payload")
      .order("updated_at", { ascending: false })
      .limit(1000);

    if (error) throw error;

    const entries = [...staticEntries];
    const seen = new Set(entries.map((entry) => entry.path));

    for (const post of posts ?? []) {
      if (!isPublished(post)) continue;
      const slug = post.slug || getSlugFromPostUrl(post.post_url);
      if (isExcludedSlug(slug)) continue;

      const path = `/blogs/${slug}`;
      if (seen.has(path)) continue;
      seen.add(path);

      entries.push({
        path,
        lastmod: post.updated_at ? new Date(post.updated_at).toISOString().split("T")[0] : TODAY,
        changefreq: "monthly",
        priority: "0.7",
      });
    }

    const xml = toXml(entries);

    await supabase
      .from("site_config")
      .upsert({ key: "sitemap_xml", value: xml }, { onConflict: "key" });

    return new Response(req.method === "HEAD" ? null : xml, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=0, s-maxage=300",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response("Sitemap generation failed", {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
    });
  }
});
