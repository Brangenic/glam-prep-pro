/**
 * Single source of truth for Carnival Glam Hub quote pricing.
 *
 * Rules:
 * - Every figure here is taken from a live masos product. Nothing is estimated.
 * - No component may hardcode a price. Import from this file instead.
 * - Territories with no confirmed product list are marked `quotable: false`
 *   and must never display a number.
 *
 * Booking URLs and event dates mirror `src/data/destinationPackages.ts`.
 */

import { BOOKING_URL } from "@/lib/constants";

export type DayKey = "single" | "monday" | "tuesday" | "both";

export type ServiceTag =
  | "makeup"
  | "hair"
  | "photoshoot"
  | "bronzing"
  | "breakfast"
  | "dressing"
  | "barber";

export type QuoteProduct = {
  id: string;
  label: string;
  /** USD, fixed price per masquerader. */
  price: number;
  day: DayKey;
  tags: ServiceTag[];
  /** Named or celebrity artist. Never folded into the base quote. */
  premium?: boolean;
};

export type TerritoryPricing = {
  slug: string;
  label: string;
  tier: "full" | "lite" | "partnership";
  /**
   * Two different cases, never collapse them:
   *
   * 1. `quotable: false` with `runningThisSeason` left alone. The Carnival is
   *    coming but no products or event are on file yet, for example
   *    Guyana and Atlanta. These stay selectable in the calculator, show the
   *    inclusions and an enquiry call to action, and never display a number,
   *    a total or a checkout handoff.
   * 2. `runningThisSeason: false`. The Carnival is not taking place at all,
   *    for example Epic Cruise which does not sail until 2028. There is
   *    nothing to enquire about, so it drops out of the calculator entirely.
   */
  quotable: boolean;
  /** Defaults to true. Set false only where the Carnival is not running at all. */
  runningThisSeason?: boolean;

  provisionalNote?: string;
  eventDate: string;
  /** Only true where days genuinely differ in price. */
  askDay: boolean;
  days: { key: DayKey; label: string }[];
  products: QuoteProduct[];
  /** Getting dressed, lounge, refreshments, shuttle where it runs. */
  roadReady: boolean;
  barber: boolean;
  deposit?: { amount: number; note: string };
  bookingUrl: string;
};

/** Free with any Glam Hub service, US$35 stand-alone. Trinidad, Jamaica, Miami only. */
export const GETTING_DRESSED_PRICE = 35;

/** Optional extra. Jamaica and Trinidad only, per HUB_CAPABILITIES. */
export const BARBER_PRICE = 35;

/**
 * Overnight bag check. A paid add-on, never an inclusion.
 * Trinidad, Jamaica and Miami only, per HUB_CAPABILITIES.
 */
export const OVERNIGHT_BAG_CHECK_PRICE = 35;

/**
 * Reels are a paid add-on at US$80 per masquerader, Trinidad and Jamaica
 * only, per HUB_CAPABILITIES. Confirmed against the MasOS Glam Reel
 * products on 3 September 2026: Trinidad Monday, Trinidad Tuesday and
 * Jamaica all sell the reel at the same price.
 */
export const REELS_PRICE = 80;

/** Reels price for a territory. One price everywhere reels are offered. */
export function getReelsPrice(_slug: string): number {
  return REELS_PRICE;
}

const SINGLE_DAY: { key: DayKey; label: string }[] = [{ key: "single", label: "Carnival day" }];

const TWO_DAYS: { key: DayKey; label: string }[] = [
  { key: "monday", label: "Carnival Monday" },
  { key: "tuesday", label: "Carnival Tuesday" },
  { key: "both", label: "Both days" },
];

const TWO_DAYS_NO_BOTH: { key: DayKey; label: string }[] = [
  { key: "monday", label: "Carnival Monday" },
  { key: "tuesday", label: "Carnival Tuesday" },
];

