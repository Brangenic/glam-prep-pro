// Regenerates public/sitemap.xml from live Supabase data.
// Runs automatically before `vite dev` and `vite build` via the
// predev/prebuild npm scripts, so every publish ships a fresh sitemap.

import { writeFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://www.carnivalglamhub.com";

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ?? "https://bvrejdrsrmvdknzoskxi.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cmVqZHJzcm12ZGtuem9za3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDM2NzQsImV4cCI6MjA4OTQxOTY3NH0.H6KmuQu8xb__RDjPx2ELH92WdhR4rqhfReRm23XSDN4";

const TODAY = new Date().toISOString().split("T")[0];

type StaticEntry = {
  path: string;
  priority: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  lastmod?: string;
};

const staticEntries: StaticEntry[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/blogs", priority: "0.9", changefreq: "daily" },
  { path: "/reviews", priority: "0.8", changefreq: "weekly" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/faq", priority: "0.5", changefreq: "monthly" },
  { path: "/press", priority: "0.6", changefreq: "monthly" },
  { path: "/services/carnival-makeup", priority: "0.8", changefreq: "monthly" },
  { path: "/services/carnival-hair", priority: "0.8", changefreq: "monthly" },
  { path: "/services/carnival-photoshoot", priority: "0.8", changefreq: "monthly" },
  { path: "/services/carnival-shuttle", priority: "0.8", changefreq: "monthly" },
  { path: "/services/getting-dressed", priority: "0.8", changefreq: "monthly" },
  { path: "/trinidad-carnival-2027", priority: "0.9", changefreq: "weekly" },
  { path: "/trinidad/book", priority: "0.9", changefreq: "daily" },
  { path: "/ai-booking-app", priority: "0.6", changefreq: "monthly" },
  { path: "/amazon-store", priority: "0.7", changefreq: "weekly" },
  { path: "/booking-calculator", priority: "0.6", changefreq: "monthly" },
  { path: "/station-rentals", priority: "0.5", changefreq: "monthly" },
  { path: "/joinourteam", priority: "0.4", changefreq: "monthly" },
  { path: "/policies", priority: "0.3", changefreq: "yearly" },

  { path: "/jamaica", priority: "0.8", changefreq: "weekly" },
  { path: "/trinidad", priority: "0.8", changefreq: "weekly" },
  { path: "/saint-lucia", priority: "0.8", changefreq: "weekly" },
  { path: "/grenada", priority: "0.8", changefreq: "weekly" },
  { path: "/antigua", priority: "0.8", changefreq: "weekly" },
  { path: "/barbados", priority: "0.8", changefreq: "weekly" },
  { path: "/miami", priority: "0.8", changefreq: "weekly" },
  { path: "/toronto", priority: "0.8", changefreq: "weekly" },
  { path: "/tobago", priority: "0.8", changefreq: "weekly" },
  { path: "/guyana", priority: "0.8", changefreq: "weekly" },
  { path: "/epic-cruise", priority: "0.8", changefreq: "weekly" },
  { path: "/best-carnival-makeup-trinidad", priority: "0.85", changefreq: "monthly" },
  { path: "/best-carnival-makeup-jamaica", priority: "0.85", changefreq: "monthly" },
  { path: "/best-carnival-makeup-miami", priority: "0.85", changefreq: "monthly" },
];

const EXCLUDED_SLUG_PATTERNS: RegExp[] = [
  /^atlanta-/i,
  /^antigua-/i,
  /^spicemas-/i,
  /crop-over-/i,
  /^chatgpt/i,
  /gpt/i,
  /^ai-/i,
  /-ai-/i,
  /^artificial/i,
];

const EXCLUDED_AUTHORS = new Set([
  "Krystal Angelique",
  "Melissa Chung",
  "Shadge Henry",
  "Marissa Williams",
  "Tamika Campbell",
  "Mala Morrison",
  "Antoinette Dixon",
  "Jade Amiel",
  "Shadae Henry",
  "Snowwhite Hogie",
  "Daydrie Burke",
]);

import { RECOVERED_POSTS_META } from "../src/data/recoveredPostsMeta";

import { isRemovedPostSlug } from "../src/lib/removedPosts";

const ALLOWED_OVERRIDE_SLUGS = new Set<string>(
  RECOVERED_POSTS_META.map((p) => p.slug),
);

const isExcludedSlug = (slug: string | null | undefined) => {
  if (!slug) return true;
  // Withdrawn posts are gone from every crawler surface.
  if (isRemovedPostSlug(slug)) return true;
  if (ALLOWED_OVERRIDE_SLUGS.has(slug)) return false;
  return EXCLUDED_SLUG_PATTERNS.some((re) => re.test(slug));
};

const isPublished = (row: { published_date?: string | null; raw_payload?: Record<string, unknown> | null }) => {
  const status = typeof row.raw_payload?.status === "string" ? row.raw_payload.status.toLowerCase() : null;
  if (status) return status === "published";
  if (typeof row.raw_payload?.published === "boolean") return row.raw_payload.published;
  return Boolean(row.published_date);
};

const getSlugFromPostUrl = (postUrl: string | null | undefined) => {
  if (!postUrl) return null;
  const match = postUrl.match(/\/(?:post|blogs?)\/([^/?#]+)/i);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
};

function buildXml(
  entries: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }>,
) {
  const urls = entries
    .map(
      (e) =>
        `  <url><loc>${e.loc}</loc><lastmod>${e.lastmod}</lastmod><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const entries: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> =
    staticEntries.map((e) => ({
      loc: `${BASE_URL}${e.path}`,
      lastmod: e.lastmod ?? TODAY,
      changefreq: e.changefreq,
      priority: e.priority,
    }));

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("slug, post_url, author_name, updated_at, published_date, raw_payload")
      .order("synced_at", { ascending: false })
      .limit(500);

    if (error) throw error;

    const seen = new Set<string>();
    // Always include recovered code-resident posts.
    for (const p of RECOVERED_POSTS_META) {
      if (seen.has(p.slug)) continue;
      seen.add(p.slug);
      entries.push({
        loc: `${BASE_URL}/blogs/${p.slug}`,
        lastmod: p.publishedDate,
        changefreq: "monthly",
        priority: "0.7",
      });
    }
    for (const row of data ?? []) {
      if (!isPublished(row)) continue;
      const slug = row.slug || getSlugFromPostUrl(row.post_url);
      if (!slug) continue;
      if (isExcludedSlug(slug)) continue;
      if (
        row.author_name &&
        EXCLUDED_AUTHORS.has(row.author_name.trim()) &&
        !ALLOWED_OVERRIDE_SLUGS.has(slug)
      ) continue;
      if (seen.has(slug)) continue;
      seen.add(slug);

      const lastmod = row.updated_at
        ? new Date(row.updated_at).toISOString().split("T")[0]
        : TODAY;

      entries.push({
        loc: `${BASE_URL}/blogs/${slug}`,
        lastmod,
        changefreq: "monthly",
        priority: "0.7",
      });
    }

    console.log(`Included ${seen.size} blog post URLs from live database.`);
  } catch (err) {
    console.warn("Sitemap: failed to fetch blog posts, writing static-only sitemap.", err);
  }

  const xml = buildXml(entries);
  writeFileSync(resolve("public/sitemap.xml"), xml);
  console.log(`sitemap.xml written (${entries.length} entries)`);
}

main().catch((err) => {
  console.error("Sitemap generation failed:", err);
  process.exit(0); // do not block build
});