/**
 * /jamaica, Jamaica Carnival 2027. One module feeds the React page, the
 * prerendered head and body, the JSON-LD and the tests, so every surface
 * says the same thing.
 *
 * Every fact is read from the data layer: the date and venue from
 * territoryProfiles.ts, the season from seasons.ts, prices and the MasOS
 * event from territoryPricing.ts, inclusions and add-ons from hubTiers.ts,
 * and the arrival, deposit and transfer rules from policies.ts. Nothing is
 * typed out here that already exists there. Anything not in the data layer
 * (street address, appointment start times, a confirmed Jamaica photo) is
 * left out.
 *
 * Asset free, so the prerender scripts can import it.
 */
import type { AnswerSection } from "@/data/answerPages";
import { getProfile } from "@/data/territoryProfiles";
import {
  BARBER_PRICE,
  OVERNIGHT_BAG_CHECK_PRICE,
  getTerritoryPricing,
  type QuoteProduct,
} from "@/data/territoryPricing";
import {
  DAY_BAG_CHECK,
  getCapabilities,
  getHubInclusions,
  getHubTier,
  listNames,
  reelsNote,
  TIER_LABEL,
} from "@/data/hubTiers";
import { SEASON_END_DATES, hasSeasonPassed } from "@/data/seasons";
import { TERMS_BLOCKS } from "@/data/policies";
import { SITE_URL } from "@/lib/constants";
import { buildDestinationUrl, getDestination } from "@/lib/destinations";

export const JAMAICA_SLUG = "jamaica";
export const JAMAICA_PATH = "/jamaica";
export const JAMAICA_URL = `${SITE_URL}${JAMAICA_PATH}`;

const profile = getProfile(JAMAICA_SLUG)!;
const pricing = getTerritoryPricing(JAMAICA_SLUG)!;

/** "Sunday 4 April 2027" */
export const JAMAICA_DATE_TEXT = profile.dateText;
/** ISO day of the Carnival, from the season calendar. */
export const JAMAICA_DATE_ISO = SEASON_END_DATES[JAMAICA_SLUG];
export const JAMAICA_YEAR = JAMAICA_DATE_ISO.slice(0, 4);
/** "Jamaica Pegasus Hotel, Kingston" */
export const JAMAICA_VENUE = profile.venue as string;
export const JAMAICA_VENUE_NAME = JAMAICA_VENUE.split(",")[0].trim();
export const JAMAICA_CITY = JAMAICA_VENUE.split(",").slice(1).join(",").trim();
export const JAMAICA_EVENT_NAME = `${profile.name} ${JAMAICA_YEAR}`;

/** The Jamaica MasOS event, never the bare events list. */
export const JAMAICA_EVENT_URL = (getDestination(JAMAICA_SLUG)?.masosUrl ?? pricing.bookingUrl) as string;
export function jamaicaBookingHref(campaign = "jamaica_page"): string {
  return buildDestinationUrl(JAMAICA_SLUG, campaign);
}

const tier = getHubTier(JAMAICA_SLUG)!;
export const JAMAICA_TIER_LABEL = TIER_LABEL[tier];

const money = (n: number) => `US$${n}`;
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export const JAMAICA_PRODUCTS: QuoteProduct[] = pricing.products;
export const JAMAICA_STANDARD_PRODUCTS = JAMAICA_PRODUCTS.filter((p) => !p.premium);
export const JAMAICA_GABBY_PRODUCTS = JAMAICA_PRODUCTS.filter((p) => p.premium);
const byId = (id: string) => JAMAICA_PRODUCTS.find((p) => p.id === id);
const priceOf = (id: string) => byId(id)?.price;
const makeupOnly = priceOf("jam-makeup")!;
const makeupPhoto = priceOf("jam-makeup-photo")!;
const fullGlam = priceOf("jam-full-glam")!;
const hairOnly = priceOf("jam-hair")!;
export const JAMAICA_MIN_PRICE = Math.min(...JAMAICA_PRODUCTS.map((p) => p.price));
export const JAMAICA_MAX_PRICE = Math.max(...JAMAICA_PRODUCTS.map((p) => p.price));
export const JAMAICA_DEPOSIT = pricing.deposit?.amount;

