/**
 * Generated price prose, per territory.
 *
 * No sentence quoting a figure may be typed by hand on either rendering
 * surface. Both the React pages and the prerender scripts call these
 * helpers, so a price change is one edit in territoryPricing.ts.
 * This module imports no assets, so the Node prerender scripts can read it.
 */

import {
  BARBER_PRICE,
  GETTING_DRESSED_PRICE,
  TERRITORY_PRICING,
  type QuoteProduct,
  type ServiceTag,
  type TerritoryPricing,
} from "./territoryPricing";
import { FULL_SERVICE_NAMES, LITE_NAMES, listNames } from "./hubTiers";

function sameTags(product: QuoteProduct, tags: ServiceTag[]): boolean {
  return [...product.tags].sort().join("|") === [...tags].sort().join("|");
}

function hasTags(product: QuoteProduct, tags: ServiceTag[]): boolean {
  return tags.every((t) => product.tags.includes(t));
}

function label(prices: number[]): string {
  if (!prices.length) return "";
  const lo = Math.min(...prices);
  const hi = Math.max(...prices);
  return lo === hi ? `US$${lo}` : `US$${lo} to US$${hi}`;
}

/**
 * One sentence of pricing for a single territory, built from its products.
 * A service with no product on file is left out rather than guessed at.
 * Returns an empty string for a territory that must never show a number.
 */
export function territoryPriceSentence(slug: string): string {
  const t: TerritoryPricing | undefined = TERRITORY_PRICING.find(
    (p) => p.slug === slug,
  );
  if (!t || !t.quotable || t.runningThisSeason === false) return "";

  const standard = t.products.filter((p) => !p.premium);
  const premium = t.products.filter((p) => p.premium);

  const priced = (list: QuoteProduct[]) => label(list.map((p) => p.price));

  const singleMakeup = priced(
    standard.filter((p) => sameTags(p, ["makeup"]) && p.day !== "both"),
  );
  const bothMakeup = priced(
    standard.filter((p) => sameTags(p, ["makeup"]) && p.day === "both"),
  );
  const makeupPhoto = priced(
    standard.filter((p) => sameTags(p, ["makeup", "photoshoot"])),
  );
  const fullGlam = priced(
    standard.filter((p) => hasTags(p, ["makeup", "hair", "photoshoot"])),
  );
  const photoOnly = priced(standard.filter((p) => sameTags(p, ["photoshoot"])));
  const hairOnly = priced(standard.filter((p) => sameTags(p, ["hair"])));
  const premiumRange = priced(premium);

  const parts: string[] = [];
  if (t.roadReady) {
    parts.push(`Carnival morning access is US$${GETTING_DRESSED_PRICE}.`);
  }
  if (singleMakeup && bothMakeup) {
    parts.push(
      `Makeup only is ${singleMakeup} for a single day and ${bothMakeup} for both days.`,
    );
  } else if (singleMakeup) {
    parts.push(`Makeup only is ${singleMakeup}.`);
  }
  if (makeupPhoto) parts.push(`Makeup and photoshoot is ${makeupPhoto}.`);
  if (fullGlam) parts.push(`Full Glam is ${fullGlam}.`);
  if (premiumRange) {
    parts.push(`Named and celebrity artists run ${premiumRange}.`);
  }
  if (photoOnly && hairOnly) {
    parts.push(`Photoshoot only is ${photoOnly} and hair is ${hairOnly}.`);
  } else if (photoOnly) {
    parts.push(`Photoshoot only is ${photoOnly}.`);
  } else if (hairOnly) {
    parts.push(`Hair is ${hairOnly}.`);
  }
  if (t.barber) parts.push(`A barber is available at US$${BARBER_PRICE}.`);
  if (t.deposit) {
    parts.push(`A US$${t.deposit.amount} deposit secures the slot.`);
  }

  return parts.join(" ");
}

/**
 * Territory names we are actually operating this season, taken from the two
 * tier model and filtered by the season flag in territoryPricing.ts, so a
 * Carnival that is not running (the EPIC Cruise, which does not sail until
 * 2028) can never appear in a list of where we work.
 */
export const OPERATING_TERRITORY_NAMES: string[] = [
  ...FULL_SERVICE_NAMES,
  ...LITE_NAMES,
].filter((name) => {
  const entry = TERRITORY_PRICING.find(
    (p) => p.label === name || p.label.startsWith(`${name} `),
  );
  return !entry || entry.runningThisSeason !== false;
});

/** "a, b and c" for the territories we are operating this season. */
export const OPERATING_TERRITORY_SENTENCE = listNames(OPERATING_TERRITORY_NAMES);
