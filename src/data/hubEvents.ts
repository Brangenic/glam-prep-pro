/** Asset-free hub events. Unknown appointment times are never shop hours. */
import { buildAiBookingCatalogue } from "@/data/aiBookingCatalogue";
import { getProfile } from "@/data/territoryProfiles";
import { getTerritoryPricing } from "@/data/territoryPricing";
import { SEASON_END_DATES, SEASON_START_DATES, getOpenPreRegistration, hasSeasonPassed } from "@/data/seasons";
import { jamaicaJsonLd } from "@/data/jamaicaPage";
import { SITE_URL } from "@/lib/constants";

export const ORGANIZATION_DESCRIPTION = "Appointment-only Carnival morning makeup, photoshoot and concierge service, run at partner hotels on Carnival dates. No walk-ins.";

export function hubEvent(slug: string, pagePath = `/${slug}`, image?: string) {
  const key = slug === "trinidad-carnival-2027" ? "trinidad" : slug;
  const profile = getProfile(key);
  const pricing = getTerritoryPricing(key);
  const date = SEASON_END_DATES[key];
  if (!profile?.venue || !date || !pricing || hasSeasonPassed(key)) return null;
  if (key === "jamaica") {
    const event = jamaicaJsonLd({ image }).event;
    return { ...event, url: `${SITE_URL}${pagePath}` };
  }
  const c = buildAiBookingCatalogue();
  const isTrinidad = key === "trinidad";
  const pre = getOpenPreRegistration(key);
  const products = isTrinidad ? c.products : pricing.products;
  const offersUrl = isTrinidad ? `${SITE_URL}/trinidad/book` : pricing.bookingUrl;
  const year = date.slice(0, 4);
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${SITE_URL}/${key}#hub`,
    name: `Carnival Glam Hub, ${profile.name} ${year}`,
    startDate: isTrinidad ? `${c.dates[0].date}T${c.slot_times[0]}:00${c.utc_offset}` : SEASON_START_DATES[key] ?? date,
    endDate: isTrinidad ? `${date}T${c.slot_times[c.slot_times.length - 1]}:00${c.utc_offset}` : date,
    location: isTrinidad ? c.venue_place : { "@type": "Place", name: profile.venue },
    organizer: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    url: `${SITE_URL}${pagePath}`,
    ...(image ? { image: [image] } : {}),
    offers: hasSeasonPassed(key) ? [] : pre ? [{ "@type": "Offer", name: "Pre-registration", price: String(pre.amount), priceCurrency: "USD", url: pre.eventUrl }] : products.map((p) => ({
      "@type": "Offer", name: p.label, price: String(p.price), priceCurrency: "USD", url: offersUrl,
    })),
  };
}