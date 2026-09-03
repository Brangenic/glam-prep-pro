import { describe, expect, it } from "vitest";

import { canQuote, getBookableQuoteTerritories } from "@/pages/BookingCalculator";
import { hasBookableEvent } from "@/lib/destinations";
import { getOpenPreRegistration } from "@/data/seasons";

const FIXED_NOW = new Date("2026-08-26T12:00:00Z");

/**
 * Two cases, never the same thing:
 * - Carnival coming, no products or event yet: selectable, enquiry only.
 * - Carnival not running at all: not selectable.
 */
describe("booking calculator territory list", () => {
  const territories = getBookableQuoteTerritories(FIXED_NOW);
  const slugs = territories.map((t) => t.slug);

  it("quotes only territories with real products and a bookable event", () => {
    const quoting = territories.filter((t) => canQuote(t)).map((t) => t.slug);
    expect(quoting).toEqual(["trinidad", "jamaica", "miami", "tobago"]);
    for (const slug of quoting) {
      expect(hasBookableEvent(slug)).toBe(true);
    }
  });

  it("keeps enquiry-only territories selectable with no number and no checkout", () => {
    for (const slug of ["atlanta"]) {
      expect(slugs).toContain(slug);
      const territory = territories.find((t) => t.slug === slug)!;
      expect(canQuote(territory)).toBe(false);
      expect(hasBookableEvent(slug)).toBe(false);
    }
  });

  it("excludes any Carnival that is not running at all", () => {
    expect(slugs).not.toContain("epic-cruise");
  });
});

describe("Grenada in the calculator", () => {
  const grenada = getBookableQuoteTerritories().find((t) => t.slug === "grenada");

  it("is selectable but never quotable", () => {
    expect(grenada).toBeTruthy();
    expect(canQuote(grenada)).toBe(false);
  });

  it("publishes no service product, only a pre-registration", () => {
    expect(grenada!.products).toHaveLength(0);
    const preReg = getOpenPreRegistration("grenada");
    expect(preReg?.amount).toBe(50);
    expect(preReg?.closesOnText).toBe("31 December 2026");
  });
});