/* ---------- Head ---------- */

export const JAMAICA_META_TITLE = `${JAMAICA_EVENT_NAME} Makeup Artist, ${JAMAICA_CITY} | Glam Hub`;
export const JAMAICA_META_DESCRIPTION =
  `${JAMAICA_EVENT_NAME} makeup on ${JAMAICA_DATE_TEXT} at the ${JAMAICA_VENUE}. Makeup from ${money(makeupOnly)}, plus hair, photoshoot and shuttle.`;
export const JAMAICA_H1 = `${JAMAICA_EVENT_NAME} Makeup, ${JAMAICA_CITY}`;
/**
 * Describes the photograph only. The current hero is not confirmed as a
 * Jamaica Carnival photograph, so the alt text does not claim a place,
 * and it never names the masquerader.
 */
export const JAMAICA_HERO_ALT =
  "Masquerader in a pink and blue feathered Carnival costume with jewelled bodywear and white boots, arms outstretched";

/* ---------- Policy clauses, quoted, never retyped ---------- */

export function clause(n: string): string {
  for (const b of TERMS_BLOCKS) {
    const c = b.clauses?.find((x) => x.n === n);
    if (c) return c.body;
  }
  throw new Error(`Missing policy clause ${n}`);
}

/* ---------- Inclusions ---------- */

const inclusions = getHubInclusions(JAMAICA_SLUG) ?? [];
/** Services you choose and pay for. Everything else at the hub comes with your appointment. */
const SERVICE_ITEMS = new Set(["Makeup", "Hair", "Photoshoot", "Bronzing"]);
export const JAMAICA_SERVICES = inclusions.filter((i) => SERVICE_ITEMS.has(i));
export const JAMAICA_AMENITIES = inclusions.filter((i) => !SERVICE_ITEMS.has(i));
const caps = getCapabilities(JAMAICA_SLUG);
/** Paid extras on top of a service. Bronzing is a service on the price list, so it is not repeated here. */
export const JAMAICA_ADD_ONS: string[] = [
  ...(caps.reels ? [`Reels, ${reelsNote(JAMAICA_SLUG)}`] : []),
  ...(caps.barber ? [`Barber, ${money(BARBER_PRICE)} per masquerader.`] : []),
  ...(caps.overnightBagCheck ? [`Overnight bag check, ${money(OVERNIGHT_BAG_CHECK_PRICE)} per masquerader.`] : []),
];

export const JAMAICA_PRICE_LINES = JAMAICA_STANDARD_PRODUCTS.map((p) => `${p.label}: ${money(p.price)}`);
export const JAMAICA_GABBY_LINES = JAMAICA_GABBY_PRODUCTS.map((p) => `${p.label}: ${money(p.price)}`);

/* ---------- Answer-first sections ---------- */

const amenitiesText = listNames(JAMAICA_AMENITIES.map(lower));
const shuttleOffered = JAMAICA_AMENITIES.includes("Shuttle");