/** Trinidad Carnival Tuesday list. */
const TRINIDAD_TUESDAY: QuoteProduct[] = [
  { id: "tue-makeup", label: "Makeup only", price: 210, day: "tuesday", tags: ["makeup"] },
  { id: "tue-makeup-photo", label: "Makeup and photoshoot", price: 330, day: "tuesday", tags: ["makeup", "photoshoot"] },
  { id: "tue-photo", label: "Photoshoot only", price: 160, day: "tuesday", tags: ["photoshoot"] },
  { id: "tue-hair-ponytail", label: "Hair only, ponytail", price: 120, day: "tuesday", tags: ["hair"] },
  { id: "tue-hair-front-braided", label: "Front braided ponytail", price: 185, day: "tuesday", tags: ["hair"] },
  { id: "tue-full-glam", label: "Full Glam", price: 440, day: "tuesday", tags: ["makeup", "hair", "photoshoot"] },
  { id: "tue-makeup-photo-bronzing", label: "Makeup and photoshoot plus bronzing", price: 480, day: "tuesday", tags: ["makeup", "photoshoot", "bronzing"] },
  { id: "tue-bronzing", label: "Bronzing", price: 160, day: "tuesday", tags: ["bronzing"] },
  { id: "tue-gabby-makeup", label: "Gabby Glam Team makeup only", price: 300, day: "tuesday", tags: ["makeup"], premium: true },
  { id: "tue-gabby-makeup-photo", label: "Gabby Glam Team makeup and photoshoot", price: 420, day: "tuesday", tags: ["makeup", "photoshoot"], premium: true },
];

const trinidad: TerritoryPricing = {
  slug: "trinidad",
  label: "Trinidad Carnival 2027",
  tier: "full",
  quotable: true,
  eventDate: "8-9 February 2027",
  askDay: true,
  days: TWO_DAYS,
  roadReady: true,
  barber: true,
  deposit: { amount: 50, note: "US$50 secures your appointment." },
  bookingUrl: "https://carnivalglamhub.masos.app/events/cef3860d-c2e6-4753-a065-4ea39c0eb8cb",
  products: [
    // Monday 8 February 2027
    { id: "mon-makeup", label: "Makeup only", price: 180, day: "monday", tags: ["makeup"] },
    { id: "mon-makeup-photo", label: "Makeup and photoshoot", price: 320, day: "monday", tags: ["makeup", "photoshoot"] },
    { id: "mon-photo", label: "Photoshoot only", price: 160, day: "monday", tags: ["photoshoot"] },
    { id: "mon-hair-ponytail", label: "Hair only, ponytail", price: 120, day: "monday", tags: ["hair"] },
    { id: "mon-hair-front-braided", label: "Front braided ponytail", price: 185, day: "monday", tags: ["hair"] },
    { id: "mon-hair-half-up", label: "Half up half down ponytail", price: 220, day: "monday", tags: ["hair"] },
    { id: "mon-full-glam", label: "Full Glam", price: 440, day: "monday", tags: ["makeup", "hair", "photoshoot"] },
    { id: "mon-makeup-photo-bronzing", label: "Makeup and photoshoot plus bronzing", price: 480, day: "monday", tags: ["makeup", "photoshoot", "bronzing"] },
    { id: "mon-gabby-makeup", label: "Gabby Glam Team makeup only", price: 200, day: "monday", tags: ["makeup"], premium: true },
    { id: "mon-gabby-makeup-photo", label: "Gabby Glam Team makeup and photoshoot", price: 350, day: "monday", tags: ["makeup", "photoshoot"], premium: true },
    // Tuesday 9 February 2027
    ...TRINIDAD_TUESDAY,
    // Both days
    { id: "both-makeup", label: "Makeup only", price: 380, day: "both", tags: ["makeup"] },
    { id: "both-makeup-photo", label: "Makeup and photoshoot", price: 480, day: "both", tags: ["makeup", "photoshoot"] },
    { id: "both-full-glam", label: "Full Glam", price: 680, day: "both", tags: ["makeup", "hair", "photoshoot"] },
    { id: "both-gabby-makeup", label: "Gabby Glam Team makeup only", price: 480, day: "both", tags: ["makeup"], premium: true },
    { id: "both-gabby-makeup-photo", label: "Gabby Glam Team makeup and photoshoot", price: 580, day: "both", tags: ["makeup", "photoshoot"], premium: true },
  ],
};

