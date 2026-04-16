import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

/* ───── Firecrawl trending search ───── */
async function searchTrending(apiKey: string, territory: { name: string; country: string; keywords: string[] }) {
  const queries = [
    `${territory.name} carnival 2026 makeup looks`,
    `${territory.name} carnival hairstyles tips`,
    `best carnival glam ${territory.country} ${new Date().getFullYear()}`,
  ];

  const results: { title: string; url: string; description: string }[] = [];

  for (const query of queries) {
    try {
      const res = await fetch("https://api.firecrawl.dev/v2/search", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ query, limit: 3, tbs: "qdr:w", scrapeOptions: { formats: ["markdown"] } }),
      });
      if (res.ok) {
        const data = await res.json();
        const items = data.data ?? data.results ?? [];
        for (const item of items) {
          results.push({
            title: item.title ?? "",
            url: item.url ?? "",
            description: (item.description ?? item.markdown ?? "").slice(0, 500),
          });
        }
      }
    } catch (e) {
      console.error(`Firecrawl search failed for "${query}":`, e);
    }
  }
  return results;
}

/* ───── Gather source data (reviews, products) ───── */
async function gatherSourceData(supabase: ReturnType<typeof createClient>) {
  const [{ data: reviews }, { data: products }] = await Promise.all([
    supabase.from("google_reviews").select("author_name, quote, rating").order("synced_at", { ascending: false }).limit(10),
    supabase.from("amazon_products").select("title, price_text, product_url").limit(8),
  ]);
  return { reviews: reviews ?? [], products: products ?? [] };
}

/* ───── Generate SEO blog article ───── */
async function generateBlogArticle(
  apiKey: string,
  territory: { name: string; country: string; keywords: string[]; hashtags: string[]; event_dates: string | null },
  trendingTopics: { title: string; description: string }[],
  sourceData: Awaited<ReturnType<typeof gatherSourceData>>,
) {
  const trendingSummary = trendingTopics
    .slice(0, 5)
    .map((t) => `- ${t.title}: ${t.description.slice(0, 200)}`)
    .join("\n");

  const reviewSnippets = sourceData.reviews
    .slice(0, 5)
    .map((r: any) => `"${r.quote}" — ${r.author_name}`)
    .join("\n");

  const productMentions = sourceData.products
    .slice(0, 4)
    .map((p: any) => `${p.title} (${p.price_text ?? "see price"})`)
    .join(", ");

  const prompt = `You are a professional beauty and carnival blog writer for Carnival Glam Hub — the premier Caribbean carnival makeup and styling service.

Write a FULL SEO-optimized blog article (800-1200 words) for ${territory.name}, ${territory.country}.

TRENDING TOPICS (base the article on one or more of these):
${trendingSummary}

REAL CLIENT REVIEWS (weave 1-2 naturally into the article):
${reviewSnippets}

PRODUCTS TO MENTION (if relevant):
${productMentions}

TERRITORY INFO:
- Keywords: ${territory.keywords?.join(", ")}
- Event dates: ${territory.event_dates ?? "TBA"}

REQUIREMENTS:
- Catchy, SEO-optimized title with the year (2026)
- URL-friendly slug (lowercase, hyphens, no special chars)
- Compelling meta description (under 160 chars) with CTA
- 150-word excerpt for the blog listing
- Full markdown body with:
  - At least 3 H2 headings
  - Internal link to booking: [Book your carnival glam artist](https://carnivalglamhub.masos.app/events)
  - Territory-specific tips and advice
  - Natural product mentions where relevant
  - End with a strong CTA to book with Carnival Glam Hub
- Brand voice: confident, glamorous, inclusive, Caribbean-rooted
- ORIGINAL content — do NOT copy from trending articles

Return JSON: { "title": "...", "slug": "...", "meta_description": "...", "excerpt": "...", "body": "...(full markdown)...", "keywords": ["..."] }`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8,
    }),
  });

  if (!res.ok) throw new Error(`AI blog generation failed: ${res.status}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty AI response for blog");
  return JSON.parse(content);
}

/* ───── Generate social posts ───── */
async function generateSocialPosts(
  apiKey: string,
  territory: { name: string; country: string; keywords: string[]; hashtags: string[] },
  trendingTopics: { title: string; description: string }[],
  channels: string[],
) {
  const trendingSummary = trendingTopics.slice(0, 3).map((t) => t.title).join(", ");

  const prompt = `You are a social media manager for Carnival Glam Hub — Caribbean carnival makeup & styling.

Generate ${channels.length} social media posts for ${territory.name}, ${territory.country}.

CHANNELS: ${channels.join(", ")}
TRENDING TOPICS: ${trendingSummary}
HASHTAGS: ${territory.hashtags?.join(" ")}
KEYWORDS: ${territory.keywords?.join(", ")}

For each post:
- Engaging, scroll-stopping copy
- Include relevant hashtags
- Include booking CTA: carnivalglamhub.masos.app/events or DM/WhatsApp
- Instagram: 150-250 words with emoji, 20-30 hashtags
- Twitter: under 280 chars
- WhatsApp: friendly, personal tone with link
- Facebook: 100-200 words, conversational

Return JSON array: [{ "channel": "...", "title": "...", "body": "...", "hashtags": ["..."] }]`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.9,
    }),
  });

  if (!res.ok) throw new Error(`AI social generation failed: ${res.status}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty AI response for social");
  const parsed = JSON.parse(content);
  return Array.isArray(parsed) ? parsed : parsed.posts ?? parsed.results ?? [parsed];
}

