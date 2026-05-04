import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

/* ───── Firecrawl: expanded trending search ───── */
async function searchTrending(apiKey: string, territory: { name: string; country: string; keywords: string[] }) {
  const year = new Date().getFullYear();
  const queries = [
    `${territory.name} carnival ${year} makeup looks`,
    `${territory.name} carnival hairstyles tips`,
    `best carnival glam ${territory.country} ${year}`,
    `${territory.name} carnival costume ideas ${year}`,
    `carnival fete outfit ${territory.country}`,
    `jouvert body paint tips ${territory.name}`,
    `${territory.name} carnival travel guide ${year}`,
  ];

  const results: { title: string; url: string; description: string }[] = [];

  for (const query of queries.slice(0, 5)) {
    try {
      const res = await fetch("https://api.firecrawl.dev/v2/search", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ query, limit: 3, tbs: "qdr:m", scrapeOptions: { formats: ["markdown"] } }),
      });
      if (res.ok) {
        const data = await res.json();
        const items = data.data ?? data.results ?? [];
        for (const item of items) {
          results.push({
            title: item.title ?? "",
            url: item.url ?? "",
            description: (item.description ?? item.markdown ?? "").slice(0, 600),
          });
        }
      }
    } catch (e) {
      console.error(`Firecrawl search failed for "${query}":`, e);
    }
  }
  return results;
}

/* ───── Competitor intelligence: scrape top results ───── */
async function scrapeCompetitors(apiKey: string, keyword: string) {
  try {
    const res = await fetch("https://api.firecrawl.dev/v2/search", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        query: keyword,
        limit: 3,
        scrapeOptions: { formats: ["markdown"], onlyMainContent: true },
      }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items = data.data ?? data.results ?? [];
    return items.map((item: any) => ({
      title: item.title ?? "",
      url: item.url ?? "",
      content: (item.markdown ?? item.description ?? "").slice(0, 800),
    }));
  } catch (e) {
    console.error(`Competitor scrape failed for "${keyword}":`, e);
    return [];
  }
}

/* ───── Gather source data (reviews, products) ───── */
async function gatherSourceData(supabase: ReturnType<typeof createClient>) {
  const [{ data: reviews }, { data: products }] = await Promise.all([
    supabase.from("google_reviews").select("author_name, quote, rating").order("synced_at", { ascending: false }).limit(10),
    supabase.from("amazon_products").select("title, price_text, product_url").limit(8),
  ]);
  return { reviews: reviews ?? [], products: products ?? [] };
}

/* ───── Get existing blogs for dedup + internal linking ───── */
async function getExistingBlogs(supabase: ReturnType<typeof createClient>) {
  const { data } = await supabase
    .from("blog_posts")
    .select("title, slug")
    .order("created_at", { ascending: false })
    .limit(50);
  return data ?? [];
}

