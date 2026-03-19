import { createClient } from "npm:@supabase/supabase-js@2";

type SourceKey = "google_reviews" | "amazon_store" | "blog_posts";

type SyncStateRow = {
  source_key: SourceKey;
  source_url: string;
  last_synced_at: string | null;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const FIRECRAWL_TIMEOUT_MS = 90000;
const AMAZON_LIST_CRAWL_LIMIT = 12;
const AMAZON_PRODUCTS_PER_LIST = 4;

const hashString = (input: string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

const normalizeText = (value: unknown) => {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim();
};

const normalizeRating = (value: unknown) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  const rounded = Math.round(numeric);
  if (rounded < 1 || rounded > 5) return null;
  return rounded;
};

const isAmazonListUrl = (url: string) => /amazon\.com\/shop\/carnivalglamhub\/list\//i.test(url);
const isAmazonProductUrl = (url: string) => /amazon\.com\/.+\/(dp|gp\/product)\//i.test(url);

const canonicalizeUrl = (value: string) => {
  try {
    const parsed = new URL(value);

    if (isAmazonListUrl(value)) {
      const pageValue = parsed.searchParams.get("page") ?? parsed.searchParams.get("pageNumber");
      const page = pageValue && /^\d+$/.test(pageValue) ? pageValue : null;
      return page ? `${parsed.origin}${parsed.pathname}?page=${page}` : `${parsed.origin}${parsed.pathname}`;
    }

    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return value;
  }
};

const buildPaginatedListUrls = (baseListUrl: string) => [canonicalizeUrl(baseListUrl)];

const callFirecrawlJson = async (apiKey: string, url: string, prompt: string) => {
  const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(FIRECRAWL_TIMEOUT_MS),
    body: JSON.stringify({
      url,
      formats: ["json"],
      jsonOptions: { prompt },
      onlyMainContent: false,
      waitFor: 2000,
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(`Firecrawl scrape failed [${response.status}]: ${JSON.stringify(payload)}`);
  }

  return payload?.data?.json ?? payload?.json ?? payload?.data?.extract ?? payload?.extract ?? null;
};

const callFirecrawlLinks = async (apiKey: string, url: string) => {
  const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(FIRECRAWL_TIMEOUT_MS),
    body: JSON.stringify({
      url,
      formats: ["links"],
      onlyMainContent: false,
      waitFor: 2000,
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(`Firecrawl links scrape failed [${response.status}]: ${JSON.stringify(payload)}`);
  }

  return payload?.data?.links ?? payload?.links ?? [];
};

const syncGoogleReviews = async (
  supabaseAdmin: ReturnType<typeof createClient>,
  firecrawlApiKey: string,
  sourceUrl: string,
) => {
  const extracted = await callFirecrawlJson(
    firecrawlApiKey,
    sourceUrl,
    "Extract visible customer reviews into JSON with this exact shape: { reviews: [{ id, author_name, rating, quote, review_date, review_url, location }] }. Include every visible review and keep text verbatim.",
  );

  const reviewsRaw = Array.isArray(extracted?.reviews) ? extracted.reviews : [];

  const rows = reviewsRaw
    .map((review: Record<string, unknown>) => {
      const quote = normalizeText(review.quote);
      if (!quote) return null;

      const authorName = normalizeText(review.author_name) || "Anonymous";
      const externalId =
        normalizeText(review.id) ||
        `google_${hashString(`${authorName}|${quote.slice(0, 160)}`)}`;

      return {
        external_id: externalId,
        author_name: authorName,
        rating: normalizeRating(review.rating),
        quote,
        review_date: normalizeText(review.review_date) || null,
        review_url: normalizeText(review.review_url) || null,
        location: normalizeText(review.location) || "Google review",
        raw_payload: review,
        synced_at: new Date().toISOString(),
      };
    })
    .filter(Boolean) as Array<Record<string, unknown>>;

  if (rows.length === 0) {
    throw new Error("No reviews could be extracted from the Google page.");
  }

  const { error: upsertError } = await supabaseAdmin
    .from("google_reviews")
    .upsert(rows, { onConflict: "external_id" });

  if (upsertError) {
    throw new Error(`Google reviews upsert failed: ${upsertError.message}`);
  }

  const syncedIds = rows
    .map((row) => String(row.external_id).replace(/"/g, '\\"'))
    .join(",");

  if (syncedIds.length > 0) {
    const { error: deleteError } = await supabaseAdmin
      .from("google_reviews")
      .delete()
      .not("external_id", "in", `(${rows.map((row) => `\"${String(row.external_id).replace(/\"/g, '\\\"')}\"`).join(",")})`);

    if (deleteError) {
      console.warn("Could not prune stale Google reviews:", deleteError.message);
    }
  }

  return rows.length;
};

const getAmazonListBaseUrl = (url: string) => {
  const canonical = canonicalizeUrl(url);

  try {
    const parsed = new URL(canonical);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return canonical.split("?")[0] ?? canonical;
  }
};

const normalizeCategoryLabel = (value: unknown) => {
  const label = normalizeText(value);
  if (!label || label.toLowerCase() === "n/a") return null;
  return label;
};

const toAmazonRows = (productsRaw: unknown[], fallbackCategory: string | null = null) => productsRaw
  .map((product) => {
    const item = product as Record<string, unknown>;
    const title = normalizeText(item.title);
    const productUrlRaw = normalizeText(item.product_url);

    if (!title || !productUrlRaw || !isAmazonProductUrl(productUrlRaw)) return null;

    const productUrl = canonicalizeUrl(productUrlRaw);
    const category = normalizeCategoryLabel(item.category) ?? fallbackCategory;
    const externalId =
      normalizeText(item.id) ||
      `amazon_${hashString(`${title}|${productUrl}`)}`;

    return {
      external_id: externalId,
      title,
      price_text: normalizeText(item.price_text) || null,
      image_url: normalizeText(item.image_url) || null,
      product_url: productUrl,
      category,
      raw_payload: item,
      synced_at: new Date().toISOString(),
    };
  })
  .filter(Boolean) as Array<Record<string, unknown>>;

const syncAmazonProducts = async (
  supabaseAdmin: ReturnType<typeof createClient>,
  firecrawlApiKey: string,
  sourceUrl: string,
) => {
  const [storefrontListsExtract, storefrontLinks] = await Promise.all([
    callFirecrawlJson(
      firecrawlApiKey,
      sourceUrl,
      "Extract all Amazon list categories from this storefront with shape: { lists: [{ title, list_url }] }. Include every visible list/category card and use full list URLs.",
    ).catch(() => null),
    callFirecrawlLinks(firecrawlApiKey, sourceUrl).catch(() => []),
  ]);

  const storefrontListsRaw = Array.isArray(storefrontListsExtract?.lists)
    ? storefrontListsExtract.lists
    : [];

  const categoryByListBaseUrl = new Map<string, string>();
  for (const listEntry of storefrontListsRaw) {
    const item = listEntry as Record<string, unknown>;
    const listUrl = canonicalizeUrl(normalizeText(item.list_url));
    const title = normalizeCategoryLabel(item.title);

    if (!isAmazonListUrl(listUrl) || !title) continue;
    categoryByListBaseUrl.set(getAmazonListBaseUrl(listUrl), title);
  }

  const collectedListUrls = Array.from(
    new Set(
      [
        ...Array.from(categoryByListBaseUrl.keys()),
        ...((Array.isArray(storefrontLinks) ? storefrontLinks : []).map((url) => getAmazonListBaseUrl(canonicalizeUrl(normalizeText(url))))),
      ]
        .filter((url) => isAmazonListUrl(url))
        .flatMap((listUrl) => buildPaginatedListUrls(listUrl)),
    ),
  ).slice(0, AMAZON_LIST_CRAWL_LIMIT);

  const listExtracts: Array<{ listUrl: string; extract: unknown }> = [];
  const BATCH_SIZE = 2;

  for (let i = 0; i < collectedListUrls.length; i += BATCH_SIZE) {
    const batch = collectedListUrls.slice(i, i + BATCH_SIZE);

    const batchResults = await Promise.all(
      batch.map(async (listUrl) => {
        const extract = await callFirecrawlJson(
          firecrawlApiKey,
          listUrl,
          `Extract up to ${AMAZON_PRODUCTS_PER_LIST} visible product cards from this Amazon list page into JSON with exact shape: { list_title, products: [{ id, title, price_text, image_url, product_url }] }. Include ONLY real products. product_url must be a direct Amazon product page URL containing /dp/ or /gp/product/. Omit anything that links to /shop/, /list/, storefront pages, or category pages.`,
        ).catch(() => null);

        return { listUrl, extract };
      }),
    );

    listExtracts.push(...batchResults);
  }

  const rows = listExtracts.flatMap(({ listUrl, extract }) => {
    const productsRaw = Array.isArray((extract as { products?: unknown[] } | null)?.products)
      ? ((extract as { products?: unknown[] }).products ?? [])
      : [];
    const fallbackCategory =
      normalizeCategoryLabel((extract as { list_title?: unknown } | null)?.list_title) ??
      categoryByListBaseUrl.get(getAmazonListBaseUrl(listUrl)) ??
      null;

    return toAmazonRows(productsRaw, fallbackCategory);
  });

  const dedupedRows = Array.from(
    new Map(rows.map((row) => [String(row.product_url), row])).values(),
  );

  if (dedupedRows.length === 0) {
    throw new Error("No products could be extracted from the Amazon category lists.");
  }

  const { error: upsertError } = await supabaseAdmin
    .from("amazon_products")
    .upsert(dedupedRows, { onConflict: "external_id" });

  if (upsertError) {
    throw new Error(`Amazon products upsert failed: ${upsertError.message}`);
  }

  const { error: deleteError } = await supabaseAdmin
    .from("amazon_products")
    .delete()
    .not("external_id", "in", `(${dedupedRows.map((row) => `\"${String(row.external_id).replace(/\"/g, '\\\"')}\"`).join(",")})`);

  if (deleteError) {
    console.warn("Could not prune stale Amazon products:", deleteError.message);
  }

  return dedupedRows.length;
};

const syncBlogPosts = async (
  supabaseAdmin: ReturnType<typeof createClient>,
  firecrawlApiKey: string,
  sourceUrl: string,
) => {
  const extracted = await callFirecrawlJson(
    firecrawlApiKey,
    sourceUrl,
    "Extract all visible blog post cards from this page into JSON with exact shape: { posts: [{ title, excerpt, image_url, post_url, author_name, author_avatar_url, published_date, read_time }] }. Include every visible blog post. Keep text verbatim. post_url must be the full URL to the blog post. image_url should be the featured/thumbnail image URL.",
  );

  const postsRaw = Array.isArray(extracted?.posts) ? extracted.posts : [];

  const rows = postsRaw
    .map((post: Record<string, unknown>) => {
      const title = normalizeText(post.title);
      const postUrl = normalizeText(post.post_url);
      if (!title || !postUrl) return null;

      const externalId = `blog_${hashString(`${title}|${postUrl}`)}`;

      return {
        external_id: externalId,
        title,
        excerpt: normalizeText(post.excerpt) || null,
        image_url: normalizeText(post.image_url) || null,
        post_url: postUrl,
        author_name: normalizeText(post.author_name) || null,
        author_avatar_url: normalizeText(post.author_avatar_url) || null,
        published_date: normalizeText(post.published_date) || null,
        read_time: normalizeText(post.read_time) || null,
        raw_payload: post,
        synced_at: new Date().toISOString(),
      };
    })
    .filter(Boolean) as Array<Record<string, unknown>>;

  if (rows.length === 0) {
    throw new Error("No blog posts could be extracted from the page.");
  }

  const { error: upsertError } = await supabaseAdmin
    .from("blog_posts")
    .upsert(rows, { onConflict: "external_id" });

  if (upsertError) {
    throw new Error(`Blog posts upsert failed: ${upsertError.message}`);
  }

  return rows.length;
};

const shouldSync = (lastSyncedAt: string | null, force: boolean) => {
  if (force || !lastSyncedAt) return true;
  const elapsed = Date.now() - new Date(lastSyncedAt).getTime();
  return elapsed >= DAY_IN_MS;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const firecrawlApiKey = Deno.env.get("FIRECRAWL_API_KEY");
  if (!firecrawlApiKey) {
    return new Response(JSON.stringify({ error: "FIRECRAWL_API_KEY is not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  if (!supabaseUrl) {
    return new Response(JSON.stringify({ error: "SUPABASE_URL is not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceRoleKey) {
    return new Response(JSON.stringify({ error: "SUPABASE_SERVICE_ROLE_KEY is not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const body = await req.json().catch(() => ({}));
  const source = body?.source === "google_reviews" || body?.source === "amazon_store" || body?.source === "blog_posts" || body?.source === "all"
    ? body.source
    : "all";
  const force = Boolean(body?.force);

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const selectedSources: SourceKey[] = source === "all"
    ? ["google_reviews", "amazon_store", "blog_posts"]
    : [source];

  const { data: stateRows, error: stateError } = await supabaseAdmin
    .from("sync_state")
    .select("source_key, source_url, last_synced_at")
    .in("source_key", selectedSources);

  if (stateError) {
    return new Response(JSON.stringify({ error: `Failed to load sync state: ${stateError.message}` }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const stateMap = new Map<SourceKey, SyncStateRow>();
  (stateRows ?? []).forEach((row) => stateMap.set(row.source_key, row as SyncStateRow));

  const results: Record<string, unknown>[] = [];

  for (const sourceKey of selectedSources) {
    const sourceState = stateMap.get(sourceKey);

    if (!sourceState) {
      results.push({ source: sourceKey, status: "error", message: "Missing source in sync_state table" });
      continue;
    }

    if (!shouldSync(sourceState.last_synced_at, force)) {
      results.push({ source: sourceKey, status: "skipped", message: "Synced less than 24 hours ago" });
      continue;
    }

    await supabaseAdmin
      .from("sync_state")
      .update({ status: "syncing", message: "Sync in progress" })
      .eq("source_key", sourceKey);

    try {
      const count = sourceKey === "google_reviews"
        ? await syncGoogleReviews(supabaseAdmin, firecrawlApiKey, sourceState.source_url)
        : sourceKey === "amazon_store"
        ? await syncAmazonProducts(supabaseAdmin, firecrawlApiKey, sourceState.source_url)
        : await syncBlogPosts(supabaseAdmin, firecrawlApiKey, sourceState.source_url);

      await supabaseAdmin
        .from("sync_state")
        .update({
          status: "success",
          message: `Synced ${count} records`,
          last_synced_at: new Date().toISOString(),
        })
        .eq("source_key", sourceKey);

      results.push({ source: sourceKey, status: "success", synced_count: count });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown sync error";

      await supabaseAdmin
        .from("sync_state")
        .update({ status: "error", message })
        .eq("source_key", sourceKey);

      results.push({ source: sourceKey, status: "error", message });
    }
  }

  return new Response(JSON.stringify({ success: true, results }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});