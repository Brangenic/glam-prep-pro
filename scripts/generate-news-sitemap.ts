// Postbuild: writes public/sitemap-news.xml and dist/sitemap-news.xml
// containing blog posts published in the last 48 hours, in Google News
// sitemap format. Mirrors how scripts/prerender-blog-meta.ts reads posts.
//
// If no posts fall in the 48-hour window, a valid empty <urlset> is
// written rather than erroring — Google accepts an empty news sitemap.

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, join, dirname } from "path";
import { createClient } from "@supabase/supabase-js";
import { RECOVERED_POSTS_META } from "../src/data/recoveredPostsMeta";

const BASE_URL = "https://www.carnivalglamhub.com";
const WINDOW_MS = 48 * 60 * 60 * 1000;

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ?? "https://bvrejdrsrmvdknzoskxi.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cmVqZHJzcm12ZGtuem9za3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDM2NzQsImV4cCI6MjA4OTQxOTY3NH0.H6KmuQu8xb__RDjPx2ELH92WdhR4rqhfReRm23XSDN4";

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

const ALLOWED_OVERRIDE_SLUGS = new Set<string>(
  RECOVERED_POSTS_META.map((p) => p.slug),
);

const isExcludedSlug = (slug: string | null | undefined) =>
  !slug ||
  (!ALLOWED_OVERRIDE_SLUGS.has(slug) &&
    EXCLUDED_SLUG_PATTERNS.some((re) => re.test(slug)));

type NewsEntry = { slug: string; title: string; publishedDate: string };

const escapeXml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

function toIso(value: string | null | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function withinWindow(iso: string | null, now: number): boolean {
  if (!iso) return false;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return false;
  return now - t <= WINDOW_MS && t <= now;
}

function renderSitemap(entries: NewsEntry[]): string {
  const urls = entries
    .map((e) => {
      const iso = toIso(e.publishedDate);
      if (!iso) return null;
      const loc = `${BASE_URL}/blogs/${e.slug}`;
      return [
        "  <url>",
        `    <loc>${escapeXml(loc)}</loc>`,
        "    <news:news>",
        "      <news:publication>",
        "        <news:name>Carnival Glam Hub</news:name>",
        "        <news:language>en</news:language>",
        "      </news:publication>",
        `      <news:publication_date>${iso}</news:publication_date>`,
        `      <news:title>${escapeXml(e.title)}</news:title>`,
        "    </news:news>",
        "  </url>",
      ].join("\n");
    })
    .filter((s): s is string => Boolean(s));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
    ...urls,
    "</urlset>",
  ].join("\n");
}

async function main() {
  const now = Date.now();
  const entries: NewsEntry[] = [];
  const seen = new Set<string>();

  // Recovered (code-resident) posts in window.
  for (const p of RECOVERED_POSTS_META) {
    if (isExcludedSlug(p.slug)) continue;
    const iso = toIso(p.publishedDate);
    if (!withinWindow(iso, now)) continue;
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    entries.push({ slug: p.slug, title: p.title, publishedDate: p.publishedDate });
  }

  // DB blog posts in window.
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const since = new Date(now - WINDOW_MS).toISOString();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("slug, post_url, title, published_date, raw_payload")
      .gte("published_date", since)
      .order("published_date", { ascending: false })
      .limit(500);
    if (error) throw error;
    for (const row of data ?? []) {
      const status =
        typeof row.raw_payload?.status === "string"
          ? (row.raw_payload!.status as string).toLowerCase()
          : null;
      const published =
        status === "published" ||
        (status === null &&
          (typeof row.raw_payload?.published === "boolean"
            ? (row.raw_payload!.published as boolean)
            : Boolean(row.published_date)));
      if (!published) continue;
      const slug =
        row.slug ||
        (row.post_url
          ? row.post_url.match(/\/(?:post|blogs?)\/([^/?#]+)/i)?.[1]
          : null);
      if (!slug || isExcludedSlug(slug) || seen.has(slug)) continue;
      const title = (row.title ?? "").toString().trim();
      if (!title) continue;
      seen.add(slug);
      entries.push({
        slug,
        title,
        publishedDate: row.published_date as string,
      });
    }
  } catch (err) {
    console.warn("generate-news-sitemap: failed to fetch blog posts.", err);
  }

  const xml = renderSitemap(entries);

  const outputs = [
    resolve("public/sitemap-news.xml"),
    resolve("dist/sitemap-news.xml"),
  ];
  for (const out of outputs) {
    if (!existsSync(dirname(out))) {
      // Only write to dist/ if the build has produced it; public/ always exists.
      if (out.includes(`${join("", "dist")}`)) continue;
      mkdirSync(dirname(out), { recursive: true });
    }
    writeFileSync(out, xml);
  }
  console.log(
    `generate-news-sitemap: wrote ${entries.length} entries (48h window).`,
  );
}

main().catch((err) => {
  console.error("generate-news-sitemap failed:", err);
  process.exit(0); // never block the build
});