const jamaica: TerritoryPricing = {
  slug: "jamaica",
  label: "Jamaica Carnival",
  tier: "full",
  quotable: true,
  eventDate: "4 April 2027",
  askDay: false,
  days: SINGLE_DAY,
  roadReady: true,
  barber: true,
  deposit: { amount: 50, note: "US$50 secures your appointment." },
  bookingUrl: "https://carnivalglamhub.masos.app/events/0ad062ce-d1e0-4838-aeaf-f418ed526440",
  products: [
    { id: "jam-makeup", label: "Makeup only", price: 200, day: "single", tags: ["makeup"] },
    { id: "jam-makeup-photo", label: "Makeup and photoshoot", price: 320, day: "single", tags: ["makeup", "photoshoot"] },
    { id: "jam-full-glam", label: "Full Glam", price: 440, day: "single", tags: ["makeup", "hair", "photoshoot"] },
    { id: "jam-photo", label: "Photoshoot only", price: 160, day: "single", tags: ["photoshoot"] },
    { id: "jam-hair", label: "Hair only", price: 120, day: "single", tags: ["hair"] },
    { id: "jam-bronzing", label: "Bronzing", price: 160, day: "single", tags: ["bronzing"] },
    { id: "jam-gabby-makeup", label: "Gabby Glam Team makeup only", price: 250, day: "single", tags: ["makeup"], premium: true },
    { id: "jam-gabby-makeup-photo", label: "Gabby Glam Team makeup and photoshoot", price: 370, day: "single", tags: ["makeup", "photoshoot"], premium: true },
  ],
};

const miami: TerritoryPricing = {
  slug: "miami",
  label: "Miami Carnival",
  tier: "full",
  quotable: true,
  eventDate: "11 October 2026",
  askDay: false,
  days: SINGLE_DAY,
  roadReady: true,
  barber: false,
  bookingUrl: "https://carnivalglamhub.masos.app/events/d6238a3f-73d0-4805-a3f2-91e8b4415047",
  products: [
    { id: "mia-makeup", label: "Makeup only", price: 190, day: "single", tags: ["makeup"] },
    { id: "mia-makeup-photo", label: "Makeup and photoshoot", price: 310, day: "single", tags: ["makeup", "photoshoot"] },
    { id: "mia-photo", label: "Photoshoot only", price: 150, day: "single", tags: ["photoshoot"] },
    { id: "mia-hair", label: "Hair Glam", price: 130, day: "single", tags: ["hair"] },
    { id: "mia-full-glam", label: "Full Glam, makeup, hair, photoshoot and breakfast", price: 430, day: "single", tags: ["makeup", "hair", "photoshoot", "breakfast"] },
    { id: "mia-gabby-makeup", label: "Gabby Glam Team makeup only", price: 240, day: "single", tags: ["makeup"], premium: true },
    { id: "mia-gabby-makeup-photo", label: "Gabby Glam Team makeup and photoshoot", price: 360, day: "single", tags: ["makeup", "photoshoot"], premium: true },
  ],
};

/**
 * Saint Lucia stays Glam Hub Lite. Its masos hair, bronzing and barber
 * products are deliberately excluded from the quote flow.
 */
