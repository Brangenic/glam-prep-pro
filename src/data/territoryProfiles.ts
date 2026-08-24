/**
 * Asset-free per-territory facts.
 *
 * `src/data/destinations.ts` imports image assets, so a build script can
 * never import it. This module carries the same names, short names and
 * date strings, copied character for character from destinations.ts, so a
 * script under scripts/ can read them safely. A test asserts they match,
 * so any drift fails the build.
 *
 * Venues are only listed where the venue is already published on the
 * site. Everywhere else the venue is confirmed after booking and must
 * never be guessed.
 */

import { MIAMI_HUB_LOCATION } from "@/data/hubTiers";

export type TerritoryProfile = {
  slug: string;
  name: string;
  shortName: string;
  dateText: string;
  /** Site path, or null where no page exists. */
  path: string | null;
  venue: string | null;
  /** Lowercase strings a visitor might type. */
  aliases: string[];
};

const TRINIDAD_VENUE =
  "The Hilton Hotel, two minutes from the Savannah, Port of Spain";

export const TERRITORY_PROFILES: TerritoryProfile[] = [
  {
    slug: "jamaica",
    name: "Jamaica Carnival",
    shortName: "Jamaica",
    dateText: "12 April 2026",
    path: "/jamaica",
    venue: "Jamaica Pegasus Hotel, Kingston",
    aliases: ["jamaica", "kingston", "pegasus"],
  },
  {
    slug: "trinidad",
    name: "Trinidad Carnival",
    shortName: "Trinidad",
    dateText: "Monday 8 & Tuesday 9 February 2027",
    path: "/trinidad",
    venue: TRINIDAD_VENUE,
    aliases: [
      "trinidad",
      "trini",
      "trinidad and tobago",
      "tt",
      "port of spain",
      "savannah",
    ],
  },
  {
    slug: "trinidad-carnival-2027",
    name: "Trinidad Carnival",
    shortName: "Trinidad",
    dateText: "Monday 8 & Tuesday 9 February 2027",
    path: "/trinidad-carnival-2027",
    venue: TRINIDAD_VENUE,
    aliases: [
      "trinidad carnival 2027",
      "trinidad 2027",
      "carnival 2027",
    ],
  },
  {
    slug: "miami",
    name: "Miami Carnival",
    shortName: "Miami",
    dateText: "11 October 2026",
    path: "/miami",
    venue: MIAMI_HUB_LOCATION,
    aliases: [
      "miami",
      "lauderhill",
      "broward",
      "fort lauderdale",
      "florida",
    ],
  },
  {
    slug: "tobago",
    name: "Tobago Carnival",
    shortName: "Tobago",
    dateText: "30 October – 1 November 2026",
    path: "/tobago",
    venue: null,
    aliases: ["tobago"],
  },
  {
    slug: "saint-lucia",
    name: "Saint Lucia Carnival",
    shortName: "Saint Lucia",
    dateText: "20–21 July 2026",
    path: "/saint-lucia",
    venue: null,
    aliases: ["saint lucia", "st lucia", "st. lucia", "stlucia", "lucia"],
  },
  {
    slug: "grenada",
    name: "Grenada Carnival",
    shortName: "Grenada",
    dateText: "10 – 11 August 2026",
    path: "/grenada",
    venue: null,
    aliases: ["grenada", "spicemas", "spice mas"],
  },
  {
    slug: "antigua",
    name: "Antigua Carnival",
    shortName: "Antigua",
    dateText: "4 August 2026",
    path: "/antigua",
    venue: null,
    aliases: ["antigua"],
  },
  {
    slug: "barbados",
    name: "Barbados Crop Over",
    shortName: "Barbados",
    dateText: "3 August 2026",
    path: "/barbados",
    venue: null,
    aliases: ["barbados", "crop over", "cropover", "kadooment"],
  },
  {
    slug: "toronto",
    name: "Toronto Caribana",
    shortName: "Toronto",
    dateText: "1 August 2026",
    path: "/toronto",
    venue: null,
    aliases: ["toronto", "caribana", "canada"],
  },
  {
    slug: "guyana",
    name: "Guyana Carnival",
    shortName: "Guyana",
    dateText: "May 2026",
    path: "/guyana",
    venue: null,
    aliases: ["guyana", "mashramani", "mash"],
  },
  {
    // No confirmed date and no page, so both are deliberately empty.
    slug: "atlanta",
    name: "Atlanta Carnival",
    shortName: "Atlanta",
    dateText: "",
    path: null,
    venue: null,
    aliases: ["atlanta"],
  },
  {
    slug: "epic-cruise",
    name: "Epic Cruise — Trinidad Carnival",
    shortName: "Epic Cruise",
    dateText: "8–9 February 2027",
    path: "/epic-cruise",
    venue:
      "Aboard the EPIC Carnival Experience, sailing from San Juan, Puerto Rico",
    aliases: ["epic", "epic cruise", "cruise"],
  },
];

export function getProfile(slug: string): TerritoryProfile | undefined {
  return TERRITORY_PROFILES.find((p) => p.slug === slug);
}
