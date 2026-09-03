import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

import { buildDestinationUrl, getDestinationCardLink, hasBookableEvent } from "@/lib/destinations";
import { SEASON_END_DATES, SEASON_FORWARD_SLUGS, hasSeasonPassed } from "@/data/seasons";
import { getProfile } from "@/data/territoryProfiles";
import { REELS_PRICE, getReelsPrice } from "@/data/territoryPricing";
import { reelsNote } from "@/data/hubTiers";

const FIXED_NOW = new Date("2026-08-26T12:00:00Z");
const JAMAICA_EVENT =
  "https://carnivalglamhub.masos.app/events/0ad062ce-d1e0-4838-aeaf-f418ed526440";

describe("Jamaica is a live bookable territory", () => {
  it("is dated, upcoming and not a forward-only territory", () => {
    expect(SEASON_FORWARD_SLUGS).toEqual(["epic-cruise"]);
    expect(SEASON_END_DATES.jamaica).toBe("2027-04-04");
    expect(hasSeasonPassed("jamaica", FIXED_NOW)).toBe(false);
    expect(getProfile("jamaica")?.dateText).toBe("Sunday 4 April 2027");
  });

  it("has a real MasOS event and no card points at the bare events list", () => {
    expect(hasBookableEvent("jamaica")).toBe(true);
    const link = getDestinationCardLink("jamaica", "test");
    expect(link.external).toBe(true);
    expect(link.href.startsWith(`${JAMAICA_EVENT}?`)).toBe(true);
    expect(buildDestinationUrl("jamaica")).not.toMatch(
      /masos\.app\/events\?/,
    );
  });
});

describe("reels carry one confirmed price", () => {
  it("is US$80 in every territory that offers reels", () => {
    expect(REELS_PRICE).toBe(80);
    for (const slug of ["trinidad", "trinidad-carnival-2027", "jamaica"]) {
      expect(getReelsPrice(slug)).toBe(80);
      expect(reelsNote(slug)).toBe("US$80 per masquerader.");
    }
  });
});

describe("the awaiting-dates sidebar is generic", () => {
  const src = readFileSync(resolve(process.cwd(), "src/pages/Destination.tsx"), "utf8");

  it("names no territory in the awaiting-dates branch", () => {
    const start = src.indexOf("awaitingDates ? (");
    expect(start).toBeGreaterThan(-1);
    const branch = src.slice(start, start + 1400);
    for (const name of ["Jamaica", "Trinidad", "Miami", "Tobago", "Epic Cruise"]) {
      expect(branch).not.toContain(name);
    }
    expect(branch).toContain("Dates to be confirmed");
    expect(branch).not.toContain("Season Ended");
  });
});