const saintLucia: TerritoryPricing = {
  slug: "saint-lucia",
  label: "Saint Lucia Carnival",
  tier: "lite",
  quotable: true,
  eventDate: "20-21 July 2026",
  askDay: true,
  days: TWO_DAYS_NO_BOTH,
  roadReady: false,
  barber: false,
  bookingUrl: "https://carnivalglamhub.masos.app/events/060faa4a-949a-4b36-893e-dc6db75e3100",
  products: [
    { id: "slu-mon-makeup", label: "Makeup only", price: 200, day: "monday", tags: ["makeup"] },
    { id: "slu-mon-makeup-photo", label: "Makeup and photoshoot", price: 320, day: "monday", tags: ["makeup", "photoshoot"] },
    { id: "slu-mon-photo", label: "Photoshoot only", price: 160, day: "monday", tags: ["photoshoot"] },
    { id: "slu-tue-makeup", label: "Makeup only", price: 185, day: "tuesday", tags: ["makeup"] },
    { id: "slu-tue-photo", label: "Photoshoot only", price: 160, day: "tuesday", tags: ["photoshoot"] },
  ],
};

/**
 * Spicemas 2027 is Monday 9 and Tuesday 10 August 2027. Only one product
 * exists on MasOS for the 2027 season, the US$50 pre-registration, so
 * Grenada is not quotable and must never display a service price.
 *
 * Retired 2026 pricing, kept only as a record. Do NOT reinstate any of
 * these without a confirmed 2027 product list on MasOS:
 *   Makeup only US$200, Makeup and photoshoot US$320, Photoshoot only US$160.
 *
 * Grenada stays Glam Hub Lite and stays selectable in the calculator, in
 * the same enquiry state as Guyana, showing inclusions and the
 * pre-registration call to action only.
 */
const grenada: TerritoryPricing = {
  slug: "grenada",
  label: "Grenada Spice Mas",
  tier: "lite",
  quotable: false,
  eventDate: "9 to 10 August 2027",
  askDay: false,
  days: SINGLE_DAY,
  roadReady: false,
  barber: false,
  deposit: { amount: 50, note: "US$50 pre-registration secures your place for Spicemas 2027." },
  bookingUrl: "https://carnivalglamhub.masos.app/events/19940fc1-1fa1-4d34-8a7b-a4c3562df100",
  products: [],
};

/** Antigua's masos hair, bronzing and shuttle products are excluded as Lite. */
const antigua: TerritoryPricing = {
  slug: "antigua",
  label: "Antigua Carnival",
  tier: "lite",
  quotable: true,
  eventDate: "4 August 2026",
  askDay: true,
  days: TWO_DAYS,
  roadReady: false,
  barber: false,
  bookingUrl: "https://carnivalglamhub.masos.app/events/5ff02f96-f867-4e59-9ca8-f88a48eafb44",
  products: [
    { id: "anu-mon-makeup", label: "Makeup only", price: 170, day: "monday", tags: ["makeup"] },
    { id: "anu-mon-photo", label: "Photoshoot only", price: 140, day: "monday", tags: ["photoshoot"] },
    { id: "anu-tue-makeup", label: "Makeup only", price: 185, day: "tuesday", tags: ["makeup"] },
    { id: "anu-tue-photo", label: "Photoshoot only", price: 140, day: "tuesday", tags: ["photoshoot"] },
    { id: "anu-both-makeup", label: "Makeup only", price: 325, day: "both", tags: ["makeup"] },
  ],
};

const barbados: TerritoryPricing = {
  slug: "barbados",
  label: "Barbados Crop Over",
  tier: "lite",
  quotable: true,
  eventDate: "3 August 2026",
  askDay: false,
  days: SINGLE_DAY,
  roadReady: false,
  barber: false,
  bookingUrl: "https://carnivalglamhub.masos.app/events/d76deb6d-c816-4df6-9006-05a11a555c43",
  products: [
    { id: "bgi-makeup", label: "Makeup only", price: 200, day: "single", tags: ["makeup"] },
    { id: "bgi-makeup-photo", label: "Makeup and photoshoot", price: 320, day: "single", tags: ["makeup", "photoshoot"] },
    { id: "bgi-photo", label: "Photoshoot only", price: 160, day: "single", tags: ["photoshoot"] },
  ],
};

