// Blog posts that have been withdrawn from the site.
//
// Lovable production hosting has no edge or rewrite layer, so the
// repository cannot issue a true 301 and public/_redirects is inert.
// The strongest available signal is the pattern already used by
// scripts/prerender-wix-redirects.ts: a prerendered page carrying a
// canonical to the replacement URL, a meta refresh, a JavaScript
// redirect and enough real content that Google does not classify the
// page as a Soft 404.
//
// Each entry maps a dead /blogs/<slug> to the closest live equivalent,
// so accumulated search signal is consolidated rather than thrown away.

export const REMOVED_POSTS: Record<string, string> = {
  "what-people-say-about-carnival-glam-hub": "/reviews",
};

export const REMOVED_POST_SLUGS: Set<string> = new Set(
  Object.keys(REMOVED_POSTS),
);

export const isRemovedPostSlug = (slug: string | null | undefined): boolean =>
  Boolean(slug && REMOVED_POST_SLUGS.has(slug));

export const removedPostTarget = (
  slug: string | null | undefined,
): string | null => (slug ? REMOVED_POSTS[slug] ?? null : null);

export const REMOVED_POST_BASE = "https://www.carnivalglamhub.com";
