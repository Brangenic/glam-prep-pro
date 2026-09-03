import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

import { destinations, getDestinationBySlug, getDestinationFaqs } from "@/data/destinations";
import {
  getHubInclusions,
  getNotOffered,
  hasDressingAssistance,
  LITE_NOT_OFFERED,
} from "@/data/hubTiers";

const JOUVERT = /j\s*'?\s*ouvert/i;

/**
 * J'ouvert is not something Carnival Glam Hub sells, includes or offers.
 * Editorial blog content is deliberately exempt, because the articles
 * about J'ouvert are journal content and a live traffic source.
 */
describe("no J'ouvert in offer copy", () => {
  it("never appears in a destination highlight, description or FAQ", () => {
    for (const d of destinations) {
      const surfaces = [
        d.description,
        d.longDescription,
        d.metaTitle,
        d.metaDescription,
        d.cta,
        ...d.highlights,
        ...getDestinationFaqs(d).flatMap((f) => [f.question, f.answer]),
      ];
      for (const text of surfaces) {
        expect(text ?? "", `${d.slug}: ${text}`).not.toMatch(JOUVERT);
      }
    }
  });

  it("never appears in a hub inclusion or not-offered list", () => {
    const lists = [...LITE_NOT_OFFERED, ...destinations.flatMap((d) => getHubInclusions(d.slug) ?? [])];
    for (const item of lists) expect(item).not.toMatch(JOUVERT);
  });

  it("never appears in the generated bot knowledge pack", () => {
    const pack = JSON.parse(
      readFileSync(resolve(process.cwd(), "supabase/functions/chat/knowledge.json"), "utf8"),
    ) as Record<string, unknown>;
    // The never-say guardrail names J'ouvert on purpose, so that the bot
    // knows not to offer it. Everything else must be clean.
    const { neverSay, ...rest } = pack as { neverSay?: unknown };
    expect(Array.isArray(neverSay)).toBe(true);
    expect(JOUVERT.test(JSON.stringify(rest))).toBe(false);
  });
});

describe("Grenada offer", () => {
  const dest = getDestinationBySlug("grenada")!;
  const inclusions = getHubInclusions("grenada") ?? [];
  const offerText = [
    dest.longDescription,
    ...dest.highlights,
    ...inclusions,
    ...getDestinationFaqs(dest).map((f) => f.answer),
  ]
    .join(" ")
    .toLowerCase();

  it("offers dressing assistance as a Grenada-only capability", () => {
    expect(hasDressingAssistance("grenada")).toBe(true);
    expect(inclusions).toContain("Dressing assistance");
    expect(getNotOffered("grenada")).not.toContain("Getting dressed");
    for (const slug of ["saint-lucia", "antigua", "barbados", "toronto", "guyana", "tobago"]) {
      expect(hasDressingAssistance(slug), slug).toBe(false);
      expect(getNotOffered(slug)).toContain("Getting dressed");
    }
  });

  it("carries no price for dressing assistance", () => {
    expect(offerText).not.toMatch(/dressing assistance[^.]*us\$/);
  });

  it("never offers seamstress, shuttle, breakfast, alcohol or hair", () => {
    for (const word of ["seamstress", "shuttle", "breakfast", "alcohol"]) {
      expect(offerText.includes(`no ${word}`) || !offerText.includes(word), word).toBe(true);
    }
    expect(inclusions).not.toContain("Hair");
    expect(inclusions).not.toContain("Seamstress");
    expect(inclusions).not.toContain("Shuttle");
    expect(inclusions).not.toContain("Alcohol");
  });

  it("does not cross-sell the Full Service territories on the Lite page", () => {
    const tierFaq = getDestinationFaqs(dest).find((f) =>
      f.question.includes("Full Service Glam Hub or a Glam Hub Lite"),
    )!;
    expect(tierFaq.answer).not.toMatch(/Full Service Glam Hubs/);
    expect(tierFaq.answer).not.toMatch(/Jamaica, Trinidad and Miami/);
  });
});