/* ───── Main handler ───── */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) return json({ error: "LOVABLE_API_KEY not configured" }, 500);
    if (!FIRECRAWL_API_KEY) return json({ error: "FIRECRAWL_API_KEY not configured" }, 500);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get active territories
    const { data: territories } = await supabase
      .from("territories")
      .select("*")
      .eq("active", true)
      .order("name");

    if (!territories?.length) return json({ success: true, message: "No active territories", results: [] });

    const sourceData = await gatherSourceData(supabase);
    const results: any[] = [];
    const socialChannels = ["instagram", "twitter", "whatsapp", "facebook"];

    for (const territory of territories) {
      const territoryResult: any = { territory: territory.name, blog: null, social: 0, errors: [] };

      try {
        // 1. Search trending topics
        const trending = await searchTrending(FIRECRAWL_API_KEY, territory);
        console.log(`[${territory.name}] Found ${trending.length} trending topics`);

        // 2. Generate & insert blog article
        try {
          const blog = await generateBlogArticle(LOVABLE_API_KEY, territory, trending, sourceData);

          const { error: blogErr } = await supabase.from("blog_posts").insert({
            external_id: `ai-${territory.slug}-${Date.now()}`,
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            content: blog.body,
            meta_description: blog.meta_description,
            post_url: `https://www.carnivalglamhub.com/blogs/${blog.slug}`,
            source: "ai_generated",
            author_name: "Carnival Glam Hub",
          });

          if (blogErr) throw blogErr;
          territoryResult.blog = blog.title;
        } catch (e: any) {
          console.error(`[${territory.name}] Blog error:`, e.message);
          territoryResult.errors.push(`blog: ${e.message}`);
        }

        // 3. Generate social posts (pick 2 random channels)
        try {
          const shuffled = [...socialChannels].sort(() => Math.random() - 0.5);
          const picked = shuffled.slice(0, 2);
          const posts = await generateSocialPosts(LOVABLE_API_KEY, territory, trending, picked);

          for (const post of posts) {
            await supabase.from("generated_content").insert({
              territory_id: territory.id,
              channel: post.channel,
              content_type: "social_post",
              title: post.title,
              body: post.body,
              hashtags: post.hashtags ?? [],
              status: "draft",
              ai_model: "gemini-2.5-flash",
              source_data: { trending_topics: trending.slice(0, 3).map((t) => t.title) },
            });
            territoryResult.social++;
          }
        } catch (e: any) {
          console.error(`[${territory.name}] Social error:`, e.message);
          territoryResult.errors.push(`social: ${e.message}`);
        }
      } catch (e: any) {
        console.error(`[${territory.name}] General error:`, e.message);
        territoryResult.errors.push(e.message);
      }

      results.push(territoryResult);
    }

    // Log the run
    await supabase.from("site_config").upsert({
      key: "autopilot_last_run",
      value: JSON.stringify({ timestamp: new Date().toISOString(), results }),
    }, { onConflict: "key" });

    return json({ success: true, results });
  } catch (e: any) {
    console.error("Autopilot error:", e);
    return json({ error: e.message }, 500);
  }
});
