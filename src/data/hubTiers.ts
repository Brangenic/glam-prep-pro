/**
 * Two tier Glam Hub model.
 *
 * Full Service Glam Hub: Jamaica, Trinidad, Miami.
 * Glam Hub Lite: every other territory we serve.
 *
 * Epic Cruise is a cruise partnership rather than a hub, so it is
 * deliberately absent from both tiers and never carries a tier badge.
 */

export type HubTier = "full" | "lite";

export const FULL_SERVICE_SLUGS = ["jamaica", "trinidad", "miami"] as const;

export const LITE_SLUGS = [
  "saint-lucia",
  "grenada",
  "antigua",
  "barbados",
  "toronto",
  "guyana",
  "tobago",
  "atlanta",
] as const;

/** Slugs that are neither tier (partnerships, not hubs). */
export const UNTIERED_SLUGS = ["epic-cruise"] as const;

export const TIER_LABEL: Record<HubTier, string> = {
  full: "Full Service Glam Hub",
  lite: "Glam Hub Lite",
};

/** Refreshment line for Full Service hubs. */
export const ALWAYS_INCLUDED = "Coffee and tea";

/** Refreshment line for Glam Hub Lite. */
export const LITE_REFRESHMENTS = "Coffee, tea and light refreshments";

/**
 * The only bag line that may ever appear as an inclusion. Free at every
 * hub, Full Service and Lite alike, space permitting rather than
 * guaranteed. Jamaica and Trinidad run a chit system for it.
 */
export const DAY_BAG_CHECK = "Wing and bag check while you are with us, space permitting";

/**
 * Overnight bag check is a paid add-on, never an inclusion. Trinidad,
 * Jamaica and Miami only. The price lives in `territoryPricing.ts`.
 */
export const OVERNIGHT_BAG_CHECK_LABEL = "Overnight bag check";

/** Reels are a paid add-on with no confirmed masos price. Never quote a number. */
export const REELS_LABEL = "Reels";
export const REELS_NOTE = "Reels are available in Trinidad and Jamaica, with the price confirmed on booking.";

export const FULL_SERVICE_INCLUSIONS = [
  "Shuttle",
  DAY_BAG_CHECK,
  "Breakfast and refreshments",
  "Alcohol",
  "Makeup",
  "Hair",
  "Seamstress",
  "Getting-dressed assistance",
  "Changing room",
  "Photoshoot",
  ALWAYS_INCLUDED,
];

export const LITE_INCLUSIONS = [
  "Makeup",
  "Photoshoot",
  "Changing room",
  DAY_BAG_CHECK,
  LITE_REFRESHMENTS,
];

/**
 * Services a Glam Hub Lite explicitly does not offer. Nothing here may
 * appear as an inclusion, add-on, package, calculator line item or
 * structured-data offer on a Lite territory.
 */
export const LITE_NOT_OFFERED = [
  "Getting dressed",
  "Seamstress",
  "Overnight bag check",
  "Shuttle",
  "Hair",
  "Bronzing",
  "Reels",
  "Alcohol",
  "Breakfast",
];

/* ============================================================
 * Territory-scoped capabilities.
 * Four capabilities sit outside the tier model. Three of them are
 * Trinidad and Jamaica only; overnight bag check adds Miami.
 * `trinidad-carnival-2027` shares the Trinidad hub, so it carries
 * exactly the same capabilities as `trinidad`.
 * ============================================================ */

export type HubCapabilities = {
  /** Optional paid barber service. */
  barber: boolean;
  /** Bronzing artistry. Trinidad and Jamaica only. */
  bronzing: boolean;
  /** Paid reels add-on, price confirmed on booking. */
  reels: boolean;
  /** Paid overnight bag check add-on. */
  overnightBagCheck: boolean;
};

const NO_CAPABILITIES: HubCapabilities = {
  barber: false,
  bronzing: false,
  reels: false,
  overnightBagCheck: false,
};

const TRINIDAD_CAPABILITIES: HubCapabilities = {
  barber: true,
  bronzing: true,
  reels: true,
  overnightBagCheck: true,
};

export const HUB_CAPABILITIES: Record<string, HubCapabilities> = {
  trinidad: TRINIDAD_CAPABILITIES,
  "trinidad-carnival-2027": TRINIDAD_CAPABILITIES,
  jamaica: { barber: true, bronzing: true, reels: true, overnightBagCheck: true },
  miami: { barber: false, bronzing: false, reels: false, overnightBagCheck: true },
};

export function getCapabilities(slug: string): HubCapabilities {
  return HUB_CAPABILITIES[slug] ?? NO_CAPABILITIES;
}

/** Kept as a thin wrapper so existing callers keep working. */
export function hasBarber(slug: string): boolean {
  return getCapabilities(slug).barber;
}

export function hasBronzing(slug: string): boolean {
  return getCapabilities(slug).bronzing;
}

export function hasReels(slug: string): boolean {
  return getCapabilities(slug).reels;
}

export function hasOvernightBagCheck(slug: string): boolean {
  return getCapabilities(slug).overnightBagCheck;
}

/** Territories that also offer a barber. Derived, kept for compatibility. */
export const BARBER_SLUGS = Object.keys(HUB_CAPABILITIES).filter(
  (s) => HUB_CAPABILITIES[s].barber,
);

export const BARBER_LABEL = "+ Barber";

