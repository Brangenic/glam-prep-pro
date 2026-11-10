// Ordering rules for the /blogs journal index, shared by the React page
// (src/pages/Blogs.tsx) and the build-time prerender
// (scripts/prerender-bodies.ts) so both surfaces always pick the same
// Latest Post hero. Node safe: no image or Vite-only imports.

import { RECOVERED_POSTS_META } from "../data/recoveredPostsMeta";
import { isRemovedPostSlug } from "./removedPosts";

export type BlogIndexPost = {
  external_id: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  slug: string | null;
  post_url: string;
  author_name: string | null;
  author_avatar_url: string | null;
  published_date: string | null;
  read_time: string | null;
};

const EXCLUDED_SLUG_PATTERNS: RegExp[] = [
  /^atlanta-/i,
  /^antigua-/i,
  /^spicemas-/i,
  /^crop-over-/i,
  /^chatgpt-/i,
  /gpt/i,
  /^ai-/i,
  /^artificial-/i,
];

// Slugs that bypass the exclusion patterns and the EXCLUDED_AUTHORS filter.
// Used for legacy Wix posts we have intentionally restored.
const ALLOWED_OVERRIDE_SLUGS = new Set<string>(
  RECOVERED_POSTS_META.map((p) => p.slug),
);

const EXCLUDED_AUTHORS = [
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
];

export const isExcludedSlug = (slug: string | null | undefined) => {
  if (!slug) return false;
  // Withdrawn posts never appear in the index, whatever else they match.
  if (isRemovedPostSlug(slug)) return true;
  if (slug && ALLOWED_OVERRIDE_SLUGS.has(slug)) return false;
  return EXCLUDED_SLUG_PATTERNS.some((re) => re.test(slug));
};

export const getSlugFromPostUrl = (postUrl: string) => {
  const match = postUrl.match(/\/post\/([^/?#]+)/i);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
};

export const resolveSlug = (post: BlogIndexPost) =>
  post.slug || getSlugFromPostUrl(post.post_url) || post.external_id;

const FEATURED_SLUG = "trinidad-carnival-2027-first-time-masquerader-guide";
const MANUAL_GRID_ORDER: string[] = [
  "is-professional-carnival-makeup-worth-it",
  "how-far-in-advance-to-book-carnival-makeup",
  "ultimate-guide-to-trinidad-carnival-2026-mas-bands-dates-insider-tips",
  "youre-outside-for-trinidad-jouvert-but-your-hair-whats-she-doing",
  "caribbean-carnival-has-an-airlift-problem",
  "2025-carnival-makeup-guide-50-looks-to-show-your-mua",
  "what-is-jouvert-and-why-should-you-do-it-at-least-once",
  "jab-jab-grenada-2026-guide",
  "jab-jab-101-what-you-really-need-to-know-about-grenada-carnival",
  "should-the-makeup-match-your-costume",
  "genx-miami-carnival-2024-costumes",
];

// Parse published_date defensively; unparseable/missing → null so those
// posts can never win the "Latest Post" hero slot.
export const parsePostDate = (v: string | null | undefined): number | null => {
  if (!v) return null;
  const t = Date.parse(v);
  return Number.isFinite(t) ? t : null;
};

/** Database rows visible on the journal index. */
export function filterDatabasePosts<T extends BlogIndexPost>(rows: T[]): T[] {
  return rows.filter(
    (p) =>
      (
        (p.slug && ALLOWED_OVERRIDE_SLUGS.has(p.slug)) ||
        !p.author_name ||
        !EXCLUDED_AUTHORS.includes(p.author_name.trim())
      ) &&
      !isExcludedSlug(p.slug) &&
      !isExcludedSlug(getSlugFromPostUrl(p.post_url)),
  );
}

/**
 * The newest post across the set. This slug is always pinned to the hero
 * regardless of the curated grid order, so any future post with a newer
 * date automatically takes the slot.
 */
export function selectNewestPostSlug(posts: BlogIndexPost[]): string | null {
  let newestSlug: string | null = null;
  let newestTime = -Infinity;
  for (const p of posts) {
    const t = parsePostDate(p.published_date);
    if (t !== null && t > newestTime) {
      newestTime = t;
      newestSlug = resolveSlug(p);
    }
  }
  return newestSlug;
}

/**
 * Builds the journal index in display order: newest post first (hero),
 * then FEATURED_SLUG, then MANUAL_GRID_ORDER, then everything else by
 * published_date desc. `dbRows` are blog_posts rows ordered by synced_at
 * desc, exactly as the page reads them.
 */
export function buildBlogIndex<T extends BlogIndexPost>(dbRows: T[], manualPosts: T[]): T[] {
  const filtered = filterDatabasePosts(dbRows);
  // Merge manual posts, deduping by slug in case the synced source
  // ever picks them up later.
  const existingSlugs = new Set(filtered.map((p) => resolveSlug(p)));
  const manuals = manualPosts.filter((p) => !existingSlugs.has(resolveSlug(p)));
  const merged = [...manuals, ...filtered];

  const newestSlug = selectNewestPostSlug(merged);

  // The hero post is excluded from later buckets so it never repeats.
  const orderIndex = (slug: string) => {
    if (newestSlug && slug === newestSlug) return -2;
    if (slug === FEATURED_SLUG) return -1;
    const i = MANUAL_GRID_ORDER.indexOf(slug);
    return i === -1 ? Number.POSITIVE_INFINITY : i;
  };
  return [...merged].sort((a, b) => {
    const ai = orderIndex(resolveSlug(a));
    const bi = orderIndex(resolveSlug(b));
    if (ai !== bi) return ai - bi;
    const ad = parsePostDate(a.published_date) ?? 0;
    const bd = parsePostDate(b.published_date) ?? 0;
    return bd - ad;
  });
}

export const truncateText = (s: string, n: number) =>
  s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s;
