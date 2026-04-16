import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    // Fallback: return hardcoded seasonal topic seeds when Firecrawl isn't available
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

    // Skip if title or slug already exists
    if (titleSet.has(norm)) continue;
    if (slugSet.has(slug)) continue;

    // Skip if a very similar title already exists (>60% word overlap)
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

/* ───── 3. Generate blog article ───── */
async function generateArticle(
  apiKey: string,
  topic: { title: string; description: string },
  internalLinks: { title: string; slug: string }[],
) {
  const linksBlock = internalLinks
    .slice(0, 10)
    .map((l) => `- [${l.title}](https://www.carnivalglamhub.com/blogs/${l.slug})`)
    .join("\n");

  const prompt = `You are a professional beauty and carnival blog writer for Carnival Glam Hub — the premier Caribbean carnival makeup and styling service.

Write a FULL SEO-optimized blog article (800-1200 words) based on this topic:

TOPIC: ${topic.title}
CONTEXT: ${topic.description}

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
- ORIGINAL content only

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

/* ───── 4. Trigger sitemap regen ───── */
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

    // Step 4: Generate the blog article
    const internalLinks = (existingPosts ?? [])
      .filter((p: any) => p.slug)
      .slice(0, 10);

    const article = await generateArticle(LOVABLE_API_KEY, freshTopic, internalLinks);
    console.log(`Generated article: "${article.title}" (${article.slug})`);

    // Step 5: Append FAQ schema as extractable comment
    let fullContent = article.body ?? "";
    if (article.faq_schema) {
      fullContent += `\n\n<!-- FAQ_SCHEMA_JSON\n${JSON.stringify(article.faq_schema)}\n-->`;
    }

    // Step 6: Insert into blog_posts
    const { error: insertErr } = await supabase.from("blog_posts").insert({
      external_id: `ai-engine-${Date.now()}`,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: fullContent,
      meta_description: article.meta_description,
      post_url: `https://www.carnivalglamhub.com/blogs/${article.slug}`,
      source: "ai_generated",
      author_name: "Carnival Glam Hub",
    });

    if (insertErr) throw new Error(`Insert failed: ${insertErr.message}`);
    console.log("Blog post published successfully");

    // Step 7: Trigger sitemap regeneration
    await triggerSitemap(SUPABASE_URL, SUPABASE_ANON_KEY);

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
      }),
    }, { onConflict: "key" });

    return json({
      success: true,
      published: true,
      title: article.title,
      slug: article.slug,
      url: `https://www.carnivalglamhub.com/blogs/${article.slug}`,
      internal_links_used: article.internal_links_used ?? 0,
      has_faq_schema: !!article.faq_schema,
    });
  } catch (e: any) {
    console.error("Autopilot engine error:", e);
    return json({ error: e.message }, 500);
  }
});