export const JAMAICA_SECTIONS: AnswerSection[] = [
  {
    q: `When and where is ${JAMAICA_EVENT_NAME}?`,
    a: `${JAMAICA_EVENT_NAME} is on ${JAMAICA_DATE_TEXT}, and the Carnival Glam Hub runs from the ${JAMAICA_VENUE}. It is a ${JAMAICA_TIER_LABEL}: ${listNames([...JAMAICA_SERVICES.map(lower), "getting dressed", ...(shuttleOffered ? ["the shuttle"] : [])])} all run from the same hub.`,
  },
  {
    q: "What is included at the Jamaica Glam Hub?",
    a: `Every Jamaica Glam Hub appointment comes with ${amenitiesText}. You choose your services, ${listNames(JAMAICA_SERVICES.map(lower))}, from the price list, and these add-ons are available at this hub:`,
    bullets: JAMAICA_ADD_ONS,
  },
  {
    q: `How much is ${JAMAICA_EVENT_NAME} makeup?`,
    a: `Makeup only is ${money(makeupOnly)} per masquerader for ${JAMAICA_EVENT_NAME}, and makeup and photoshoot is ${money(makeupPhoto)}. ${pricing.deposit?.note ?? ""} ${clause("1.3")}`.replace(/\s+/g, " ").trim(),
    bullets: JAMAICA_PRICE_LINES,
  },
  {
    q: "Is there a Gabby Glam Team option?",
    a: `Yes. ${listNames(JAMAICA_GABBY_LINES.map((l) => l.replace(": ", " is ")))}. The Gabby Glam Team is a premium named-artist option, priced separately from the standard artists.`,
    bullets: JAMAICA_GABBY_LINES,
  },
  {
    q: "How does the Jamaica Carnival morning work?",
    a: `You book a time on the booking platform, register at the ${JAMAICA_VENUE_NAME} before your appointment, and everything you booked happens at the hub before you leave for the road. ${clause("6.1")}`,
    bullets: [
      `Book your time on the booking platform. ${pricing.deposit?.note ?? ""} ${clause("1.4")}`.replace(/\s+/g, " ").trim(),
      `${clause("6.1")} ${clause("6.2")}`,
      "Makeup, and hair if you booked it, with breakfast and refreshments, coffee and tea.",
      "Getting-dressed assistance, a seamstress and a changing room.",
      "Your photoshoot, if you booked one.",
      `${DAY_BAG_CHECK}.`,
      ...(shuttleOffered ? ["The shuttle."] : []),
    ],
  },
];

/* ---------- FAQ ---------- */

export type JamaicaFaq = { q: string; a: string };

export const JAMAICA_FAQ: JamaicaFaq[] = [
  {
    q: `When is ${JAMAICA_EVENT_NAME}?`,
    a: `${JAMAICA_EVENT_NAME} is on ${JAMAICA_DATE_TEXT}. Carnival Glam Hub appointments for ${JAMAICA_EVENT_NAME} are on that day at the ${JAMAICA_VENUE}.`,
  },
  {
    q: "Where is the Carnival Glam Hub in Jamaica?",
    a: `The Carnival Glam Hub for ${JAMAICA_EVENT_NAME} is at the ${JAMAICA_VENUE}. It is a ${JAMAICA_TIER_LABEL}.`,
  },
  {
    q: "How much is carnival makeup in Jamaica?",
    a: `Makeup only is ${money(makeupOnly)} per masquerader for ${JAMAICA_EVENT_NAME}. Makeup and photoshoot is ${money(makeupPhoto)}, Full Glam, which is makeup, hair and photoshoot, is ${money(fullGlam)}, and prices run from ${money(JAMAICA_MIN_PRICE)} to ${money(JAMAICA_MAX_PRICE)}. ${pricing.deposit?.note ?? ""}`.trim(),
  },
  {
    q: "What is included at the Jamaica Glam Hub?",
    a: `Every appointment comes with ${amenitiesText}. ${listNames(JAMAICA_SERVICES)} are the services you choose and pay for.`,
  },
  {
    q: "Is there a shuttle to the band?",
    a: shuttleOffered
      ? `Yes. The shuttle runs in Jamaica and comes with every ${JAMAICA_TIER_LABEL} appointment at the ${JAMAICA_VENUE_NAME}.`
      : "The shuttle is not running in Jamaica this season.",
  },
  {
    q: "Can I book hair for Jamaica Carnival?",
    a: `Yes. Hair only is ${money(hairOnly)}, and Full Glam, makeup, hair and photoshoot together, is ${money(fullGlam)}.`,
  },
  {
    q: "What time should I arrive?",
    a: `${clause("6.1")} ${clause("6.2")} ${clause("6.3")}`,
  },
  {
    q: "Can I transfer my booking?",
    a: `Yes. ${clause("4.1")} ${clause("4.2")} ${clause("4.3")} ${clause("4.4")}`,
  },
];

