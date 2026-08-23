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
 *     its own messaging. Jamaica is the standing example.
 */

/** ISO (YYYY-MM-DD) last day of the territory's most recent season. */
export const SEASON_END_DATES: Record<string, string> = {
  // 2026 seasons
  jamaica: "2026-04-12",
  guyana: "2026-05-31",
  "saint-lucia": "2026-07-21",
  toronto: "2026-08-01",
  barbados: "2026-08-03",
  antigua: "2026-08-04",
  grenada: "2026-08-11",
  miami: "2026-10-11",
  tobago: "2026-11-01",
  // 2027 seasons
  trinidad: "2027-02-09",
  "trinidad-carnival-2027": "2027-02-09",
  "epic-cruise": "2027-02-09",
};

/**
 * Territories that keep selling forward through their own next-season
 * messaging and must never be caught by `hasSeasonPassed`.
 */
export const SEASON_FORWARD_SLUGS = ["jamaica"] as const;

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
    title: candidate.length <= 70 ? candidate : `${eventName} | ${year} Wrapped | Glam Hub`,
    description: `${eventName} ${year} has wrapped and bookings are closed for this season. See the looks our artists created in our Gallery, and follow Carnival Glam Hub for next season.`,
  };
}
