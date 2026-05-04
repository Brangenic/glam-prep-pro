import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/* ───── Curated photo pool (real Carnival Glam Hub event photography only) ───── */
const BLOG_IMAGE_BUCKET = "blog-images";
const BLOG_POOL_FOLDER = "pool";

async function getAvailablePoolImages(supabase: ReturnType<typeof createClient>, supabaseUrl: string): Promise<string[]> {
  const { data, error } = await supabase.storage.from(BLOG_IMAGE_BUCKET).list(BLOG_POOL_FOLDER, {
    limit: 200,
    sortBy: { column: "name", order: "ascending" },
  });

  if (error) throw new Error(`Blog image pool unavailable: ${error.message}`);

  const images = (data ?? [])
    .filter((file: any) => file.name && file.metadata?.mimetype?.startsWith("image/"))
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

function pickPoolImage(poolImages: string[], usageCounts: Map<string, number>): string {
  const lowestUseCount = Math.min(...poolImages.map((url) => usageCounts.get(url) ?? 0));
  const leastUsed = poolImages.filter((url) => (usageCounts.get(url) ?? 0) === lowestUseCount);
  const selected = leastUsed[Math.floor(Math.random() * leastUsed.length)];
  usageCounts.set(selected, (usageCounts.get(selected) ?? 0) + 1);
  return selected;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

/* ───── 1. Search trending carnival topics ───── */
async function searchTrending(firecrawlKey: string | undefined): Promise<{ title: string; description: string }[]> {
  const year = new Date().getFullYear();
  const queries = [
    `carnival ${year} makeup looks trending`,
    `caribbean carnival costume ideas ${year}`,
    `jouvert body paint tips ${year}`,
    `carnival hairstyle trends ${year}`,
    `carnival fete outfit ideas`,
  ];

  const results: { title: string; description: string }[] = [];

  if (!firecrawlKey) {
    return [
      { title: `Top Carnival Makeup Trends for ${year}`, description: "Glitter, gems, bold lips and waterproof everything." },
      { title: `Best Jouvert Body Paint That Won't Budge in ${year}`, description: "Water-resistant body paint options for the road." },
      { title: `Carnival Costume Styling Guide ${year}`, description: "How to accessorize your carnival costume from head to toe." },
      { title: `Caribbean Carnival Hairstyles That Survive the Heat`, description: "Braids, updos and protective styles for carnival." },
      { title: `What to Pack for Carnival ${year}`, description: "Essential beauty and outfit items for carnival travelers." },
    ];
  }

  for (const query of queries) {
    try {
      const res = await fetch("https://api.firecrawl.dev/v2/search", {
        method: "POST",
        headers: { Authorization: `Bearer ${firecrawlKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ query, limit: 3, tbs: "qdr:m", scrapeOptions: { formats: ["markdown"] } }),
      });
      if (res.ok) {
        const data = await res.json();
        for (const item of (data.data ?? data.results ?? [])) {
          results.push({
            title: item.title ?? "",
            description: (item.description ?? item.markdown ?? "").slice(0, 500),
          });
        }
      }
    } catch (e) {
      console.error(`Search failed for "${query}":`, e);
    }
  }

  return results;
}

/* ───── 2. Pick a fresh topic ───── */
function pickFreshTopic(
  trending: { title: string; description: string }[],
  existingSlugs: string[],
  existingTitles: string[],
): { title: string; description: string } | null {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const titleSet = new Set(existingTitles.map(normalize));
  const slugSet = new Set(existingSlugs);

  for (const topic of trending) {
    const norm = normalize(topic.title);
    const slug = norm.replace(/\s+/g, "-").slice(0, 80);

    if (titleSet.has(norm)) continue;
    if (slugSet.has(slug)) continue;

    const words = new Set(norm.split(" "));
    const isDuplicate = [...titleSet].some((existing) => {
      const existingWords = new Set(existing.split(" "));
      const overlap = [...words].filter((w) => existingWords.has(w)).length;
      return overlap / Math.max(words.size, existingWords.size) > 0.6;
    });
    if (isDuplicate) continue;

    return topic;
  }

  return null;
}

/* ───── 3. Competitor research ───── */
type CompetitorInsight = {
  url: string;
  title: string;
  keyPoints: string[];
  wordCount: number;
};

async function researchCompetitors(
  topicTitle: string,
  firecrawlKey: string | undefined,
): Promise<{ insights: CompetitorInsight[]; gaps: string }> {
  const competitorArticles: CompetitorInsight[] = [];

  if (firecrawlKey) {
    try {
      const res = await fetch("https://api.firecrawl.dev/v2/search", {
        method: "POST",
        headers: { Authorization: `Bearer ${firecrawlKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          query: topicTitle,
          limit: 5,
          scrapeOptions: { formats: ["markdown"], onlyMainContent: true },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        for (const item of (data.data ?? data.results ?? []).slice(0, 5)) {
          const markdown = item.markdown ?? item.description ?? "";
          const headings = (markdown.match(/^#{1,3}\s+.+$/gm) ?? []).map((h: string) => h.replace(/^#+\s*/, ""));
          competitorArticles.push({
            url: item.url ?? "",
            title: item.title ?? "",
            keyPoints: headings.slice(0, 8),
            wordCount: markdown.split(/\s+/).length,
          });
        }
      }
    } catch (e) {
      console.error("Firecrawl competitor search failed:", e);
    }
  }

  if (competitorArticles.length === 0) {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(topicTitle)}`;
    try {
      const res = await fetch(searchUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; CarnivalGlamBot/1.0)" },
      });
      if (res.ok) {
        const html = await res.text();
        const linkMatches = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)]
          .map((m) => m[1])
          .filter((u) => !u.includes("duckduckgo") && !u.includes("ad_domain"))
          .slice(0, 3);

        for (const url of linkMatches) {
          try {
            const pageRes = await fetch(url, {
              headers: { "User-Agent": "Mozilla/5.0 (compatible; CarnivalGlamBot/1.0)" },
              signal: AbortSignal.timeout(8000),
            });
            if (pageRes.ok) {
              const pageHtml = await pageRes.text();
              const titleMatch = pageHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
              const headings = [...pageHtml.matchAll(/<h[1-3][^>]*>([^<]+)<\/h[1-3]>/gi)]
                .map((m) => m[1].trim())
                .slice(0, 8);
              const textContent = pageHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
              competitorArticles.push({
                url,
                title: titleMatch?.[1]?.trim() ?? url,
                keyPoints: headings,
                wordCount: textContent.split(/\s+/).length,
              });
            }
          } catch {
            // skip unreachable pages
          }
        }
      }
    } catch (e) {
      console.error("Fallback competitor search failed:", e);
    }
  }

  let gaps = "";
  if (competitorArticles.length > 0) {
    const allPoints = competitorArticles.flatMap((a) => a.keyPoints);
    const avgWordCount = Math.round(
      competitorArticles.reduce((sum, a) => sum + a.wordCount, 0) / competitorArticles.length,
    );
    gaps = `COMPETITOR ANALYSIS (${competitorArticles.length} articles found):
${competitorArticles.map((a, i) => `${i + 1}. "${a.title}" (~${a.wordCount} words)\n   Covers: ${a.keyPoints.join(", ") || "unknown"}`).join("\n")}

Average competitor word count: ~${avgWordCount}
Common topics covered: ${[...new Set(allPoints)].slice(0, 12).join(", ")}

YOUR MISSION: Write content that OUTPERFORMS these competitors by:
- Covering angles they missed (e.g. specific product recommendations, insider tips, Caribbean cultural context)
- Being more actionable with step-by-step advice
- Including original insights from a professional carnival makeup artist perspective
- Aiming for at least ${Math.max(900, avgWordCount + 200)} words to be more comprehensive
- Adding unique value like product links, booking CTAs, and real-world carnival experience`;
  } else {
    gaps = "No competitor articles found — write the definitive guide on this topic.";
  }

  return { insights: competitorArticles, gaps };
}

/* ───── 4. Generate blog article (competitor-aware) ───── */
async function generateArticle(
  apiKey: string,
  topic: { title: string; description: string },
  internalLinks: { title: string; slug: string }[],
  competitorGaps: string,
) {
  const linksBlock = internalLinks
    .slice(0, 10)
    .map((l) => `- [${l.title}](https://www.carnivalglamhub.com/blogs/${l.slug})`)
    .join("\n");

  const prompt = `You are a professional beauty and carnival blog writer for Carnival Glam Hub — the premier Caribbean carnival makeup and styling service.

Write a FULL SEO-optimized blog article (800-1200 words) based on this topic:

TOPIC: ${topic.title}
CONTEXT: ${topic.description}

${competitorGaps}

INTERNAL LINKS — weave 2-3 of these naturally into the body:
${linksBlock}

REQUIREMENTS:
- Catchy, SEO-optimized title with the year (${new Date().getFullYear()})
- URL-friendly slug (lowercase, hyphens, no special chars, max 80 chars)
- Meta description under 160 chars with a CTA
- 120-word excerpt for blog listings
- Full markdown body with at least 3 H2 headings
- Include a booking CTA link: [Book your carnival glam artist](https://www.carnivalglamhub.com)
- Include 2-3 internal links from the list above, placed naturally
- End with a strong CTA to book with Carnival Glam Hub
- Brand voice: confident, glamorous, inclusive, Caribbean-rooted
- ORIGINAL content only — do NOT copy competitor content

Also include a FAQ section at the end (3-4 Q&As) and generate a JSON-LD FAQPage schema.

Return JSON only:
{
  "title": "...",
  "slug": "...",
  "meta_description": "...",
  "excerpt": "...",
  "body": "...(full markdown including FAQ section)...",
  "keywords": ["..."],
  "faq_schema": {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{ "@type": "Question", "name": "...", "acceptedAnswer": { "@type": "Answer", "text": "..." }}]
  },
  "internal_links_used": 2
}`;

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

  if (!res.ok) throw new Error(`AI generation failed: ${res.status}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");
  return JSON.parse(content);
}

/* ───── 5. Pick hero image from curated user-provided pool ───── */

/* ───── 6. Trigger sitemap regen ───── */
async function triggerSitemap(supabaseUrl: string, anonKey: string) {
  try {
    await fetch(`${supabaseUrl}/functions/v1/generate-sitemap`, {
      method: "POST",
      headers: { Authorization: `Bearer ${anonKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ trigger: "autopilot-engine" }),
    });
  } catch (e) {
    console.error("Sitemap regen failed:", e);
  }
}

/* ───── 7. IndexNow ping ───── */
async function pingIndexNow(slug: string) {
  const apiKey = Deno.env.get("INDEXNOW_API_KEY");
  if (!apiKey) {
    console.warn("INDEXNOW_API_KEY not set — skipping IndexNow ping");
    return;
  }

  const host = "www.carnivalglamhub.com";
  const url = `https://${host}/blogs/${slug}`;

  try {
    const res = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host,
        key: apiKey,
        keyLocation: `https://${host}/${apiKey}.txt`,
        urlList: [url],
      }),
    });
    console.log(`IndexNow ping for ${url}: ${res.status}`);
  } catch (e) {
    console.error("IndexNow ping failed:", e);
  }
}

/* ───── Main handler ───── */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");

    if (!LOVABLE_API_KEY) return json({ error: "LOVABLE_API_KEY not configured" }, 500);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Step 1: Search trending topics
    console.log("Searching trending carnival topics...");
    const trending = await searchTrending(FIRECRAWL_API_KEY);
    console.log(`Found ${trending.length} trending topics`);

    // Step 2: Get existing blog posts for dedup + internal linking
    const { data: existingPosts } = await supabase
      .from("blog_posts")
      .select("title, slug")
      .order("created_at", { ascending: false })
      .limit(100);

    const existingTitles = (existingPosts ?? []).map((p: any) => p.title).filter(Boolean);
    const existingSlugs = (existingPosts ?? []).map((p: any) => p.slug).filter(Boolean);

    // Step 3: Pick 1 fresh topic
    const freshTopic = pickFreshTopic(trending, existingSlugs, existingTitles);
    if (!freshTopic) {
      return json({ success: true, message: "No fresh topics found — all trending topics already covered", published: false });
    }
    console.log(`Selected fresh topic: "${freshTopic.title}"`);

    // Step 4: Competitor research
    console.log("Researching competitors...");
    const { insights: competitors, gaps: competitorGaps } = await researchCompetitors(
      freshTopic.title,
      FIRECRAWL_API_KEY,
    );
    console.log(`Analyzed ${competitors.length} competitor articles`);

    // Step 5: Generate the blog article with competitor intelligence
    const internalLinks = (existingPosts ?? [])
      .filter((p: any) => p.slug)
      .slice(0, 10);

    const article = await generateArticle(LOVABLE_API_KEY, freshTopic, internalLinks, competitorGaps);
    console.log(`Generated article: "${article.title}" (${article.slug})`);

    // Step 6: Pick hero image from curated pool
    const heroImageUrl = pickPoolImage();
    console.log(`Selected hero image from pool: ${heroImageUrl}`);

    // Step 7: Append FAQ schema as extractable comment
    let fullContent = article.body ?? "";
    if (article.faq_schema) {
      fullContent += `\n\n<!-- FAQ_SCHEMA_JSON\n${JSON.stringify(article.faq_schema)}\n-->`;
    }

    // Step 8: Insert into blog_posts (with hero image)
    const { error: insertErr } = await supabase.from("blog_posts").insert({
      external_id: `ai-engine-${Date.now()}`,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: fullContent,
      meta_description: article.meta_description,
      image_url: heroImageUrl,
      post_url: `https://www.carnivalglamhub.com/blogs/${article.slug}`,
      source: "ai_generated",
      author_name: "Carnival Glam Hub",
    });

    if (insertErr) throw new Error(`Insert failed: ${insertErr.message}`);
    console.log("Blog post published successfully");

    // Step 9: Trigger sitemap regeneration + IndexNow ping
    await Promise.all([
      triggerSitemap(SUPABASE_URL, SUPABASE_ANON_KEY),
      pingIndexNow(article.slug),
    ]);

    // Log the run
    await supabase.from("site_config").upsert({
      key: "autopilot_engine_last_run",
      value: JSON.stringify({
        timestamp: new Date().toISOString(),
        topic: freshTopic.title,
        article_title: article.title,
        slug: article.slug,
        internal_links_used: article.internal_links_used ?? 0,
        has_faq_schema: !!article.faq_schema,
        has_hero_image: !!heroImageUrl,
        competitors_analyzed: competitors.length,
      }),
    }, { onConflict: "key" });

    return json({
      success: true,
      published: true,
      title: article.title,
      slug: article.slug,
      url: `https://www.carnivalglamhub.com/blogs/${article.slug}`,
      image_url: heroImageUrl,
      internal_links_used: article.internal_links_used ?? 0,
      has_faq_schema: !!article.faq_schema,
      has_hero_image: !!heroImageUrl,
      competitors_analyzed: competitors.length,
    });
  } catch (e: any) {
    console.error("Autopilot engine error:", e);
    return json({ error: e.message }, 500);
  }
});
