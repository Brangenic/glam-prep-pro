/** Both renderings, discovery and the sitemap read these same seasonal facts. */
import published from "@/data/publishedMakeupSeasons.json";
import { TERRITORY_PRICING } from "@/data/territoryPricing";
import { getProfile } from "@/data/territoryProfiles";
import { getFreeInclusions } from "@/data/hubTiers";
import { SEASON_END_DATES, hasSeasonPassed } from "@/data/seasons";
import { buildAiBookingCatalogue } from "@/data/aiBookingCatalogue";
import { TRINIDAD_BOOK_FAQ } from "@/data/trinidadBookPage";
import { JAMAICA_FAQ, JAMAICA_HERO_IMAGE, JAMAICA_HERO_ALT, JAMAICA_OG_IMAGE } from "@/data/jamaicaPage";
import { TRINIDAD_HISTORY_SENTENCE, TRINIDAD_PRESS_STORY, PRESS_STORIES } from "@/data/pressCoverage";
import { GOOGLE_RATING } from "@/data/googleRating";
import { SITE_URL, TRUSTPILOT_PROFILE_URL } from "@/lib/constants";
import { fitDescription, TITLE_MAX } from "@/lib/metaText";
import { hubEvent } from "@/data/hubEvents";
import { fullPackageDate } from "@/data/trinidadPackages";

export type SeasonMakeupPage = {
  slug: string; year: string; path: string; title: string; h1: string; description: string;
  intro: string; inclusions: string[]; venue: string; eventUrl: string; bookingUrl: string;
  bookingLabel: string; image: string; imageAlt: string; ogImage: string;
  faq: { q: string; a: string }[]; timeline: { q: string; a: string }[];
  proof: { text: string; url?: string; label?: string }[];
  event: ReturnType<typeof hubEvent>;
};

const C = buildAiBookingCatalogue();
export const TRINIDAD_SEASON_PATH = `/trinidad-carnival-makeup-${C.dates[0].date.slice(0, 4)}`;
export const TRINIDAD_BEST_OPENING = `${TRINIDAD_HISTORY_SENTENCE} Makeup, photoshoot, shuttle, breakfast and getting-dressed assistance are available in one booking. For ${C.event}, appointments run on ${C.dates.map((d) => d.display).join(" and ")}, from ${C.slot_times[0]} ${C.time_zone}.`;
export const TRINIDAD_COMPARISON = [
  { q: "Start time against your band", a: `Appointment start times run from ${C.slot_times[0]} to ${C.slot_times.at(-1)} ${C.time_zone}. No band's departure time or completion time is promised.` },
  { q: "What is included", a: C.inclusions.join(". ") + "." },
  { q: "Where it is", a: C.venue + "." },
  { q: "Payment and refunds", a: C.terms.summary.join(" ") },
  { q: "Proof from past seasons", a: `${TRINIDAD_HISTORY_SENTENCE} ${TRINIDAD_PRESS_STORY?.summary ?? ""}` },
];

const shortTime = (s: string) => { const h = Number(s.split(":")[0]); return h === 12 ? "12 noon" : `${h % 12 || 12}${h < 12 ? "am" : "pm"}`; };
const tenth = PRESS_STORIES.find((s) => /tenth staging/i.test(s.summary));

