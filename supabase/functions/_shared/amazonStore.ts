// Amazon storefront sync.
//
// The storefront page (https://www.amazon.com/shop/carnivalglamhub) is server
// rendered and contains one card per Idea List: the list id, its title and its
// hero image. We parse that HTML directly instead of going through Firecrawl,
// because Firecrawl's JSON extraction could not read Amazon list pages at all
// (the amazon_store sync had been failing since March 2026 with "No products
// could be extracted").
//
// Amazon rate limits aggressively and answers roughly half of all requests with
// a 503 "Sorry! Something went wrong!" page, so every fetch is retried.
//
// Images are mirrored into public storage under a deterministic key
// (amazon-store/<external_id>.jpg) so the site never hotlinks
// m.media-amazon.com. The original Amazon URL is kept in source_image_url.
//
// The mirror lives inside the existing public `blog-images` bucket under an
// `amazon-store/` prefix because this workspace blocks the creation of new
// public buckets, and a private bucket cannot serve <img src> URLs.

import { Image } from "https://deno.land/x/imagescript@1.2.17/mod.ts";

const STOREFRONT_URL = "https://www.amazon.com/shop/carnivalglamhub";
const BUCKET = "blog-images";
const IMAGE_PREFIX = "amazon-store";
export const IMAGE_SIZE = 800;
const JPEG_QUALITY = 78;
const FETCH_ATTEMPTS = 6;

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const decodeEntities = (value: string) =>
  value
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x2019;|&rsquo;/g, "\u2019")
    .replace(/\s+/g, " ")
    .trim();

type ParsedList = {
  listId: string;
  externalId: string;
  title: string;
  productUrl: string;
  sourceImageUrl: string;
};

const fetchStorefrontHtml = async (): Promise<string> => {
  let lastStatus = 0;

  for (let attempt = 1; attempt <= FETCH_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(STOREFRONT_URL, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(20000),
      });
      lastStatus = response.status;
      const html = await response.text();

      if (response.ok && html.includes("/shop/carnivalglamhub/list/")) {
        return html;
      }
    } catch (error) {
      console.warn(`amazon storefront fetch attempt ${attempt} failed:`, (error as Error).message);
    }

    await sleep(1500 * attempt);
  }

  throw new Error(
    `Amazon storefront could not be read after ${FETCH_ATTEMPTS} attempts (last status ${lastStatus}). Amazon is throttling requests.`,
  );
};

