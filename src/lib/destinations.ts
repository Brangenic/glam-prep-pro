import { BOOKING_URL } from "@/lib/constants";
import { GALLERY_HREF, hasSeasonPassed } from "@/data/seasons";
import { getProfile } from "@/data/territoryProfiles";

export interface Destination {
  slug: string;
  label: string;
  masosUrl: string;
}

export const DESTINATIONS: Destination[] = [
  { slug: 'saint-lucia', label: 'Saint Lucia', masosUrl: 'https://carnivalglamhub.masos.app/events/060faa4a-949a-4b36-893e-dc6db75e3100' },
  { slug: 'toronto', label: 'Toronto', masosUrl: 'https://carnivalglamhub.masos.app/events/9d7627f9-f1ea-4e3d-a54b-1898f9a7a98f' },
  { slug: 'barbados', label: 'Barbados', masosUrl: 'https://carnivalglamhub.masos.app/events/d76deb6d-c816-4df6-9006-05a11a555c43' },
  { slug: 'antigua', label: 'Antigua', masosUrl: 'https://carnivalglamhub.masos.app/events/5ff02f96-f867-4e59-9ca8-f88a48eafb44' },
  { slug: 'grenada', label: 'Grenada', masosUrl: 'https://carnivalglamhub.masos.app/events/19940fc1-1fa1-4d34-8a7b-a4c3562df100' },
  { slug: 'miami', label: 'Miami', masosUrl: 'https://carnivalglamhub.masos.app/events/d6238a3f-73d0-4805-a3f2-91e8b4415047' },
  { slug: 'trinidad', label: 'Trinidad', masosUrl: 'https://carnivalglamhub.masos.app/events/cef3860d-c2e6-4753-a065-4ea39c0eb8cb' },
  // Same Carnival and the same MasOS event as /trinidad, so the 2027 guide
  // page can send a card straight to the event too.
  { slug: 'trinidad-carnival-2027', label: 'Trinidad Carnival 2027', masosUrl: 'https://carnivalglamhub.masos.app/events/cef3860d-c2e6-4753-a065-4ea39c0eb8cb' },
  // Epic Cruise does not sail in 2027 and nothing is on sale for the 2028
  // return, so neither slug carries a bookable event. Cards fall back to
  // /epic-cruise, where the register-interest call to action lives.
  { slug: 'epic', label: 'Epic Carnival Experience', masosUrl: BOOKING_URL },
  { slug: 'epic-cruise', label: 'Epic Cruise', masosUrl: BOOKING_URL },
  { slug: 'jamaica', label: 'Jamaica', masosUrl: 'https://carnivalglamhub.masos.app/events/0ad062ce-d1e0-4838-aeaf-f418ed526440' },
  { slug: 'tobago', label: 'Tobago', masosUrl: 'https://carnivalglamhub.masos.app/events/755be168-61a2-4827-9e9e-d52668a790ff' },
  // Guyana has no confirmed masos event yet, so it points at the generic events listing.
  { slug: 'guyana', label: 'Guyana', masosUrl: BOOKING_URL },
];

export function getDestination(slug: string) {
  return DESTINATIONS.find(d => d.slug === slug.toLowerCase());
}

export function buildDestinationUrl(slug: string, campaign = 'destination_selector'): string {
  const dest = getDestination(slug);
  const base = dest?.masosUrl ?? 'https://carnivalglamhub.masos.app/events';
  const params = new URLSearchParams({
    utm_source: 'carnivalglamhub',
    utm_medium: 'website',
    utm_campaign: campaign,
    utm_content: slug,
  });
  return `${base}?${params.toString()}`;
}

/**
 * One place decides where a destination card goes.
 *
 * The journey is home, card, MasOS event. The destination page hop is
 * gone for anything we can actually sell.
 *
 *   - Season wrapped: the card goes to the Gallery, per the season rules.
 *   - Upcoming with a real event on file: straight to that event, with
 *     UTMs attached.
 *   - Upcoming with no event on file, currently Jamaica and Tobago: the
 *     card goes to its own destination page, where the waitlist or
 *     enquiry call to action lives. It must never go to the generic
 *     events list, because that drops a visitor who clicked one
 *     territory into a list of others.
 */
export type DestinationCardLink = {
  href: string;
  /** True only for an outbound booking link, so callers set target and rel the same way. */
  external: boolean;
};

export function hasBookableEvent(slug: string): boolean {
  const dest = getDestination(slug);
  return Boolean(dest && dest.masosUrl.includes("/events/"));
}

export function getDestinationCardLink(
  slug: string,
  campaign: string,
): DestinationCardLink {
  if (hasSeasonPassed(slug)) return { href: GALLERY_HREF, external: false };
  if (hasBookableEvent(slug)) {
    return { href: buildDestinationUrl(slug, campaign), external: true };
  }
  return { href: getProfile(slug)?.path ?? `/${slug}`, external: false };
}
