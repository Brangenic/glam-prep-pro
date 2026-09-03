import { describe, expect, it } from "vitest";

import {
  PRE_REGISTRATION,
  getOpenPreRegistration,
  hasSeasonPassed,
  isPreRegistrationOpen,
} from "@/data/seasons";
import { getDestinationBySlug, getDestinationFaqs } from "@/data/destinations";
import { getTerritoryPricing } from "@/data/territoryPricing";
import { getProfile } from "@/data/territoryProfiles";
import { GRENADA_VENUE_NAME } from "@/data/hubTiers";

const OPEN = new Date("2026-12-30T12:00:00Z");
const CLOSED = new Date("2027-01-01T12:00:00Z");

describe("pre-registration boundary", () => {
  it("is open on 30 December 2026 and closed on 1 January 2027", () => {
    expect(isPreRegistrationOpen("grenada", OPEN)).toBe(true);
    expect(getOpenPreRegistration("grenada", OPEN)).not.toBeNull();
    expect(isPreRegistrationOpen("grenada", CLOSED)).toBe(false);
    expect(getOpenPreRegistration("grenada", CLOSED)).toBeNull();
  });

  it("does not flip Grenada to a finished season when pre-registration closes", () => {
    expect(hasSeasonPassed("grenada", CLOSED)).toBe(false);
  });

  it("points at the territory event, never the bare events list", () => {
    for (const entry of Object.values(PRE_REGISTRATION)) {
      expect(entry.eventUrl).toContain("/events/");
    }
  });
});

describe("Grenada Spicemas 2027 surfaces", () => {
  const dest = getDestinationBySlug("grenada")!;
  const faqs = getDestinationFaqs(dest);
  const surfaces = [
    dest.date,
    dest.description,
    dest.longDescription,
    dest.metaTitle,
    dest.metaDescription,
    dest.cta,
    ...faqs.flatMap((f) => [f.question, f.answer]),
  ];

  it("never presents a 2026 date as the upcoming Grenada Carnival", () => {
    for (const text of surfaces) {
      expect(/(Spicemas|Grenada Carnival)[^.]{0,40}2026/i.test(text)).toBe(false);
    }
  });

  it("reads as August 2027 and carries the pre-registration terms", () => {
    expect(dest.date).toContain("August 2027");
    const joined = surfaces.join(" ");
    expect(joined).toContain("31 December 2026");
    expect(joined).toContain("US$50");
    expect(joined).toContain("not a full booking");
  });

  it("names the venue from one shared constant", () => {
    expect(getProfile("grenada")?.venue).toContain(GRENADA_VENUE_NAME);
    expect(faqs.some((f) => f.answer.includes(GRENADA_VENUE_NAME))).toBe(true);
  });

  it("publishes no Grenada service price for 2027", () => {
    const pricing = getTerritoryPricing("grenada");
    expect(pricing?.quotable).toBe(false);
    expect(pricing?.products ?? []).toHaveLength(0);
  });
});
