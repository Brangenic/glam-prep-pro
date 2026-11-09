/**
 * Current-season notices for blog posts that rank for a newer season than
 * the one they were written about. The notice sits at the top of the
 * article body on the React page (src/components/blog/SeasonNotice.tsx)
 * and in the prerendered body (scripts/prerender-bodies.ts), so both
 * surfaces read the same copy from here. The article's own text, title,
 * slug and meta description are never changed.
 *
 * To add a post, add its slug and the notice parts. A part is plain text
 * or a link. This module imports no assets, so Node scripts can read it.
 */

export type SeasonNoticePart = string | { text: string; href: string };

export const BLOG_SEASON_NOTICES: Record<string, SeasonNoticePart[]> = {
  "ultimate-guide-to-trinidad-carnival-2026-mas-bands-dates-insider-tips": [
    "Looking for Trinidad Carnival 2027? Carnival Monday and Tuesday 2027 fall on 8 and 9 February. See our ",
    { text: "Trinidad Carnival 2027 page", href: "/trinidad-carnival-2027" },
    " and the ",
    {
      text: "2027 first-time masquerader guide",
      href: "/blogs/trinidad-carnival-2027-first-time-masquerader-guide",
    },
    ".",
  ],
};

export function getSeasonNotice(slug: string | undefined): SeasonNoticePart[] | undefined {
  return slug ? BLOG_SEASON_NOTICES[slug] : undefined;
}

/** Plain text of a notice, for tests and logs. */
export function seasonNoticeText(parts: SeasonNoticePart[]): string {
  return parts.map((p) => (typeof p === "string" ? p : p.text)).join("");
}
