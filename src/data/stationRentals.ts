/**
 * Station rentals: selling station space inside a Carnival Glam Hub to
 * independent service providers (makeup artists, hair stylists, barbers,
 * braiders, body-art and gem artists, lash techs, photographers).
 *
 * Single source of truth for station rental rates. Rates are derived from
 * the hub tier in `hubTiers.ts`, so a territory moving tier automatically
 * moves rate. No component may hardcode a rate.
 *
 * Rates confirmed by Kibwe. Do not extrapolate:
 *   Glam Hub Lite:     US$200 per station per day.
 *                      No confirmed both-days rate. Multi-day is confirmed
 *                      on enquiry.
 *   Full Service:      US$250 per station per day, US$400 for both days.
 */

import {
  FULL_SERVICE_SLUGS,
  LITE_SLUGS,
  TIER_LABEL,
  getCapabilities,
  getHubInclusions,
  getHubTier,
  type HubTier,
} from "./hubTiers";

export type StationRate = {
  /** Per station, per day, in USD. */
  perDay: number;
  /** Both days, in USD. Null where no both-days rate is confirmed. */
  bothDays: number | null;
  currency: "USD";
};

const RATES: Record<HubTier, StationRate> = {
  full: { perDay: 250, bothDays: 400, currency: "USD" },
  lite: { perDay: 200, bothDays: null, currency: "USD" },
};

/** Rate card range, used for AggregateOffer and headline copy. */
export const STATION_RATE_LOW = 200;
export const STATION_RATE_HIGH = 400;

export function getStationRate(slug: string): StationRate | null {
  const tier = getHubTier(slug);
  if (!tier) return null;
  return RATES[tier];
}

export function getTierRate(tier: HubTier): StationRate {
  return RATES[tier];
}

/** Human-readable rate line for a territory. Never hardcode this in a view. */
export function formatStationRate(slug: string): string {
  const rate = getStationRate(slug);
  if (!rate) return "Rate confirmed on enquiry";
  if (rate.bothDays === null) {
    return `US$${rate.perDay} per station per day. Multi-day rates confirmed on enquiry.`;
  }
  return `US$${rate.perDay} per station per day, US$${rate.bothDays} for both days.`;
}

export type StationTerritory = {
  slug: string;
  name: string;
  tier: HubTier;
  tierLabel: string;
  rate: StationRate;
  /** Territory landing page, where one exists. */
  path?: string;
};

const TERRITORY_NAMES: Record<string, string> = {
  trinidad: "Trinidad",
  jamaica: "Jamaica",
  miami: "Miami",
  "saint-lucia": "Saint Lucia",
  grenada: "Grenada",
  antigua: "Antigua",
  barbados: "Barbados",
  toronto: "Toronto",
  guyana: "Guyana",
  tobago: "Tobago",
  atlanta: "Atlanta",
};

/** Territories with their own landing page. Atlanta books through the hub. */
const TERRITORY_PATHS: Record<string, string> = {
  trinidad: "/trinidad",
  jamaica: "/jamaica",
  miami: "/miami",
  "saint-lucia": "/saint-lucia",
  grenada: "/grenada",
  antigua: "/antigua",
  barbados: "/barbados",
  toronto: "/toronto",
  guyana: "/guyana",
  tobago: "/tobago",
};

function build(slug: string): StationTerritory {
  const tier = getHubTier(slug) as HubTier;
  return {
    slug,
    name: TERRITORY_NAMES[slug] ?? slug,
    tier,
    tierLabel: TIER_LABEL[tier],
    rate: RATES[tier],
    path: TERRITORY_PATHS[slug],
  };
}

export const FULL_SERVICE_STATION_TERRITORIES: StationTerritory[] = [
  ...FULL_SERVICE_SLUGS,
].map(build);

export const LITE_STATION_TERRITORIES: StationTerritory[] = [...LITE_SLUGS].map(build);

export const STATION_TERRITORIES: StationTerritory[] = [
  ...FULL_SERVICE_STATION_TERRITORIES,
  ...LITE_STATION_TERRITORIES,
];

/**
 * What the station itself is. Confirmed kit only: a table and a chair.
 * Never add mirrors, ring lights, power outlets, product, assistants or
 * Wi-Fi to this list.
 */
export const STATION_BASE = [
  "Your own station with a table and chair",
  "Air-conditioned beauty lounge",
  "Reception and check-in for your clients",
  "Changing room",
  "Wing and bag check while your clients are with us, space permitting",
];