const toronto: TerritoryPricing = {
  slug: "toronto",
  label: "Toronto Caribana",
  tier: "lite",
  quotable: true,
  eventDate: "1 August 2026",
  askDay: false,
  days: SINGLE_DAY,
  roadReady: false,
  barber: false,
  bookingUrl: "https://carnivalglamhub.masos.app/events/9d7627f9-f1ea-4e3d-a54b-1898f9a7a98f",
  products: [
    { id: "yyz-makeup", label: "Makeup only", price: 200, day: "single", tags: ["makeup"] },
    { id: "yyz-makeup-photo", label: "Makeup and photoshoot", price: 320, day: "single", tags: ["makeup", "photoshoot"] },
    { id: "yyz-photo", label: "Photoshoot only", price: 160, day: "single", tags: ["photoshoot"] },
  ],
};

const epicCruise: TerritoryPricing = {
  slug: "epic-cruise",
  label: "Epic Cruise, Trinidad Carnival",
  tier: "partnership",
  quotable: false,
  // Not running at all until 2028, so it is not even an enquiry. Out of the calculator.
  runningThisSeason: false,

  eventDate: "Returns 2028, dates to be confirmed",
  askDay: false,
  days: SINGLE_DAY,
  roadReady: false,
  barber: false,
  bookingUrl: BOOKING_URL,
  products: [],
};

/**
 * No pricing exists for Guyana or Atlanta anywhere in the project. They
 * never appear as a quote unless a real bookable event is added for them.
 */
const guyana: TerritoryPricing = {
  slug: "guyana",
  label: "Guyana Carnival",
  tier: "lite",
  quotable: false,
  eventDate: "May 2026",
  askDay: false,
  days: SINGLE_DAY,
  roadReady: false,
  barber: false,
  bookingUrl: BOOKING_URL,
  products: [],
};

/**
 * Tobago stays Glam Hub Lite. Its masos hair product is deliberately
 * excluded from the quote flow, exactly as Saint Lucia's and Antigua's are.
 */
const tobago: TerritoryPricing = {
  slug: "tobago",
  label: "Tobago Carnival",
  tier: "lite",
  quotable: true,
  eventDate: "1 November 2026",
  askDay: false,
  days: SINGLE_DAY,
  roadReady: false,
  barber: false,
  deposit: { amount: 50, note: "US$50 secures your appointment." },
  bookingUrl: "https://carnivalglamhub.masos.app/events/755be168-61a2-4827-9e9e-d52668a790ff",
  products: [
    { id: "tob-makeup", label: "Makeup only", price: 120, day: "single", tags: ["makeup"] },
    { id: "tob-makeup-photo", label: "Makeup and photoshoot", price: 220, day: "single", tags: ["makeup", "photoshoot"] },
    { id: "tob-photo", label: "Photoshoot only", price: 100, day: "single", tags: ["photoshoot"] },
  ],
};

const atlanta: TerritoryPricing = {
  slug: "atlanta",
  label: "Atlanta Carnival",
  tier: "lite",
  quotable: false,
  eventDate: "", // UNCONFIRMED
  askDay: false,
  days: SINGLE_DAY,
  roadReady: false,
  barber: false,
  bookingUrl: BOOKING_URL,
  products: [],
};

export const TERRITORY_PRICING: TerritoryPricing[] = [
  trinidad,
  jamaica,
  miami,
  saintLucia,
  grenada,
  antigua,
  barbados,
  toronto,
  epicCruise,
  guyana,
  tobago,
  atlanta,
];

export function getTerritoryPricing(slug: string): TerritoryPricing | undefined {
  return TERRITORY_PRICING.find((t) => t.slug === slug);
}

/** Products for a territory on a given day, standard artists only. */
export function standardProducts(t: TerritoryPricing, day: DayKey): QuoteProduct[] {
  return t.products.filter((p) => p.day === day && !p.premium);
}

/** Lowest premium artist price for a territory and day, or null. */
export function lowestPremiumPrice(t: TerritoryPricing, day: DayKey): number | null {
  const prices = t.products.filter((p) => p.day === day && p.premium).map((p) => p.price);
  return prices.length ? Math.min(...prices) : null;
}
