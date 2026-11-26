/**
 * Owner update: generic booking CTAs use external events. Dated Trinidad
 * catalogue package links are permitted in the requested Trinidad/AI page
 * blocks, llms.txt, JADE and MCP options.
 *
 * Navbar and footer do not link to any path in PORTAL_PATHS. Of
 * those, /trinidad/book is indexable and in the sitemap. The payment return
 * pages and /ai-booking-app carry noindex, nofollow on both surfaces and stay
 * out of every sitemap. None is ever disallowed in robots.txt, because a
 * crawler that cannot fetch a page cannot see its noindex. public/llms.txt
 * keeps its lines for AI discovery.
 *
 * Asset-free, so the prerender scripts can import it.
 */
export const AI_DISCOVERY_ONLY_PATHS = [
  "/trinidad/book",
  "/trinidad/book/confirmed",
  "/trinidad/book/cancelled",
  "/ai-booking-app",
] as const;

/** Portal paths that are hidden from search engines. /trinidad/book is not one of them. */
export const NOINDEX_PORTAL_PATHS = [
  "/trinidad/book/confirmed",
  "/trinidad/book/cancelled",
  "/ai-booking-app",
] as const;

export const AI_DISCOVERY_ONLY_ROBOTS = "noindex, nofollow";

function clean(path: string): string {
  return path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
}

/** True for every portal path: none may be linked from the website. */
export function isAiDiscoveryOnlyPath(path: string): boolean {
  return (AI_DISCOVERY_ONLY_PATHS as readonly string[]).includes(clean(path));
}

/** True for portal paths that carry noindex, nofollow. */
export function isNoindexPortalPath(path: string): boolean {
  return (NOINDEX_PORTAL_PATHS as readonly string[]).includes(clean(path));
}
