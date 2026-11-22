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

import {
  JAMAICA_DATE_TEXT,
  JAMAICA_EVENT_NAME,
  JAMAICA_PATH,
  JAMAICA_VENUE,
} from "@/data/jamaicaPage";

export type SeasonNoticePart = string | { text: string; href: string };

/** The recovered 2025 Jamaica guide, kept word for word below its notice. */
export const JAMAICA_2025_GUIDE_SLUG = "your-ultimate-guide-to-jamaica-carnival-2025-everything-you-need-to-know";

// The Trinidad guide whose slug still says 2026 was already refreshed to
// 2027 in its title and h1, so it needs no notice.
export const BLOG_SEASON_NOTICES: Record<string, SeasonNoticePart[]> = {
  [JAMAICA_2025_GUIDE_SLUG]: [
    `Planning for 2027? This guide was written for the 2025 season. ${JAMAICA_EVENT_NAME} is on ${JAMAICA_DATE_TEXT}, with the Carnival Glam Hub at the ${JAMAICA_VENUE}. See the `,
    { text: `${JAMAICA_EVENT_NAME} Glam Hub page`, href: JAMAICA_PATH },
    " for prices, what is included and booking.",
  ],
};

export function getSeasonNotice(slug: string | undefined): SeasonNoticePart[] | undefined {
  return slug ? BLOG_SEASON_NOTICES[slug] : undefined;
}

/** Plain text of a notice, for tests and logs. */
export function seasonNoticeText(parts: SeasonNoticePart[]): string {
  return parts.map((p) => (typeof p === "string" ? p : p.text)).join("");
}
