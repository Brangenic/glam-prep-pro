/**
 * Owner rule: website paths always go to MasOS; the Trinidad portal is
 * AI-discovery only.
 *
 * These pages stay live for people arriving from AI assistants (ChatGPT,
 * Claude, Perplexity and the glam-hub-mcp app), but nothing on
 * carnivalglamhub.com links to them, they carry noindex, nofollow on both
 * surfaces and they are kept out of every sitemap. They are NOT disallowed
 * in robots.txt, because a crawler that cannot fetch a page cannot see its
 * noindex. public/llms.txt keeps its lines for AI discovery.
 *
 * Asset-free, so the prerender scripts can import it.
 */
export const AI_DISCOVERY_ONLY_PATHS = [
  "/trinidad/book",
  "/trinidad/book/confirmed",
  "/trinidad/book/cancelled",
  "/ai-booking-app",
] as const;

export const AI_DISCOVERY_ONLY_ROBOTS = "noindex, nofollow";

export function isAiDiscoveryOnlyPath(path: string): boolean {
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  return (AI_DISCOVERY_ONLY_PATHS as readonly string[]).includes(clean);
}