/* ---------- Structured data ---------- */

export function jamaicaJsonLd(opts: { image?: string } = {}) {
  const ORG_ID = `${SITE_URL}/#organization`;
  const place = {
    "@type": "Place",
    name: JAMAICA_VENUE_NAME,
    address: {
      "@type": "PostalAddress",
      addressLocality: JAMAICA_CITY,
      addressCountry: "JM",
    },
  };
  const event = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${JAMAICA_EVENT_NAME} Glam Hub`,
    startDate: JAMAICA_DATE_ISO,
    endDate: JAMAICA_DATE_ISO,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    url: JAMAICA_URL,
    description: JAMAICA_META_DESCRIPTION,
    ...(opts.image ? { image: [opts.image] } : {}),
    location: place,
    organizer: { "@type": "Organization", name: "Carnival Glam Hub", url: SITE_URL },
    offers: JAMAICA_PRODUCTS.map((p) => ({
      "@type": "Offer",
      name: p.label,
      price: String(p.price),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: JAMAICA_EVENT_URL,
    })),
  };
  const business = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "@id": `${JAMAICA_URL}#hub`,
    name: `Carnival Glam Hub, ${profile.name}`,
    url: JAMAICA_URL,
    parentOrganization: { "@id": ORG_ID },
    ...(opts.image ? { image: opts.image } : {}),
    address: place.address,
    location: place,
    priceRange: `US$${JAMAICA_MIN_PRICE}-US$${JAMAICA_MAX_PRICE}`,
    areaServed: { "@type": "City", name: JAMAICA_CITY, containedInPlace: { "@type": "Country", name: "Jamaica" } },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Destinations", item: `${SITE_URL}/#destinations` },
      { "@type": "ListItem", position: 3, name: JAMAICA_EVENT_NAME, item: JAMAICA_URL },
    ],
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: JAMAICA_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return { event, business, breadcrumb, faq };
}

/** True while the Jamaica 2027 season is still ahead. */
export function jamaicaSeasonOpen(today: Date = new Date()): boolean {
  return !hasSeasonPassed(JAMAICA_SLUG, today);
}

/* ---------- public/llms.txt ---------- */

/**
 * The Jamaica section of public/llms.txt, in plain sentences. The file is
 * static, so a test asserts it contains this text exactly.
 */
export const JAMAICA_LLMS_SECTION = [
  `## ${JAMAICA_EVENT_NAME}`,
  `${JAMAICA_EVENT_NAME} is on ${JAMAICA_DATE_TEXT}.`,
  `The Carnival Glam Hub for ${JAMAICA_EVENT_NAME} is at the ${JAMAICA_VENUE}. It is a ${JAMAICA_TIER_LABEL}.`,
  `Every appointment comes with ${amenitiesText}.`,
  `Prices run from ${money(JAMAICA_MIN_PRICE)} to ${money(JAMAICA_MAX_PRICE)} per masquerader: ${JAMAICA_PRODUCTS.map((p) => `${p.label} ${money(p.price)}`).join(", ")}.`,
  ...(JAMAICA_ADD_ONS.length ? [`Add-ons: ${JAMAICA_ADD_ONS.map((a) => lower(a).replace(/\.$/, "")).join("; ")}.`] : []),
  ...(pricing.deposit ? [`A ${money(pricing.deposit.amount)} deposit secures your appointment and is applied to your total.`] : []),
  `Book ${JAMAICA_EVENT_NAME}: ${JAMAICA_EVENT_URL}`,
  `Details: ${JAMAICA_URL}`,
].join("\n");
