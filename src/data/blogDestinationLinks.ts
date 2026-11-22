/**
 * Blog posts that are about a territory but whose slug does not name it
 * first, so the slug-based related link would miss it. Each listed post
 * also links to these destination pages, on the React page
 * (src/pages/BlogPost.tsx) and in the prerendered body
 * (scripts/prerender-bodies.ts).
 *
 * Editorial links only, never an offer. Onward destination rule applies:
 * a territory whose season has passed is filtered out at render time with
 * hasSeasonPassed, so nothing here needs editing when a season ends.
 *
 * Asset free, so the prerender scripts can import it.
 */
import { getProfile } from "@/data/territoryProfiles";
import { hasSeasonPassed } from "@/data/seasons";

export const BLOG_EXTRA_DESTINATIONS: Record<string, string[]> = {
  "2027-carnival-calendar": ["jamaica"],
  "trinidad-carnival-vs-jamaica-carnival": ["jamaica"],
  "chatgpt-picks-the-top-5-best-caribbean-carnivals-heres-my-wild-take": ["jamaica"],
};

export type BlogDestinationLink = { to: string; label: string };

export function blogExtraDestinations(slug: string | undefined, today: Date = new Date()): BlogDestinationLink[] {
  if (!slug) return [];
  return (BLOG_EXTRA_DESTINATIONS[slug] ?? [])
    .filter((s) => !hasSeasonPassed(s, today))
    .map((s) => getProfile(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({ to: p.path, label: `${p.name} Glam Hub` }));
}
