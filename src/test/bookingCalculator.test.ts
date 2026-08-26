import { describe, expect, it } from "vitest";

import { getBookableQuoteTerritories } from "@/pages/BookingCalculator";
import { hasBookableEvent } from "@/lib/destinations";

const FIXED_NOW = new Date("2026-08-26T12:00:00Z");

describe("booking calculator territory list", () => {
  it("only includes upcoming territories with a real bookable event", () => {
    const territories = getBookableQuoteTerritories(FIXED_NOW);
    const slugs = territories.map((t) => t.slug);

    expect(slugs).toEqual(["trinidad", "miami"]);
    for (const territory of territories) {
      expect(hasBookableEvent(territory.slug)).toBe(true);
    }

    for (const noEventSlug of ["epic-cruise", "jamaica", "tobago", "atlanta"]) {
      expect(hasBookableEvent(noEventSlug)).toBe(false);
      expect(slugs).not.toContain(noEventSlug);
    }
  });
});