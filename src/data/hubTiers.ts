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

/** Coffee and tea are included at every hub, Full Service and Lite. */
export const ALWAYS_INCLUDED = "Coffee and tea";

export const FULL_SERVICE_INCLUSIONS = [
  "Shuttle",
  "Bag and wing check, including overnight",
  "Breakfast and refreshments",
  "Alcohol",
  "Makeup",
  "Hair",
  "Bronzing",
  "Photoshoot and reels",
  ALWAYS_INCLUDED,
];

export const LITE_INCLUSIONS = [
  "Makeup",
  "Photoshoot and reels",
  ALWAYS_INCLUDED,
];

/** Miami is Full Service, but there is no shuttle in Miami this season. */
export const MIAMI_SHUTTLE_NOTE =
  "Shuttle is not available in Miami this season.";

export function getHubTier(slug: string): HubTier | null {
  if ((FULL_SERVICE_SLUGS as readonly string[]).includes(slug)) return "full";
  if ((LITE_SLUGS as readonly string[]).includes(slug)) return "lite";
  // Dated Trinidad edition shares the Trinidad hub.
  if (slug === "trinidad-carnival-2027") return "full";
  return null;
}

export function getHubInclusions(slug: string): string[] | null {
  const tier = getHubTier(slug);
  if (!tier) return null;
  if (tier === "lite") return [...LITE_INCLUSIONS];
  if (slug === "miami") {
    return FULL_SERVICE_INCLUSIONS.filter((i) => i !== "Shuttle");
  }
  return [...FULL_SERVICE_INCLUSIONS];
}

/**
 * Lite territories with no dedicated page. They appear in the
 * destinations list, the home page section and the footer, and link
 * straight to the booking flow.
 */
export const EXTRA_LITE_TERRITORIES = [
  { name: "Tobago", slug: "tobago" },
  { name: "Atlanta", slug: "atlanta" },
] as const;

/** Territories where the shuttle runs this season. */
export const SHUTTLE_TERRITORIES = ["Jamaica", "Trinidad"];