/* ───── Generate SEO blog article (enhanced) ───── */
async function generateBlogArticle(
  apiKey: string,
  territory: { name: string; country: string; keywords: string[]; hashtags: string[]; event_dates: string | null },
  trendingTopics: { title: string; description: string }[],
  competitorData: { title: string; content: string }[],
  sourceData: Awaited<ReturnType<typeof gatherSourceData>>,
  existingBlogs: { title: string; slug: string }[],
) {
  const trendingSummary = trendingTopics
    .slice(0, 5)
    .map((t) => `- ${t.title}: ${t.description.slice(0, 250)}`)
    .join("\n");

  const competitorSummary = competitorData
    .slice(0, 3)
    .map((c) => `- "${c.title}": ${c.content.slice(0, 300)}`)
    .join("\n");

  const existingTitles = existingBlogs
    .slice(0, 20)
    .map((b) => `- ${b.title}`)
    .join("\n");

  const internalLinks = existingBlogs
    .slice(0, 10)
    .map((b) => `- [${b.title}](https://www.carnivalglamhub.com/blogs/${b.slug})`)
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

Write a FULL SEO-optimized blog article (1000-1500 words) for ${territory.name}, ${territory.country}.

TRENDING TOPICS (base the article on one or more of these):
${trendingSummary}

COMPETITOR ARTICLES (analyze what they cover and write something BETTER — do NOT copy):
${competitorSummary}

EXISTING BLOG POSTS ON OUR SITE (DO NOT write about any of these topics — find something NEW):
${existingTitles}

INTERNAL LINKS TO WEAVE IN (include 2-3 of these naturally in the article body):
${internalLinks}

REAL CLIENT REVIEWS (weave 1-2 naturally into the article):
${reviewSnippets}

PRODUCTS TO MENTION (if relevant):
${productMentions}

TERRITORY INFO:
- Keywords: ${territory.keywords?.join(", ")}
- Event dates: ${territory.event_dates ?? "TBA"}

REQUIREMENTS:
- Catchy, SEO-optimized title with the year (${new Date().getFullYear()})
- URL-friendly slug (lowercase, hyphens, no special chars)
- Compelling meta description (under 160 chars) with CTA
- 150-word excerpt for the blog listing
- Full markdown body with:
  - At least 4 H2 headings
  - Internal link to booking: [Book your carnival glam artist](https://www.carnivalglamhub.com)
  - 2-3 internal links to OTHER blog posts from the list above
  - Territory-specific tips and advice
  - Natural product mentions where relevant
  - End with a strong CTA to book with Carnival Glam Hub
- Brand voice: confident, glamorous, inclusive, Caribbean-rooted
- ORIGINAL content — do NOT copy from trending or competitor articles
- Include a FAQ section at the end with 3-4 questions and answers relevant to the topic

IMPORTANT: Also generate a JSON-LD FAQ schema for the FAQ section.

Return JSON: { "title": "...", "slug": "...", "meta_description": "...", "excerpt": "...", "body": "...(full markdown with FAQ section)...", "keywords": ["..."], "faq_schema": { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{ "@type": "Question", "name": "...", "acceptedAnswer": { "@type": "Answer", "text": "..." } }] }, "internal_links_used": 0 }`;

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

/* ───── Curated photo pool (NEVER use AI-generated images for blog hero) ───── */
const BLOG_IMAGE_BUCKET = "blog-images";
const BLOG_POOL_FOLDER = "pool";
const BLOCKED_POOL_IMAGES = new Set(["gallery-1.jpg", "gallery-4.jpg", "carnival-4.jpg", "carnival-9.jpg"]);

async function getAvailablePoolImages(supabase: ReturnType<typeof createClient>, supabaseUrl: string): Promise<string[]> {
  const { data, error } = await supabase.storage.from(BLOG_IMAGE_BUCKET).list(BLOG_POOL_FOLDER, {
    limit: 200,
    sortBy: { column: "name", order: "ascending" },
  });

  if (error) throw new Error(`Blog image pool unavailable: ${error.message}`);

  const images = (data ?? [])
    .filter((file: any) => file.name && file.metadata?.mimetype?.startsWith("image/") && !BLOCKED_POOL_IMAGES.has(file.name))
    .map((file: any) => {
      const encodedName = encodeURIComponent(file.name);
      return `${supabaseUrl}/storage/v1/object/public/${BLOG_IMAGE_BUCKET}/${BLOG_POOL_FOLDER}/${encodedName}`;
    });

  if (images.length === 0) {
    throw new Error("Blog image pool is empty. Add user-provided photos before generating blog posts.");
  }

  return images;
}

async function getPoolImageUsageCounts(supabase: ReturnType<typeof createClient>) {
  const { data } = await supabase
    .from("blog_posts")
    .select("image_url")
    .like("image_url", `%/storage/v1/object/public/${BLOG_IMAGE_BUCKET}/${BLOG_POOL_FOLDER}/%`);

  return (data ?? []).reduce((counts: Map<string, number>, post: any) => {
    if (post.image_url) counts.set(post.image_url, (counts.get(post.image_url) ?? 0) + 1);
    return counts;
  }, new Map<string, number>());
}

function pickPoolImage(poolImages: string[], usageCounts: Map<string, number>, usedThisRun: Set<string>): string {
  const notUsedThisRun = poolImages.filter((url) => !usedThisRun.has(url));
  const candidates = notUsedThisRun.length > 0 ? notUsedThisRun : poolImages;
  const lowestUseCount = Math.min(...candidates.map((url) => usageCounts.get(url) ?? 0));
  const leastUsed = candidates.filter((url) => (usageCounts.get(url) ?? 0) === lowestUseCount);
  const selected = leastUsed[Math.floor(Math.random() * leastUsed.length)];
  usedThisRun.add(selected);
  usageCounts.set(selected, (usageCounts.get(selected) ?? 0) + 1);
  return selected;
}

/* ───── Generate social content IDEAS ───── */
async function generateContentIdeas(
  apiKey: string,
  territory: { name: string; country: string; keywords: string[]; hashtags: string[] },
  trendingTopics: { title: string; description: string }[],
  blogTitle: string,
) {
  const trendingSummary = trendingTopics.slice(0, 3).map((t) => t.title).join(", ");

  const prompt = `You are a social media strategist for Carnival Glam Hub — Caribbean carnival makeup & styling.

Generate 2 social media CONTENT IDEAS (not full posts) for ${territory.name}, ${territory.country}.

BLOG JUST PUBLISHED: "${blogTitle}"
TRENDING TOPICS: ${trendingSummary}
HASHTAGS: ${territory.hashtags?.join(" ")}

For each content idea provide:
- A hook/angle (what makes this scroll-stopping)
- Platform suggestion (Instagram Reel, TikTok, Story, Carousel, etc.)
- Key talking points (3-4 bullets)
- Suggested hashtags (10-15)
- A one-line caption starter

Return JSON: { "ideas": [{ "channel": "...", "hook": "...", "platform_format": "...", "talking_points": ["..."], "hashtags": ["..."], "caption_starter": "..." }] }`;

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

  if (!res.ok) throw new Error(`AI content ideas failed: ${res.status}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty AI response for ideas");
  const parsed = JSON.parse(content);
  return parsed.ideas ?? (Array.isArray(parsed) ? parsed : [parsed]);
}

