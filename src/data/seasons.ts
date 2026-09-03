import { TERRITORY_PROFILES } from "@/data/territoryProfiles";
import { fitTitle, fitDescription, TITLE_MAX } from "@/lib/metaText";

/**
 * Season calendar. Single source of truth for when a territory's Carnival
 * has happened.
 *
 * Nothing anywhere else may hardcode a list of "passed" territories.
 * Everything derives from `hasSeasonPassed(slug)`, which compares the
 * territory's ISO season end date with today. The moment a date goes by,
 * the site closes that territory out on its own: booking calls to action
 * become Gallery links, the package grid stops being bookable, the
 * booking calculator drops the territory, and station rentals stop
 * selling a station at an event that has already happened.
 *
 * Rules:
 *   - A territory with no date here is treated as NOT passed.
 *   - A territory listed in `SEASON_FORWARD_SLUGS` is never treated as
 *     passed, because it already points forward to its next season with
 *     its own messaging. Epic Cruise is the standing example.
 */

/** ISO (YYYY-MM-DD) last day of the territory's most recent season. */
export const SEASON_END_DATES: Record<string, string> = {
  // 2026 seasons
  guyana: "2026-05-31",
  "saint-lucia": "2026-07-21",
  toronto: "2026-08-01",
  barbados: "2026-08-03",
  antigua: "2026-08-04",
  grenada: "2026-08-11",
  miami: "2026-10-11",
  tobago: "2026-11-01",
  // 2027 seasons
  jamaica: "2027-04-04",
  trinidad: "2027-02-09",
  "trinidad-carnival-2027": "2027-02-09",
};


/**
 * Territories that keep selling forward through their own next-season
 * messaging and must never be caught by `hasSeasonPassed`.
 */
// Epic Cruise does not sail in 2027. It returns in 2028 with no confirmed
// day yet, so it keeps pointing forward and must never carry a 2027 date.
export const SEASON_FORWARD_SLUGS = ["epic-cruise"] as const;

/** Where a closed-out territory sends people instead of the booking flow. */
export const GALLERY_HREF = "/#gallery";

/** Wording for a Gallery call to action on a closed-out territory. */
export const GALLERY_CTA = "See the 2026 looks";
export const GALLERY_CTA_SHORT = "View the Gallery";

function endOfDay(iso: string): number {
  // Compare against the end of the season's last day, so a territory is
  // only closed out once its final day is fully behind us.
  return new Date(`${iso}T23:59:59Z`).getTime();
}

/**
 * True when this territory's season is over. Date-driven, so no one has
 * to remember to edit a list next season.
 */
export function hasSeasonPassed(slug: string, today: Date = new Date()): boolean {
  if ((SEASON_FORWARD_SLUGS as readonly string[]).includes(slug)) return false;
  const iso = SEASON_END_DATES[slug];
  if (!iso) return false;
  return today.getTime() > endOfDay(iso);
}

/** Calendar year of the season that has just passed, for copy. */
export function passedSeasonYear(slug: string): string {
  const iso = SEASON_END_DATES[slug];
  return iso ? iso.slice(0, 4) : "";
}

/** Short banner line for a closed-out territory. */
export function seasonWrappedLine(name: string, slug: string): string {
  const year = passedSeasonYear(slug);
  return `${name} ${year} has wrapped. Bookings are closed for this season.`;
}

/**
 * Meta title and description for a closed-out territory. Used by the
 * runtime page and by the prerendered head so both agree. Titles stay
 * inside the 70 character limit the site enforces.
 */
export function seasonAwareMeta(
  slug: string,
  eventName: string,
  title: string,
  description: string,
): { title: string; description: string } {
  if (!hasSeasonPassed(slug)) return { title, description };
  const year = passedSeasonYear(slug);
  const candidate = `${eventName} Makeup | ${year} Season Wrapped | Glam Hub`;
  return {
    title: fitTitle(
      candidate.length <= TITLE_MAX ? candidate : `${eventName} | ${year} Wrapped | Glam Hub`,
    ),
    description: fitDescription(
      `${eventName} ${year} has wrapped and bookings are closed. See the looks our artists created in our Gallery, and follow Carnival Glam Hub for next season.`,
    ),
  };
}

/* ============================================================
 * Onward destination links.
 *
 * Permanent rule: any list, grid, strip, banner or link block that
 * points a visitor at a destination other than the one they are viewing
 * must show upcoming destinations only. A Carnival that has passed never
 * appears as an onward option anywhere on the site.
 *
 * The destination pages themselves stay live, stay indexed and stay in
 * the sitemap. This is about onward links, not about deleting pages.
 *
 * Every list on the site reads this one helper. It is computed from the
 * live clock at call time, so the React app recomputes on hydration even
 * if the prerendered HTML was built before a season passed.
 * ============================================================ */

export type UpcomingDestination = {
  slug: string;
  name: string;
  shortName: string;
  dateText: string;
  path: string;
};

/**
 * Trinidad and Trinidad Carnival 2027 are the same Carnival, so they must
 * never both appear in one onward list. Prefer whichever is not the page
 * being viewed, and where both are candidates keep the 2027 page only.
 */
function dedupeTrinidadPair(
  list: UpcomingDestination[],
  excludeSlug?: string,
): UpcomingDestination[] {
  const has2027 = list.some((d) => d.slug === "trinidad-carnival-2027");
  const hasHub = list.some((d) => d.slug === "trinidad");
  if (!has2027 || !hasHub) return list;
  const drop = excludeSlug === "trinidad-carnival-2027" ? "trinidad-carnival-2027" : "trinidad";
  return list.filter((d) => d.slug !== drop);
}

export type UpcomingOptions = {
  /** Set false where both Trinidad pages should stay listed, e.g. the footer sitemap. */
  dedupeTrinidad?: boolean;
};

/**
 * Upcoming destinations only, soonest season first, with pages that
 * exist. Territories with no season date sort last.
 */
export function getUpcomingDestinations(
  excludeSlug?: string,
  limit?: number,
  opts: UpcomingOptions = {},
): UpcomingDestination[] {
  const { dedupeTrinidad = true } = opts;
  // Imported lazily at module scope below to keep this module asset free.
  const sorted = TERRITORY_PROFILES.filter(
    (p) =>
      p.path &&
      p.slug !== excludeSlug &&
      p.dateText.trim() &&
      !hasSeasonPassed(p.slug),
  )
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      shortName: p.shortName,
      dateText: p.dateText,
      path: p.path as string,
      sortKey: SEASON_END_DATES[p.slug] ?? "9999-12-31",
    }))
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey) || a.slug.localeCompare(b.slug))
    .map(({ sortKey: _sortKey, ...rest }) => rest);

  const deduped = dedupeTrinidad ? dedupeTrinidadPair(sorted, excludeSlug) : sorted;
  return typeof limit === "number" ? deduped.slice(0, limit) : deduped;
}

/** True when a slug may be offered as an onward destination link. */
export function isUpcomingDestination(slug: string): boolean {
  return !hasSeasonPassed(slug);
}
