import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// ── Gather source data for a territory ──────────────────────────
async function gatherSourceData(
  supabase: ReturnType<typeof createClient>,
  territory: { id: string; name: string; country: string; keywords: string[]; hashtags: string[] }
) {
  // Pull latest Google reviews
  const { data: reviews } = await supabase
    .from("google_reviews")
    .select("author_name, quote, rating, review_date")
    .order("synced_at", { ascending: false })
    .limit(10);

  // Pull latest blog posts
  const { data: blogs } = await supabase
    .from("blog_posts")
    .select("title, excerpt, published_date")
    .order("synced_at", { ascending: false })
    .limit(5);

  // Pull Amazon products
  const { data: products } = await supabase
    .from("amazon_products")
    .select("title, price_text, product_url")
    .order("synced_at", { ascending: false })
    .limit(10);

  // Scrape trending carnival content for this territory via Firecrawl search
  const firecrawlApiKey = Deno.env.get("FIRECRAWL_API_KEY");
  let trendingResults: { title: string; url: string; description: string }[] = [];

  if (firecrawlApiKey) {
    try {
      const searchQuery = `${territory.name} makeup artist glam services ${new Date().getFullYear()}`;
      const res = await fetch("https://api.firecrawl.dev/v2/search", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${firecrawlApiKey}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(30000),
        body: JSON.stringify({ query: searchQuery, limit: 5 }),
      });
      const payload = await res.json();
      trendingResults = (payload?.data ?? []).map((r: any) => ({
        title: r.title ?? "",
        url: r.url ?? "",
        description: r.description ?? "",
      }));
    } catch (e) {
      console.warn("Firecrawl search failed, continuing without trending data:", e);
    }
  }

  return {
    reviews: reviews ?? [],
    blogs: blogs ?? [],
    products: products ?? [],
    trending: trendingResults,
  };
}

// ── Generate content via Lovable AI Gateway ─────────────────────
async function generateWithAI(
  territory: { name: string; country: string; keywords: string[]; hashtags: string[]; event_dates: string | null },
  sourceData: Awaited<ReturnType<typeof gatherSourceData>>,
  channel: string,
  contentType: string
) {
  const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

  const channelGuide: Record<string, string> = {
    instagram: "Short, punchy caption (max 2200 chars). Use emojis. Include CTA to book. End with relevant hashtags.",
    whatsapp: "Friendly broadcast message (max 1000 chars). Conversational tone. Include booking link.",
    facebook: "Engaging post (max 500 words). Tell a story. Include CTA.",
    twitter: "Thread of 3-5 tweets (max 280 chars each). Punchy, trending style.",
    blog: "SEO-optimized article (800-1200 words). Include H2 headings, tips, and service mentions.",
    email: "Newsletter content with subject line, preview text, and body. Professional but warm.",
  };

  const systemPrompt = `You are a marketing content creator for Carnival Glam Hub, a premium carnival makeup and beauty service provider. 
Brand voice: Confident, glamorous, inclusive, Caribbean-rooted.
Services: Full glam makeup, body painting, rhinestone application, costume makeup, group packages.
Booking: carnivalglamhub.masos.app/events
Contact: Bookings@carnivalglamhub.com | 8765090997
Territory focus: ${territory.name} (${territory.country}), ${territory.event_dates ?? "upcoming season"}
Key hashtags: ${territory.hashtags.join(", ")}`;

  const userPrompt = `Generate a ${contentType} for ${channel} targeting people looking for carnival makeup services in ${territory.name}.

CONTEXT DATA:
- Recent customer reviews: ${JSON.stringify(sourceData.reviews.slice(0, 3))}
- Latest blog topics: ${sourceData.blogs.map((b) => b.title).join(", ")}
- Recommended products: ${sourceData.products.slice(0, 3).map((p) => p.title).join(", ")}
- Trending topics: ${sourceData.trending.map((t) => t.title).join(", ")}
- Territory keywords: ${territory.keywords.join(", ")}

CHANNEL GUIDELINES: ${channelGuide[channel] ?? channelGuide.instagram}

Return JSON: { "title": "...", "body": "...", "hashtags": ["..."] }`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableApiKey}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(60000),
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`AI request failed (${res.status}): ${errText}`);
  }

  const completion = await res.json();
  const raw = completion.choices?.[0]?.message?.content ?? "{}";
  return JSON.parse(raw) as { title?: string; body?: string; hashtags?: string[] };
}

// ── Main handler ────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return json({ error: "Missing env config" }, 500);

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  const body = await req.json().catch(() => ({}));
  const {
    territory_slug,
    channel = "instagram",
    content_type = "social_post",
    count = 1,
  } = body as { territory_slug?: string; channel?: string; content_type?: string; count?: number };

  // Resolve territories
  let query = supabase.from("territories").select("*").eq("active", true);
  if (territory_slug) query = query.eq("slug", territory_slug);

  const { data: territories, error: tErr } = await query;
  if (tErr || !territories?.length) {
    return json({ error: tErr?.message ?? "No matching territories found" }, 404);
  }

  const results: { territory: string; generated: number; errors: string[] }[] = [];

  for (const territory of territories) {
    const territoryResult = { territory: territory.name, generated: 0, errors: [] as string[] };

    try {
      const sourceData = await gatherSourceData(supabase, territory);

      for (let i = 0; i < Math.min(count, 5); i++) {
        try {
          const aiContent = await generateWithAI(territory, sourceData, channel, content_type);

          if (aiContent.body) {
            await supabase.from("generated_content").insert({
              territory_id: territory.id,
              content_type,
              channel,
              title: aiContent.title ?? null,
              body: aiContent.body,
              hashtags: aiContent.hashtags ?? [],
              status: "draft",
              source_data: sourceData as unknown as Record<string, unknown>,
              ai_model: "google/gemini-2.5-flash",
            });
            territoryResult.generated++;
          }
        } catch (e) {
          territoryResult.errors.push(e instanceof Error ? e.message : "Generation failed");
        }
      }
    } catch (e) {
      territoryResult.errors.push(e instanceof Error ? e.message : "Source gathering failed");
    }

    results.push(territoryResult);
  }

  return json({ success: true, results });
});