/* ───── Regenerate sitemap ───── */
async function regenerateSitemap(supabase: ReturnType<typeof createClient>, supabaseUrl: string, anonKey: string) {
  try {
    await fetch(`${supabaseUrl}/functions/v1/generate-sitemap`, {
      method: "POST",
      headers: { Authorization: `Bearer ${anonKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ trigger: "autopilot" }),
    });
    console.log("Sitemap regeneration triggered");
  } catch (e) {
    console.error("Sitemap regen failed:", e);
  }
}

/* ───── Main handler ───── */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "";
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
    const existingBlogs = await getExistingBlogs(supabase);
    const poolImages = await getAvailablePoolImages(supabase, SUPABASE_URL);
    const imageUsageCounts = await getPoolImageUsageCounts(supabase);
    const usedImagesThisRun = new Set<string>();
    const results: any[] = [];

    for (const territory of territories) {
      const territoryResult: any = {
        territory: territory.name,
        blog: null,
        image: false,
        internal_links: 0,
        content_ideas: 0,
        errors: [],
      };

      try {
        // 1. Search trending topics (expanded queries)
        const trending = await searchTrending(FIRECRAWL_API_KEY, territory);
        console.log(`[${territory.name}] Found ${trending.length} trending topics`);

        // 2. Scrape competitors for the primary keyword
        const primaryKeyword = `${territory.name} carnival makeup ${new Date().getFullYear()}`;
        const competitors = await scrapeCompetitors(FIRECRAWL_API_KEY, primaryKeyword);
        console.log(`[${territory.name}] Scraped ${competitors.length} competitor articles`);

        // 3. Generate & insert blog article with enhanced prompting
        let blogTitle = "";
        let blogSlug = "";
        try {
          const blog = await generateBlogArticle(
            LOVABLE_API_KEY,
            territory,
            trending,
            competitors,
            sourceData,
            existingBlogs,
          );

          blogTitle = blog.title;
          blogSlug = blog.slug;

          // Append FAQ schema as HTML comment in content for BlogPost to extract
          let fullContent = blog.body;
          if (blog.faq_schema) {
            fullContent += `\n\n<!-- FAQ_SCHEMA_JSON\n${JSON.stringify(blog.faq_schema)}\n-->`;
          }

          // 4. Pick hero image from curated real-photo pool (NO AI image generation)
          const imageUrl: string = pickPoolImage(poolImages, imageUsageCounts, usedImagesThisRun);
          territoryResult.image = true;
          console.log(`[${territory.name}] Selected hero image from pool: ${imageUrl}`);

          const { error: blogErr } = await supabase.from("blog_posts").insert({
            external_id: `ai-${territory.slug}-${Date.now()}`,
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            content: fullContent,
            meta_description: blog.meta_description,
            image_url: imageUrl,
            post_url: `https://www.carnivalglamhub.com/blogs/${blog.slug}`,
            source: "ai_generated",
            author_name: "Carnival Glam Hub",
          });

          if (blogErr) throw blogErr;
          territoryResult.blog = blog.title;
          territoryResult.internal_links = blog.internal_links_used ?? 0;

          // Add to existing blogs so next territory avoids duplicates
          existingBlogs.unshift({ title: blog.title, slug: blog.slug });
        } catch (e: any) {
          console.error(`[${territory.name}] Blog error:`, e.message);
          territoryResult.errors.push(`blog: ${e.message}`);
        }

        // 5. Generate content ideas (not full social posts)
        try {
          const ideas = await generateContentIdeas(
            LOVABLE_API_KEY,
            territory,
            trending,
            blogTitle || `${territory.name} carnival content`,
          );

          for (const idea of ideas) {
            await supabase.from("generated_content").insert({
              territory_id: territory.id,
              channel: idea.channel ?? "instagram",
              content_type: "content_idea",
              title: idea.hook ?? idea.caption_starter,
              body: JSON.stringify({
                hook: idea.hook,
                platform_format: idea.platform_format,
                talking_points: idea.talking_points,
                caption_starter: idea.caption_starter,
              }),
              hashtags: idea.hashtags ?? [],
              status: "draft",
              ai_model: "gemini-2.5-flash",
              source_data: { blog_title: blogTitle, territory: territory.name },
            });
            territoryResult.content_ideas++;
          }
        } catch (e: any) {
          console.error(`[${territory.name}] Content ideas error:`, e.message);
          territoryResult.errors.push(`ideas: ${e.message}`);
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

    // Regenerate sitemap
    await regenerateSitemap(supabase, SUPABASE_URL, SUPABASE_ANON_KEY);

    return json({ success: true, results });
  } catch (e: any) {
    console.error("Autopilot error:", e);
    return json({ error: e.message }, 500);
  }
});