/**
 * Everything the hub already is, per territory, derived from the tier
 * model so the page can never drift from `hubTiers.ts`.
 */
export function getStationInclusions(slug: string): string[] {
  const hub = getHubInclusions(slug) ?? [];
  const caps = getCapabilities(slug);
  const list = [...STATION_BASE];

  // Refreshments and hospitality carried by the hub tier.
  for (const line of hub) {
    if (
      line === "Coffee and tea" ||
      line === "Coffee, tea and light refreshments" ||
      line === "Breakfast and refreshments" ||
      line === "Alcohol" ||
      line === "Seamstress" ||
      line === "Shuttle"
    ) {
      list.push(line === "Seamstress" ? "Seamstress on site" : line);
    }
  }

  if (hub.includes("Getting-dressed assistance")) {
    list.push("Getting-dressed assistance available to your clients");
  }
  if (caps.overnightBagCheck) {
    list.push("Overnight bag check available to your clients as a paid add-on");
  }
  if (caps.bronzing || caps.barber || caps.reels) {
    const runs = [
      caps.bronzing ? "bronzing" : null,
      caps.barber ? "a barber" : null,
      caps.reels ? "reels" : null,
    ].filter(Boolean) as string[];
    list.push(`This hub also runs ${listSentence(runs)}`);
  }
  return list;
}

function listSentence(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** Territory-specific logistics notes that must not be generalised. */
export const STATION_TERRITORY_NOTES: Record<string, string> = {
  miami:
    "There is no shuttle in Miami this season. The venue has ready Uber access, and overnight bag check is available as a paid add-on.",
};

export const STATION_SERVICE_TYPES = [
  "Makeup artists",
  "Hair stylists",
  "Braiders",
  "Barbers",
  "Body-art and gem artists",
  "Lash techs",
  "Photographers",
];

/**
 * Page FAQ. Shared by the React page, the prerendered head (FAQPage
 * JSON-LD) and the prerendered static body, so the three can never drift.
 * Rates here come from RATES above and must match it.
 */
export const STATION_FAQS: { q: string; a: string }[] = [
  {
    q: "How much does a Carnival station rental cost?",
    a: "A station in a Glam Hub Lite territory is US$200 per station per day. A station in a Full Service territory, meaning Trinidad, Jamaica and Miami, is US$250 per station per day or US$400 for both days. Rates are per station, per provider.",
  },
  {
    q: "Which territories can I rent a station in?",
    a: "Every Carnival Glam Hub territory, Full Service and Lite. That is Trinidad, Jamaica and Miami as Full Service hubs, and Saint Lucia, Grenada, Antigua, Barbados, Toronto, Guyana, Tobago and Atlanta as Glam Hub Lite.",
  },
  {
    q: "What is provided with a station?",
    a: "Your own station with a table and chair inside the air-conditioned beauty lounge, reception and check-in for your clients, a changing room, wing and bag check while your clients are with us space permitting, and the refreshments that territory runs. Full Service hubs add breakfast and refreshments, alcohol, a seamstress on site, getting-dressed assistance available to your clients, and a shuttle in Jamaica and Trinidad.",
  },
  {
    q: "Do I bring my own products and tools?",
    a: "Yes. You bring your full kit, your products, your tools and anything else your service needs. The station is a table and a chair in our lounge. We do not supply product, equipment or consumables.",
  },
  {
    q: "Can I bring an assistant?",
    a: "Tell us at enquiry. Space on Carnival morning is finite and every station is allocated, so an assistant has to be agreed in advance rather than assumed on the day.",
  },
  {
    q: "How do my clients find me at the hub?",
    a: "Our reception checks your clients in and directs them to your station, so you are not managing the door while you are in the chair. You bring your own bookings and keep your own client relationships.",
  },
  {
    q: "When do I need to book a station?",
    a: "As early as you can. Station numbers are capped by the floor space of each venue and Carnival morning sells out well ahead of the season, so popular territories close first.",
  },
  {
    q: "What happens if I need two days?",
    a: "In Trinidad, Jamaica and Miami the both-days rate is US$400 per station. In Glam Hub Lite territories there is no fixed both-days rate, so multi-day is confirmed on enquiry.",
  },
  {
    q: "Do you take a cut of what I charge my clients?",
    a: "No. You pay the station rate and keep what you charge. We provide the location, the lounge, reception and the hub's amenities.",
  },
];
