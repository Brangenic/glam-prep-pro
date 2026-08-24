/**
 * Station rentals: selling station space inside a Carnival Glam Hub to
 * independent service providers. A station is for makeup artists and hair
 * stylists only. No other provider type is offered, and none may be added
 * back without Kibwe confirming it.
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

import { hasSeasonPassed } from "./seasons";
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

/**
 * A station cannot be rented at a Carnival that has already happened, so
 * the rate card and the enquiry form only ever list territories whose
 * season is still ahead of us. The tier rates above are untouched and
 * come straight back the moment a new season date is set.
 */
const bookable = (slug: string) => !hasSeasonPassed(slug);

export const FULL_SERVICE_STATION_TERRITORIES: StationTerritory[] = [
  ...FULL_SERVICE_SLUGS,
]
  .filter(bookable)
  .map(build);

export const LITE_STATION_TERRITORIES: StationTerritory[] = [...LITE_SLUGS]
  .filter(bookable)
  .map(build);

export const STATION_TERRITORIES: StationTerritory[] = [
  ...FULL_SERVICE_STATION_TERRITORIES,
  ...LITE_STATION_TERRITORIES,
];

/** Territories whose season has passed. Listed as closed, never sold. */
export const CLOSED_STATION_TERRITORIES: StationTerritory[] = [
  ...FULL_SERVICE_SLUGS,
  ...LITE_SLUGS,
]
  .filter((slug) => !bookable(slug))
  .map(build);

/** Comma separated names, used in copy and FAQ answers. */
function names(list: StationTerritory[]): string {
  const n = list.map((t) => t.name);
  if (n.length <= 1) return n[0] ?? "";
  return `${n.slice(0, -1).join(", ")} and ${n[n.length - 1]}`;
}

export const BOOKABLE_FULL_NAMES = names(FULL_SERVICE_STATION_TERRITORIES);
export const BOOKABLE_LITE_NAMES = names(LITE_STATION_TERRITORIES);
export const CLOSED_STATION_NAMES = names(CLOSED_STATION_TERRITORIES);

/**
 * The station spec, exactly as confirmed by Kibwe. Identical at both
 * tiers. Never add anything that is not on these lists.
 */
export const STATION_PROVIDED = [
  "6ft truss table",
  "Table cloth",
  "Access to a plug",
  "2 regular chairs",
];

export const STATION_BRING = [
  "High chair",
  "Ring light",
  "Extension cord and multiplug. Everyone must carry their own, no exceptions.",
];

/** Optional extra, charged per day like the station itself. */
export const HIGH_CHAIR_RATE_PER_DAY = 25;
export const HIGH_CHAIR_RATE_LABEL = `High chair rental at US$${HIGH_CHAIR_RATE_PER_DAY} per day`;

/**
 * Accepted payment methods. Details are sent when the station is
 * confirmed. Never publish a handle, address or link.
 */
export const STATION_PAYMENT_METHODS = ["Zelle", "PayPal", "Secure online Stripe link"];
export const STATION_PAYMENT_NOTE =
  "We accept Zelle, PayPal or a secure online Stripe link. Payment details are sent to you when your station is confirmed.";

/**
 * What the station itself is, plus the room around it.
 */
export const STATION_BASE = [
  "Your own station with a 6ft truss table, table cloth, access to a plug and 2 regular chairs",
  "Air-conditioned beauty lounge",
  "Reception and check-in for your clients",
  "Changing room",
  "Wing and bag check while your clients are with us, space permitting",
];

/**
 * The pitch: a renter's clients are treated exactly like our own
 * masqueraders in that territory.
 */
export const CLIENT_AMENITIES_NOTE =
  "Your clients get access to all the hotel and location amenities available to Glam Hub masqueraders in that territory. They are treated exactly like our own.";


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

/**
 * Who a station is for. Makeup artists and hair stylists, nothing else.
 * Confirmed by Kibwe on 24 August 2026. Do not add braiders, barbers,
 * body-art or gem artists, lash techs or photographers back to this list.
 * They are not offered.
 */
export const STATION_SERVICE_TYPES = ["Makeup artists", "Hair stylists"];

/**
 * Vendor and merchandise spaces. A SEPARATE offer from a station. A station
 * is a working chair for a service provider. A vendor space is a space for
 * selling goods to masqueraders on Carnival morning.
 *
 * Rates confirmed by Kibwe on 24 August 2026. They are a FLAT rate at every
 * Glam Hub, Full Service and Glam Hub Lite alike. They are deliberately NOT
 * derived from `getHubTier` and must never be wired into the tier system,
 * even though that means a Glam Hub Lite station is US$200 a day while a
 * vendor space at the same hub is US$250 a day. Kibwe was shown that and
 * confirmed it.
 */
