/**
 * The homepage "Book now" territory row, and where every generic
 * "Book Now" button goes.
 *
 * Website paths always go to MasOS, and never to the bare events list
 * without context. A territory appears in the row only while its season is
 * still ahead (`hasSeasonPassed`), it has its own MasOS event on file
 * (`hasBookableEvent`), and there is something to buy: a quotable product
 * list in `territoryPricing.ts`, or an open pre-registration in
 * `seasons.ts`. Soonest season first. Nothing here names a territory, so a
 * territory drops off the day its season ends and a new one appears the
 * day it is opened in the data layer.
 *
 * Asset free, so the prerender scripts can import it.
 */
import { TERRITORY_PROFILES, getProfile } from "@/data/territoryProfiles";
import { getTerritoryPricing } from "@/data/territoryPricing";
import { SEASON_END_DATES, hasSeasonPassed, isPreRegistrationOpen } from "@/data/seasons";
import { buildDestinationUrl, hasBookableEvent } from "@/lib/destinations";

/** In-page anchor of the homepage territory row. */
export const BOOK_TERRITORY_ANCHOR = "book-territory";

export type BookingTerritory = {
  slug: string;
  /** Button label, for example "Jamaica" or "Grenada (pre-register)". */
  label: string;
  shortName: string;
  /** True when the only thing on sale is a pre-registration. */
  preRegister: boolean;
  /** The territory's own MasOS event, with the site's UTM convention. */
  href: string;
};

/**
 * Pages that are the same Carnival and the same MasOS event as another
 * territory. They never get a second button in the row.
 */
const SAME_EVENT_AS: Record<string, string> = {
  "trinidad-carnival-2027": "trinidad",
};

function isSellable(slug: string, today: Date): { sellable: boolean; preRegister: boolean } {
  const pricing = getTerritoryPricing(slug);
  const hasProducts = Boolean(
    pricing && pricing.quotable && pricing.runningThisSeason !== false && pricing.products.length > 0,
  );
  if (hasProducts) return { sellable: true, preRegister: false };
  if (isPreRegistrationOpen(slug, today)) return { sellable: true, preRegister: true };
  return { sellable: false, preRegister: false };
}

export function getActiveBookingTerritories(
  today: Date = new Date(),
  campaign = "home_booking_bar",
): BookingTerritory[] {
  return TERRITORY_PROFILES.filter(
    (p) =>
      !SAME_EVENT_AS[p.slug] &&
      !hasSeasonPassed(p.slug, today) &&
      hasBookableEvent(p.slug),
  )
    .map((p) => ({ p, s: isSellable(p.slug, today) }))
    .filter(({ s }) => s.sellable)
    .sort(
      (a, b) =>
        (SEASON_END_DATES[a.p.slug] ?? "9999-12-31").localeCompare(
          SEASON_END_DATES[b.p.slug] ?? "9999-12-31",
        ) || a.p.slug.localeCompare(b.p.slug),
    )
    .map(({ p, s }) => ({
      slug: p.slug,
      shortName: p.shortName,
      label: s.preRegister ? `${p.shortName} (pre-register)` : p.shortName,
      preRegister: s.preRegister,
      href: buildDestinationUrl(p.slug, campaign),
    }));
}

/** The territory a page is about, if any. */
export function territoryForPath(pathname: string): string | null {
  const clean = pathname.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  const profile = TERRITORY_PROFILES.find((p) => p.path === clean);
  if (profile) return profile.slug;
  const seasonal = clean.match(/^\/([a-z-]+)-carnival-makeup-\d{4}$/);
  if (seasonal && getProfile(seasonal[1])) return seasonal[1];
  const answer = clean.match(/^\/best-carnival-makeup-([a-z-]+)$/);
  if (answer && getProfile(answer[1])) return answer[1];
  return null;
}

export type BookNowLink = { href: string; external: boolean };

/**
 * Where a generic "Book Now" button goes on a given page.
 *
 *   - A page about a territory that is on sale: that territory's own
 *     MasOS event.
 *   - The homepage: the territory row, so the visitor picks a territory.
 *   - Anywhere else: the homepage territory row.
 */
export function resolveBookNowLink(
  pathname: string,
  campaign: string,
  today: Date = new Date(),
): BookNowLink {
  const slug = territoryForPath(pathname);
  if (slug) {
    const key = SAME_EVENT_AS[slug] ?? slug;
    const active = getActiveBookingTerritories(today, campaign).find((t) => t.slug === key);
    if (active) return { href: buildDestinationUrl(slug, campaign), external: true };
  }
  const clean = pathname.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  return {
    href: clean === "/" ? `#${BOOK_TERRITORY_ANCHOR}` : `/#${BOOK_TERRITORY_ANCHOR}`,
    external: false,
  };
}
