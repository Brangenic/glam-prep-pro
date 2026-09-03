/**
 * ONWARD DESTINATION RULE, enforced.
 *
 * See the section of the same name in CLAUDE.md. These tests fail if a
 * passed Carnival can appear as an onward option, if the Trinidad pair
 * ever doubles up in one list, if a destination card sends a visitor to
 * the wrong place, or if a component grows its own hardcoded destination
 * slug array instead of reading the helper.
 *
 * The clock is fixed on purpose. These tests must never start failing on
 * their own in February.
 */
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative, resolve } from "path";

import { getUpcomingDestinations, GALLERY_HREF } from "@/data/seasons";
import { getDestinationCardLink, hasBookableEvent } from "@/lib/destinations";
import { getTerritoryPricing } from "@/data/territoryPricing";
import { destinationPackages } from "@/data/destinationPackages";

/** The fixed clock every assertion below is judged against. */
const FIXED_NOW = new Date("2026-08-26T12:00:00Z");

/** Seasons that had already wrapped on the fixed clock. */
const WRAPPED_SLUGS = [
  "guyana",
  "saint-lucia",
  "toronto",
  "barbados",
  "antigua",
] as const;

describe("onward destination rule", () => {
  beforeAll(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(FIXED_NOW);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("never offers a Carnival that has already passed", () => {
    const slugs = getUpcomingDestinations().map((d) => d.slug);
    for (const wrapped of WRAPPED_SLUGS) {
      expect(slugs).not.toContain(wrapped);
    }
    // Sanity check, so an empty list can never pass this test quietly.
    expect(slugs.length).toBeGreaterThan(2);
    expect(slugs).toContain("miami");
    // Spicemas 2027 has reopened, so Grenada is an onward option again.
    expect(slugs).toContain("grenada");
  });

  it("never returns both Trinidad pages in one list", () => {
    for (const exclude of [undefined, "trinidad", "trinidad-carnival-2027", "miami"]) {
      const slugs = getUpcomingDestinations(exclude).map((d) => d.slug);
      const pair = slugs.filter(
        (s) => s === "trinidad" || s === "trinidad-carnival-2027",
      );
      expect(pair.length).toBeLessThanOrEqual(1);
    }
  });

  it("orders upcoming destinations soonest season first", () => {
    const slugs = getUpcomingDestinations().map((d) => d.slug);
    expect(slugs[0]).toBe("miami");
    expect(slugs.indexOf("tobago")).toBeLessThan(slugs.indexOf("jamaica"));
  });

  describe("destination card links", () => {
    it("sends a bookable upcoming Carnival straight to its MasOS event", () => {
      expect(hasBookableEvent("miami")).toBe(true);
      const link = getDestinationCardLink("miami", "homepage_card");
      expect(link.external).toBe(true);
      expect(link.href).toContain("masos.app/events/");
      expect(link.href).toContain("utm_campaign=homepage_card");
    });

    it("sends Jamaica and Tobago straight to their own MasOS events", () => {
      for (const slug of ["jamaica", "tobago"] as const) {
        expect(hasBookableEvent(slug)).toBe(true);
        const link = getDestinationCardLink(slug, "homepage_card");
        expect(link.external).toBe(true);
        expect(link.href).toContain("masos.app/events/");
      }
    });

    it("sends an upcoming Carnival with no event on file to its own page", () => {
      // Epic Cruise is the standing case: upcoming season, no event on file.
      for (const [slug, path] of [["epic-cruise", "/epic-cruise"]] as const) {
        expect(hasBookableEvent(slug)).toBe(false);
        const link = getDestinationCardLink(slug, "homepage_card");
        expect(link.external).toBe(false);
        expect(link.href).toBe(path);
      }
    });

    it("sends every Grenada card to the 2027 MasOS event, never the bare list", () => {
      expect(hasBookableEvent("grenada")).toBe(true);
      for (const campaign of ["homepage_card", "destination_card", "footer"]) {
        const link = getDestinationCardLink("grenada", campaign);
        expect(link.external).toBe(true);
        expect(link.href).toContain(
          "masos.app/events/19940fc1-1fa1-4d34-8a7b-a4c3562df100",
        );
        expect(link.href).not.toMatch(/masos\.app\/events(\?|$)/);
      }
    });

    it("exposes no 2026 Grenada service price on any surface", () => {
      const grenada = getTerritoryPricing("grenada");
      expect(grenada?.quotable).toBe(false);
      expect(grenada?.products).toHaveLength(0);
      const packages = destinationPackages.grenada;
      const names = packages.sections.flatMap((sec) => sec.packages);
      expect(names).toHaveLength(1);
      expect(names[0].name).toBe("Grenada Pre-Registration");
      expect(names[0].price).toBe("$50 USD");
      for (const retired of ["$200 USD", "$320 USD", "$160 USD"]) {
        expect(names.map((n) => n.price)).not.toContain(retired);
      }
    });

    it("sends a wrapped season to the Gallery", () => {
      for (const wrapped of WRAPPED_SLUGS) {
        const link = getDestinationCardLink(wrapped, "homepage_card");
        expect(link.external).toBe(false);
        expect(link.href).toBe(GALLERY_HREF);
      }
    });
  });

  /**
   * Guard: nobody adds a new destination list with its own hardcoded
   * array. Only the modules below are allowed to enumerate slugs, because
   * they are the source of truth or a route table. Everything else must
   * read `getUpcomingDestinations`.
   */
  describe("no hardcoded destination slug arrays outside the data layer", () => {
    const SRC = resolve(__dirname, "..");

    /** Modules allowed to enumerate destination slugs, with the reason. */
    const ALLOWED = new Set([
      "data/destinations.ts", // source of truth for MasOS events
      "data/territoryProfiles.ts", // source of truth for territory facts
      "data/seasons.ts", // season calendar and the onward helper itself
      "data/territoryPricing.ts", // published prices per territory
      "data/hubTiers.ts", // tier per territory
      "data/stationRentals.ts", // station and vendor offers per territory
      "data/destinationPackages.ts", // package copy per territory
      "data/botKnowledge.ts", // generated bot pack input
      "lib/destinations.ts", // the card link decision
      "lib/wixRedirects.ts", // legacy URL redirect table
      "App.tsx", // route table
    ]);

    const KNOWN_SLUGS = [
      "trinidad",
      "jamaica",
      "saint-lucia",
      "barbados",
      "antigua",
      "grenada",
      "toronto",
      "miami",
      "guyana",
      "tobago",
      "epic-cruise",
    ];

    function walk(dir: string, out: string[] = []): string[] {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
          if (entry === "test" || entry === "recovered" || entry === "content") continue;
          walk(full, out);
        } else if (/\.tsx?$/.test(full)) {
          out.push(full);
        }
      }
      return out;
    }

    /**
     * A file may hold an ordering or neighbour map of slugs, RelatedLinks
     * and the homepage strip both do, but only if it then filters that
     * map through the season helper in the same file. A slug array with
     * no season filter beside it is the thing this guard exists to catch.
     */
    const SEASON_FILTER = /getUpcomingDestinations|isUpcomingDestination|hasSeasonPassed/;

    const offenders: string[] = [];
    for (const file of walk(SRC)) {
      const rel = relative(SRC, file).split("\\").join("/");
      if (ALLOWED.has(rel)) continue;
      const source = readFileSync(file, "utf8");
      if (SEASON_FILTER.test(source)) continue;
      // Any bracketed literal listing three or more distinct destination
      // slugs is a hardcoded destination list.
      for (const block of source.match(/\[[^[\]]*\]/g) ?? []) {
        const found = new Set(
          KNOWN_SLUGS.filter((slug) =>
            new RegExp(`["'\`]${slug}["'\`]`).test(block),
          ),
        );
        if (found.size >= 3) offenders.push(`${rel}: ${[...found].join(", ")}`);
      }
    }

    it("finds no unfiltered destination slug array in a component", () => {
      expect(offenders).toEqual([]);
    });



    it("can actually fail, so the guard is honest", () => {
      const fake = `const DESTS = ["trinidad", "barbados", "grenada"];`;
      const found = KNOWN_SLUGS.filter((slug) =>
        new RegExp(`["'\`]${slug}["'\`]`).test(fake),
      );
      expect(found.length).toBeGreaterThanOrEqual(3);
    });
  });
});