export const parseStorefrontLists = (html: string): ParsedList[] => {
  const blocks = html.split(/(?=<div class="item-hero-container list-item-hero-container)/).slice(1);
  const seen = new Set<string>();
  const lists: ParsedList[] = [];

  for (const block of blocks) {
    const listId = block.match(/\/shop\/carnivalglamhub\/list\/([A-Z0-9]+)/)?.[1];
    if (!listId || seen.has(listId)) continue;

    const image = block.match(/class="list-image-container"><img[^>]*src="([^"]+)"/)?.[1];
    const rawTitle =
      block.match(/class="[^"]*list-title[^"]*"[^>]*>([^<]+)</)?.[1] ??
      block.match(/>([^<>]{3,140})<\/(?:span|div|h2)>/)?.[1];

    const title = decodeEntities(rawTitle ?? "");
    if (!title || !image) continue;

    seen.add(listId);
    lists.push({
      listId,
      externalId: `list-${listId}`,
      title,
      productUrl: `https://www.amazon.com/shop/carnivalglamhub/list/${listId}`,
      sourceImageUrl: image,
    });
  }

  return lists;
};

// Amazon's image CDN takes size directives in the filename. Ask for an 800px
// render rather than the 1000px+ original so the download stays small.
const toLargeSourceUrl = (url: string) =>
  url.replace(/\/images\/I\/([A-Za-z0-9+_-]+)(?:\.[^/]*)?\.(jpg|jpeg|png)$/i, "/images/I/$1._AC_SL800_.$2");

const toSquareJpeg = async (bytes: Uint8Array): Promise<Uint8Array> => {
  const decoded = await Image.decode(bytes);
  const scale = Math.min(IMAGE_SIZE / decoded.width, IMAGE_SIZE / decoded.height);
  decoded.resize(Math.max(1, Math.round(decoded.width * scale)), Math.max(1, Math.round(decoded.height * scale)));

  const canvas = new Image(IMAGE_SIZE, IMAGE_SIZE);
  canvas.fill(0xffffffff);
  canvas.composite(
    decoded,
    Math.round((IMAGE_SIZE - decoded.width) / 2),
    Math.round((IMAGE_SIZE - decoded.height) / 2),
  );

  return await canvas.encodeJPEG(JPEG_QUALITY);
};

type MirrorOutcome = { publicUrl: string } | { error: string };

const mirrorImage = async (
  // deno-lint-ignore no-explicit-any
  supabaseAdmin: any,
  externalId: string,
  sourceImageUrl: string,
): Promise<MirrorOutcome> => {
  try {
    const response = await fetch(toLargeSourceUrl(sourceImageUrl), {
      headers: { "User-Agent": USER_AGENT, Accept: "image/*" },
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) return { error: `image fetch ${response.status}` };

    const original = new Uint8Array(await response.arrayBuffer());
    if (original.byteLength === 0) return { error: "image fetch returned 0 bytes" };

    let payload = original;
    try {
      payload = await toSquareJpeg(original);
    } catch (error) {
      // Keep the untouched bytes rather than losing the image entirely.
      console.warn(`resize failed for ${externalId}, storing original:`, (error as Error).message);
    }

    const path = `${IMAGE_PREFIX}/${externalId}.jpg`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, payload, { contentType: "image/jpeg", upsert: true, cacheControl: "86400" });

    if (uploadError) return { error: `upload: ${uploadError.message}` };

    const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
    return { publicUrl: `${data.publicUrl}?v=${Date.now()}` };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export type AmazonSyncReport = {
  lists_found: number;
  rows_upserted: number;
  images_mirrored: number;
  image_failures: Array<{ external_id: string; error: string }>;
  removed: string[];
};

export const syncAmazonStorefront = async (
  // deno-lint-ignore no-explicit-any
  supabaseAdmin: any,
): Promise<AmazonSyncReport> => {
  const html = await fetchStorefrontHtml();
  const lists = parseStorefrontLists(html);

  if (lists.length === 0) {
    throw new Error("Amazon storefront returned no Idea List cards; markup may have changed.");
  }

  const { data: existingRows } = await supabaseAdmin
    .from("amazon_products")
    .select("external_id, image_url, category");

  const existingById = new Map<string, { image_url: string | null; category: string | null }>(
    (existingRows ?? []).map((row: { external_id: string; image_url: string | null; category: string | null }) => [
      row.external_id,
      { image_url: row.image_url, category: row.category },
    ]),
  );

  const imageFailures: Array<{ external_id: string; error: string }> = [];
  let mirrored = 0;
  const syncedAt = new Date().toISOString();
  const rows: Array<Record<string, unknown>> = [];

  for (const list of lists) {
    const previous = existingById.get(list.externalId);
    const outcome = await mirrorImage(supabaseAdmin, list.externalId, list.sourceImageUrl);

    let imageUrl: string | null;
    if ("publicUrl" in outcome) {
      imageUrl = outcome.publicUrl;
      mirrored += 1;
    } else {
      // A failed image must never blank out a card.
      imageUrl = previous?.image_url ?? null;
      imageFailures.push({ external_id: list.externalId, error: outcome.error });
      console.error(`amazon image mirror failed for ${list.externalId}: ${outcome.error}`);
    }

    rows.push({
      external_id: list.externalId,
      title: list.title,
      price_text: null,
      image_url: imageUrl,
      source_image_url: list.sourceImageUrl,
      product_url: list.productUrl,
      category: previous?.category ?? null,
      raw_payload: { list_id: list.listId, title: list.title, source_image_url: list.sourceImageUrl },
      synced_at: syncedAt,
    });
  }

  const { error: upsertError } = await supabaseAdmin
    .from("amazon_products")
    .upsert(rows, { onConflict: "external_id" });

  if (upsertError) {
    throw new Error(`Amazon products upsert failed: ${upsertError.message}`);
  }

  const keptIds = new Set(rows.map((row) => String(row.external_id)));
  const removed = Array.from(existingById.keys()).filter((id) => !keptIds.has(id));

  if (removed.length > 0) {
    const { error: deleteError } = await supabaseAdmin
      .from("amazon_products")
      .delete()
      .in("external_id", removed);

    if (deleteError) {
      console.warn("Could not prune removed Amazon lists:", deleteError.message);
    }
  }

  return {
    lists_found: lists.length,
    rows_upserted: rows.length,
    images_mirrored: mirrored,
    image_failures: imageFailures,
    removed,
  };
};
