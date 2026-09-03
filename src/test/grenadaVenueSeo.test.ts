import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import {
  GRENADA_VENUE_NAME,
  GRENADA_VENUE_NOTE,
  GRENADA_ROUTE_NOTE,
  GRENADA_VENUE_FAQ,
  GRENADA_ROUTE_FAQ,
  GRENADA_INCLUSIONS_SENTENCE,
} from "@/data/hubTiers";
import { DESTINATIONS, getDestinationFaqs } from "@/data/destinations";

const read = (p: string) => readFileSync(resolve(p), "utf8");
const grenada = DESTINATIONS.find((d) => d.slug === "grenada")!;

// Facts confirmed by Kibwe on 3 September 2026, and nothing beyond them.
const BANNED = [
  /\bstar\b/i,
  /minutes'? (walk|drive)/i,
  /\bmiles?\b/i,
  /\bshuttle\b/i,
  /street address/i,
];

describe("Grenada venue facts", () => {
  it("holds the two confirmed facts in one place", () => {
    expect(GRENADA_VENUE_NAME).toBe("the Radisson Hotel");
    expect(GRENADA_ROUTE_NOTE).toBe("The band route starts outside the hotel.");
    expect(GRENADA_VENUE_NOTE).toBe(
      "Hosted at the Radisson Hotel, central in Grenada, with the band route starting outside the hotel.",
    );
  });

  it("invents nothing on the destination copy", () => {
    const copy = `${grenada.longDescription} ${GRENADA_VENUE_FAQ.answer} ${GRENADA_ROUTE_FAQ.answer}`;
    for (const re of BANNED) expect(copy).not.toMatch(re);
    expect(copy).not.toContain("—");
  });

  it("puts the venue and the route on the page copy", () => {
    expect(grenada.longDescription).toContain("Radisson Hotel");
    expect(grenada.longDescription).toContain("band route starting outside the hotel");
  });
});

describe("Grenada answer engine FAQs", () => {
  const faqs = getDestinationFaqs(grenada);

  it("answers the five questions self-containedly", () => {
    const qs = faqs.map((f) => f.question);
    expect(qs).toContain(GRENADA_VENUE_FAQ.question);
    expect(qs).toContain(GRENADA_ROUTE_FAQ.question);
    expect(qs).toContain("When is Spicemas 2027?");
    expect(qs).toContain("How do I secure my spot for Spicemas 2027?");
    expect(qs).toContain("What is included at the Grenada Glam Hub?");
  });

  it("never quotes a Grenada service price", () => {
    const answers = faqs.map((f) => f.answer).join(" ");
    const figures = answers.match(/US\$\d+/g) ?? [];
    expect(new Set(figures)).toEqual(new Set(["US$50"]));
  });

  it("keeps the Lite inclusions and the not-offered list straight", () => {
    expect(GRENADA_INCLUSIONS_SENTENCE).toContain("dressing assistance");
    expect(GRENADA_INCLUSIONS_SENTENCE).toContain("no seamstress");
    expect(GRENADA_INCLUSIONS_SENTENCE).toContain("no hair");
  });
});

describe("Grenada crawler surfaces", () => {
  it("ships the venue and route in the prerender scripts and llms.txt", () => {
    expect(read("scripts/prerender-routes.ts")).toContain("GRENADA_VENUE_NOTE");
    expect(read("scripts/prerender-bodies.ts")).toContain("GRENADA_ROUTE_FAQ");
    const llms = read("public/llms.txt");
    expect(llms).toContain(
      "Hosted at the Radisson Hotel, central in Grenada, with the band route starting outside the hotel.",
    );
  });

  it("keeps the Grenada metadata inside search limits", () => {
    expect(grenada.metaTitle!.length).toBeLessThanOrEqual(60);
    expect(grenada.metaDescription!.length).toBeLessThanOrEqual(160);
    expect(grenada.metaTitle).toMatch(/Spicemas 2027/);
    expect(grenada.metaDescription).toMatch(/9 and Tuesday 10 August/);
  });

  it("carries the venue and route into the bot knowledge pack", () => {
    const pack = read("supabase/functions/chat/knowledge.json");
    expect(pack).toContain("band route starting outside the hotel");
    expect(pack).toContain("Radisson Hotel");
  });
});