function livePages(today: Date): SeasonMakeupPage[] {
  return TERRITORY_PRICING.flatMap((t) => {
    const profile = getProfile(t.slug);
    const date = SEASON_END_DATES[t.slug];
    if (!profile || !date || !t.quotable || !t.products.length || t.runningThisSeason === false || hasSeasonPassed(t.slug, today) || !t.bookingUrl.includes("/events/")) return [];
    const year = date.slice(0, 4);
    // Never label an old product list as a new season.
    if (!t.eventDate.includes(year)) return [];
    const isTrinidad = t.slug === "trinidad";
    if (isTrinidad && !C.dates.every((d) => d.date.startsWith(year))) return [];
    const path = `/${t.slug}-carnival-makeup-${year}`;
    const products = isTrinidad ? C.products : t.products;
    const makeup = products.filter((p) => !p.tags.includes("photoshoot") && p.tags.includes("makeup") && !("premium" in p && p.premium));
    const photos = products.filter((p) => p.tags.includes("photoshoot") && p.tags.includes("makeup") && !("premium" in p && p.premium));
    const min = Math.min(...makeup.map((p) => p.price));
    const photoMin = Math.min(...photos.map((p) => p.price));
    const inclusions = isTrinidad ? C.inclusions : getFreeInclusions(t.slug);
    const hours = isTrinidad ? `${shortTime(C.slot_times[0])} to ${shortTime(C.slot_times[C.slot_times.length - 1])} ${C.time_zone}` : profile.appointmentHours ? `${profile.appointmentHours.text} ${profile.shortName} time` : "";
    const venue = isTrinidad ? C.venue : profile.venue ?? "Venue confirmed on booking";
    const dates = isTrinidad ? fullPackageDate(C.dates) : profile.dateText;
    const payment = isTrinidad ? "paid in full at booking" : t.deposit ? `US$${t.deposit.amount} secures your appointment and is applied to your total` : "payment terms confirmed on booking";
    const intro = `${dates}${hours ? `, ${hours}` : ""}, at ${venue}. Makeup from US$${min}, makeup and photoshoot from US$${photoMin}, ${payment}. ${inclusions.join("; ")} included.`;
    const head = `${profile.shortName} Carnival Makeup ${year}`;
    const shortDates = C.dates.map((d) => Number(d.date.slice(-2))).join(" and ") + " " + new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
    let title = isTrinidad ? `${head} | Hilton, ${shortDates} | Glam Hub` : `${head} | Glam Hub`;
    if (title.length > TITLE_MAX) title = isTrinidad ? `${head} | Hilton, ${shortDates}` : head;
    const image = t.slug === "jamaica" ? JAMAICA_HERO_IMAGE : "/images/destinations/trinidad-makeup-season.webp";
    const imageAlt = t.slug === "jamaica" ? JAMAICA_HERO_ALT : "Two women wearing Carnival makeup, with purple and orange eye makeup and gold earrings";
    const ogImage = t.slug === "jamaica" ? `${SITE_URL}${JAMAICA_OG_IMAGE}` : `${SITE_URL}/images/destinations/trinidad-makeup-season-og.jpg`;
    const faq = isTrinidad ? TRINIDAD_BOOK_FAQ : t.slug === "jamaica" ? JAMAICA_FAQ : [];
    return [{ slug: t.slug, year, path, title, h1: `${head}${isTrinidad ? " at the Hilton, Port of Spain" : ""}`, description: fitDescription(intro), intro, inclusions, venue, eventUrl: t.bookingUrl, bookingUrl: isTrinidad ? `${SITE_URL}/trinidad/book` : t.bookingUrl, bookingLabel: `Book ${head}`, image, imageAlt, ogImage, faq,
      timeline: isTrinidad ? [
        { q: "Arrive", a: TRINIDAD_BOOK_FAQ.find((f) => /late/.test(f.q))?.a ?? "" },
        { q: "Makeup", a: "Your booked makeup service takes place at the hub." },
        { q: "Photos", a: "A photoshoot takes place at the hub if it is part of your selected service." },
        { q: "Get dressed", a: "Getting-dressed assistance is included." },
        { q: "Shuttle to your band", a: "Shuttle is included. No departure time is promised." },
      ] : [],
      proof: isTrinidad ? [
        ...(TRINIDAD_PRESS_STORY ? [{ text: `${TRINIDAD_PRESS_STORY.outlet}, ${TRINIDAD_PRESS_STORY.publishedDate}: ${TRINIDAD_PRESS_STORY.summary}`, url: TRINIDAD_PRESS_STORY.url, label: "Read the Jamaica Observer coverage" }] : []),
        ...(tenth ? [{ text: tenth.summary, url: tenth.url, label: "Read the tenth-staging coverage" }] : []),
        { text: "Trustpilot profile", url: TRUSTPILOT_PROFILE_URL, label: "Visit Trustpilot" },
        { text: `Google rating: ${GOOGLE_RATING.rating} out of 5, ${GOOGLE_RATING.count} reviews, as of ${GOOGLE_RATING.asOf}.`, url: GOOGLE_RATING.url, label: "View Google reviews" },
      ] : [], event: hubEvent(t.slug, path, image.startsWith("/") ? SITE_URL + image : image),
    }];
  });
}

/** Previously published seasons remain readable after bookings close. */
export function getSeasonMakeupPages(today = new Date()): SeasonMakeupPage[] {
  const byPath = new Map((published as SeasonMakeupPage[]).map((p) => [p.path, p]));
  for (const p of livePages(today)) byPath.set(p.path, p);
  return [...byPath.values()];
}

export function seasonPageJsonLd(p: SeasonMakeupPage) {
  return [p.event, { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: p.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }, { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: p.h1, item: `${SITE_URL}${p.path}` }] }].filter((b) => b !== null);
}

export const SEASON_PAGE_TODOS = [
  "TODO(Kibwe): Confirm the operational order, appointment durations and shuttle departure times. The morning list describes supported stages, not guaranteed timings or order.",
  "TODO(Kibwe): Confirm an uninterrupted Hilton history since 2020. The recorded press verifies the 2020 opening, not every season.",
  "TODO(Kibwe): Confirm the Trinidad-specific season number. The recorded tenth-staging story is about Glam Hub generally, not ten Trinidad seasons.",
  "TODO(Kibwe): Miami has no confirmed 2027 date or live 2027 product list; Grenada has pre-registration only. No new makeup page is generated for either.",
  "TODO(Kibwe): Confirm Grenada appointment start times and a full event window. Its Event uses confirmed calendar dates only, not invented hours.",
  "TODO(Kibwe): The catalogue names the venue as the Hilton Hotel, Port of Spain, not the formal Hilton Trinidad and Conference Centre. Existing venue wording is retained.",
];