/**
 * Miami is Full Service, but there is no shuttle in Miami this season.
 * Uber access covers the Carnival morning logistics, and overnight bag
 * check is available as a paid add-on rather than an inclusion.
 */
export const MIAMI_SHUTTLE_NOTE =
  "There is no shuttle in Miami this season. The venue has ready Uber access, and overnight bag check is available as a paid add-on at US$35 per masquerader, so you can leave your bags with us and collect them the next day or that night at your hotel.";

/* ============================================================
 * Miami 2026 logistics. Single source of truth for the venue move
 * to Broward County and the no-shuttle warning. Every surface, page,
 * FAQ and prerender script reads these constants rather than
 * repeating the text.
 * ============================================================ */

/** Venue name as announced by Miami Carnival. */
export const MIAMI_VENUE_NAME =
  "Central Broward Park and Broward County Stadium";

/** Street address of the announced Parade of Bands venue. */
export const MIAMI_VENUE_ADDRESS =
  "3700 NW 11th Place, Lauderhill, Florida 33311";

/** The city is Lauderhill. Never Fort Lauderdale. */
export const MIAMI_VENUE_CITY = "Lauderhill";

/**
 * The cricket ground inside the park is often marketed as the
 * "Fort Lauderdale cricket stadium". Mentioned once as a search aid
 * only, because Lauderhill is the city.
 */
export const MIAMI_VENUE_ALIAS = "Fort Lauderdale cricket stadium";

/** Verified orientation distances. No other figures may be added. */
export const MIAMI_VENUE_DISTANCES =
  "Lauderhill is about 6 miles from Fort Lauderdale, roughly a 12 minute drive, and about 26 miles from Miami, so Fort Lauderdale is the closer airport and the closer place to stay.";

/**
 * Miami Carnival says a new Parade and Concert venue is in the
 * planning stages, so the venue is always worded as the currently
 * announced location rather than a fixed promise.
 */
export const MIAMI_VENUE_NOTE =
  "Miami Carnival has moved to Broward County. As announced by Miami Carnival, the Parade of Bands is at Central Broward Park and Broward County Stadium, 3700 NW 11th Place, Lauderhill, Florida 33311, sometimes listed as the Fort Lauderdale cricket stadium. Our Glam Hub will be near the stadium.";

/** The planning warning, worded for a masquerader booking travel. */
export const MIAMI_TRAVEL_WARNING =
  "There is no shuttle this season, so plan your ride. The venue has ready Uber access. Overnight bag check is available at US$35 per masquerader.";

/** One-paragraph version for crawler-visible copy and FAQs. */
export const MIAMI_LOGISTICS_SUMMARY = `${MIAMI_VENUE_NOTE} ${MIAMI_TRAVEL_WARNING} ${MIAMI_VENUE_DISTANCES}`;

/** Q and A used on /miami and in the Miami FAQPage structured data. */
export const MIAMI_VENUE_FAQ = {
  question: "Where is Miami Carnival 2026 being held?",
  answer: `Miami Carnival has moved to Broward County. As announced by Miami Carnival, the Parade of Bands is at Central Broward Park and Broward County Stadium, 3700 NW 11th Place, Lauderhill, Florida 33311, sometimes listed as the Fort Lauderdale cricket stadium. The city is Lauderhill, not Fort Lauderdale. ${MIAMI_VENUE_DISTANCES} Our Glam Hub will be near the stadium, and there is no shuttle this season, so plan your ride. The venue has ready Uber access.`,
};

export function getHubTier(slug: string): HubTier | null {
  if ((FULL_SERVICE_SLUGS as readonly string[]).includes(slug)) return "full";
  if ((LITE_SLUGS as readonly string[]).includes(slug)) return "lite";
  // Dated Trinidad edition shares the Trinidad hub.
  if (slug === "trinidad-carnival-2027") return "full";
  return null;
}

/**
 * Services that are always paid products. They may appear in a hub's
 * capability list, but they must never be shown as included with a
 * booking, because each one is charged separately.
 */
export const CHARGEABLE_SERVICES = ["Makeup", "Hair", "Bronzing", "Photoshoot"];

/** What is genuinely free with any booking at this hub. */
export function getFreeInclusions(slug: string): string[] {
  const all = getHubInclusions(slug);
  if (!all) return [];
  return all.filter((i) => !CHARGEABLE_SERVICES.includes(i));
}

export function getHubInclusions(slug: string): string[] | null {
  const tier = getHubTier(slug);
  if (!tier) return null;
  if (tier === "lite") return [...LITE_INCLUSIONS];
  let list = [...FULL_SERVICE_INCLUSIONS];
  if (slug === "miami") {
    list = list.filter((i) => i !== "Shuttle");
  }
  if (getCapabilities(slug).bronzing) {
    // Bronzing sits with the artistry services, straight after hair.
    const at = list.indexOf("Hair");
    list.splice(at + 1, 0, "Bronzing");
  }
  return list;
}

/**
 * Lite territories with no dedicated page. They appear in the
 * destinations list, the home page section and the footer, and link
 * straight to the booking flow. Tobago now has its own page at
 * /tobago, so it is no longer listed here.
 */
export const EXTRA_LITE_TERRITORIES = [
  { name: "Atlanta", slug: "atlanta" },
] as const;

/** Territories where the shuttle runs this season. */
export const SHUTTLE_TERRITORIES = ["Jamaica", "Trinidad"];