export const VENDOR_SPACE_PER_DAY = 250;
export const VENDOR_SPACE_BOTH_DAYS = 400;
export const VENDOR_SPACE_RATE_LABEL = `US$${VENDOR_SPACE_PER_DAY} per day, US$${VENDOR_SPACE_BOTH_DAYS} for both days. The same flat rate at every Glam Hub, Full Service and Glam Hub Lite alike.`;

export const VENDOR_SPACE_INTRO =
  "A space inside the Glam Hub to sell products to masqueraders on Carnival morning. Typical sellers are Monday wear, costume accessories and merchandise. This is not a station. A station is a working chair for a service provider.";

/** Exactly what a vendor space includes. Never add to this list. */
export const VENDOR_SPACE_INCLUDES = [
  "The space inside the Glam Hub",
  "Access to card processing at the hub, so you can take card payments without bringing your own terminal",
];

export const VENDOR_SPACE_NOTE =
  "Anything beyond the space and access to card processing is confirmed on enquiry.";

/** What a person is enquiring about. Captured with every enquiry. */
export const ENQUIRY_TYPES = [
  "Station rental",
  "Vendor and merchandise space",
] as const;
export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

/**
 * Page FAQ. Shared by the React page, the prerendered head (FAQPage
 * JSON-LD) and the prerendered static body, so the three can never drift.
 * Rates here come from RATES above and must match it.
 */
export const STATION_FAQS: { q: string; a: string }[] = [
  {
    q: "How much does a Carnival station rental cost?",
    a: `A station in a Glam Hub Lite territory is US$${RATES.lite.perDay} per station per day. A station in a Full Service territory, meaning Trinidad, Jamaica and Miami, is US$${RATES.full.perDay} per station per day or US$${RATES.full.bothDays} for both days. Rates are per station, per provider.`,
  },
  {
    q: "Which territories can I rent a station in?",
    a: `Every Carnival Glam Hub territory with a season still to come, Full Service and Lite. Right now that is ${BOOKABLE_FULL_NAMES} as Full Service hubs${BOOKABLE_LITE_NAMES ? `, and ${BOOKABLE_LITE_NAMES} as Glam Hub Lite` : ""}.${CLOSED_STATION_NAMES ? ` ${CLOSED_STATION_NAMES} have finished for this season and return with next season's dates.` : ""}`,
  },
  {
    q: "What is provided with a station?",
    a: "Every station comes with a 6ft truss table, a table cloth, access to a plug and 2 regular chairs, inside the air-conditioned beauty lounge, with reception and check-in for your clients, a changing room, wing and bag check while your clients are with us space permitting, and the refreshments that territory runs. Full Service hubs add breakfast and refreshments, alcohol, a seamstress on site, getting-dressed assistance available to your clients, and a shuttle in Jamaica and Trinidad.",
  },
  {
    q: "What do I need to bring myself?",
    a: "Your full kit, your products, your tools, a high chair, a ring light, and an extension cord and multiplug. Everyone must carry their own extension cord and multiplug, no exceptions. We do not supply product, equipment or consumables.",
  },
  {
    q: "Can I rent a high chair?",
    a: `Yes. A high chair is available to rent at US$${HIGH_CHAIR_RATE_PER_DAY} per day, charged per day like the station itself. Ask for it when you enquire so we can set it aside.`,
  },
  {
    q: "How do I pay for my station?",
    a: STATION_PAYMENT_NOTE,
  },
  {
    q: "Do my clients get the hub's amenities?",
    a: `${CLIENT_AMENITIES_NOTE} The station spec is identical at both tiers. What changes between a Full Service hub and a Glam Hub Lite is the hub around the station.`,
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
    q: "Can I sell Monday wear at the Glam Hub?",
    a: `Yes, through a vendor and merchandise space rather than a station. A vendor space is a space inside the Glam Hub to sell products to masqueraders on Carnival morning, typically Monday wear, costume accessories and merchandise. It is US$${VENDOR_SPACE_PER_DAY} per day or US$${VENDOR_SPACE_BOTH_DAYS} for both days, the same flat rate at every Glam Hub. You get the space and access to card processing at the hub. Anything else is confirmed on enquiry.`,
  },
  {
    q: "What is the difference between a station and a vendor space?",
    a: "A station is a working chair for a makeup artist or hair stylist to service clients from. A vendor and merchandise space is a space for selling goods to masqueraders. They are separate offers, at separate rates, and a vendor space is not a station.",
  },
  {
    q: "Do you take a cut of what I charge my clients?",
    a: "No. You pay the station rate and keep what you charge. We provide the location, the lounge, reception and the hub's amenities.",
  },
];
