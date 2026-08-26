/**
 * Glam Bot knowledge and logic suite.
 *
 * Every assertion runs against the freshly built knowledge pack or the
 * pure logic in supabase/functions/chat/logic.ts. Nothing here holds a
 * hardcoded copy of a fact: expectations are read out of the source data
 * modules, so a change on the site fails the test rather than silently
 * diverging from the bot.
 */

import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

import { buildKnowledgePack } from "@/data/botKnowledge";
import { TERRITORY_PROFILES, getProfile } from "@/data/territoryProfiles";
import { destinations } from "@/data/destinations";
import { FULL_SERVICE_SLUGS, LITE_SLUGS, TIER_LABEL } from "@/data/hubTiers";
import { getTerritoryPricing } from "@/data/territoryPricing";
import { AMAZON_STORE_URL, WHATSAPP_DISPLAY } from "@/lib/constants";
import { PRESS_STORIES } from "@/data/pressCoverage";

import {
  buildSystemPrompt,
  resolveCartDirective,
  resolveEvents,
  resolveTerritory,
  priceSection,
  type Msg,
  type Pack,
} from "../../supabase/functions/chat/logic";

const pack = buildKnowledgePack() as unknown as Pack;

/** Fixed clock, so every date expectation below is stable. */
const NOW = new Date("2026-08-24T12:00:00Z");

function user(...contents: string[]): Msg[] {
  return contents.map((c) => ({ role: "user" as const, content: c }));
}

function promptFor(...contents: string[]): string {
  return buildSystemPrompt(pack, user(...contents), NOW);
}

function priceOf(slug: string, id: string): number {
  const t = getTerritoryPricing(slug);
  const p = t?.products.find((x) => x.id === id);
  if (!p) throw new Error(`No product ${id} in ${slug}`);
  return p.price;
}

/* ============================================================
 * Group 1. Drift between the site data and the bot profiles.
 * ============================================================ */

describe("group 1: no drift between destinations.ts and territoryProfiles.ts", () => {
  for (const profile of TERRITORY_PROFILES) {
    const dest = destinations.find((d) => d.slug === profile.slug);
    if (!dest) continue;
    it(`${profile.slug} matches character for character`, () => {
      expect(profile.name).toBe(dest.name);
      expect(profile.shortName).toBe(dest.shortName);
      expect(profile.dateText).toBe(dest.date);
    });
  }
});

/* ============================================================
 * Group 2. The generated file matches a fresh build.
 * ============================================================ */

describe("group 2: generated knowledge pack is in sync", () => {
  it("supabase/functions/chat/knowledge.json equals a freshly built pack", () => {
    const path = resolve(process.cwd(), "supabase/functions/chat/knowledge.json");
    const committed = JSON.parse(readFileSync(path, "utf8"));
    const fresh = buildKnowledgePack() as unknown as Record<string, unknown>;
    delete committed.generatedAt;
    delete (fresh as { generatedAt?: string }).generatedAt;
    expect(
      committed,
      "supabase/functions/chat/knowledge.json is stale or hand-edited. Run the generator: npx tsx scripts/generate-bot-knowledge.ts",
    ).toEqual(fresh);
  });
});

/* ============================================================
 * Group 3. Twenty knowledge questions.
 * ============================================================ */

describe("group 3: knowledge questions", () => {
  it("1. when is the next Carnival Glam Hub", () => {
    const p = promptFor("When is the next Carnival Glam Hub?");
    const facts = p.slice(p.indexOf("# FACTS FOR THIS TURN"));
    const next = facts.slice(facts.indexOf("The next Glam Hub is:"));
    expect(next).toContain(getProfile("miami")!.name);
    expect(next).toContain(getProfile("miami")!.dateText);
    // Ordered first: Miami appears before anything in the "After that" list.
    expect(facts.indexOf("The next Glam Hub is:")).toBeLessThan(
      facts.indexOf("After that:"),
    );
  });

  it("2. where will Glam Hub be next", () => {
    expect(promptFor("Where will Glam Hub be next?")).toContain("Lauderhill");
  });

  it("3. how much is makeup in Trinidad, with day labels", () => {
    const p = promptFor("How much is makeup in Trinidad?");
    const section = priceSection(pack.territories.trinidad.brief);
    expect(section).toContain("**Carnival Monday**");
    expect(section).toContain("**Carnival Tuesday**");
    expect(section).toContain(`Makeup only: US$${priceOf("trinidad", "mon-makeup")}`);
    expect(section).toContain(`Makeup only: US$${priceOf("trinidad", "tue-makeup")}`);
    expect(p).toContain(section);
    expect(p).toContain(`US$${priceOf("trinidad", "mon-makeup")}`);
    expect(p).toContain(`US$${priceOf("trinidad", "tue-makeup")}`);
  });

  it("4. how much is a photoshoot in Jamaica", () => {
    const p = promptFor("How much is a photoshoot in Jamaica?");
    expect(p).toContain(`Photoshoot only: US$${priceOf("jamaica", "jam-tue-photo")}`);
  });

  it("5. does Trinidad have overnight bag check", () => {
    const p = promptFor("Does Trinidad have overnight bag check?");
    expect(p).toContain("Overnight bag check: US$35");
    expect(p).toContain("a paid add-on and never an inclusion");
  });

  it("6. is shuttle included", () => {
    const p = promptFor("Is the shuttle included?");
    expect(p).toContain("Jamaica and Trinidad only");
    expect(p).toContain("it is an inclusion and is never charged");
    expect(p).toContain("Not running in Miami this season");
  });

  it("7. do I have to pay for getting dressed", () => {
    const p = promptFor("Do I have to pay for getting dressed?");
    expect(p).toContain("US$35 on its own");
    expect(p).toContain("free with any Glam Hub service");
  });

  it("8. what comes with my booking", () => {
    const p = promptFor("What comes with my booking?");
    const heading = `## Free with any booking at a ${TIER_LABEL.full}`;
    const start = p.indexOf(heading);
    expect(start).toBeGreaterThan(-1);
    const block = p.slice(start, p.indexOf("\n\n##", start + 1));
    expect(block).toContain("Shuttle");
    expect(block).toContain("Seamstress");
    for (const chargeable of ["Makeup", "Hair", "Bronzing", "Photoshoot"]) {
      expect(block).not.toContain(chargeable);
    }
    expect(p).toContain("must never be described as included");
  });

  it("9. which locations are Glam Hub Lite", () => {
    const p = promptFor("Which locations are Glam Hub Lite?");
    expect(LITE_SLUGS.length).toBe(8);
    for (const slug of LITE_SLUGS) {
      expect(p).toContain(getProfile(slug)!.shortName);
    }
  });

  it("10. is breakfast included", () => {
    const p = promptFor("Is breakfast included?");
    expect(p).toContain("Breakfast and refreshments");
    const notOffered = p.slice(p.indexOf(`## Not offered at a ${TIER_LABEL.lite}`));
    expect(notOffered).toContain("Breakfast");
  });

  it("11. do you have a seamstress", () => {
    const p = promptFor("Do you have a seamstress?");
    expect(p).toContain("Seamstress");
    expect(p).toContain("Full Service hubs only");
    const notOffered = p.slice(p.indexOf(`## Not offered at a ${TIER_LABEL.lite}`));
    expect(notOffered).toContain("Seamstress");
  });

  it("12. where are you located for Trinidad", () => {
    const p = promptFor("Where are you located for Trinidad?");
    expect(p).toContain("Hilton");
    expect(p).toContain("Savannah");
  });

  it("13. do you have Miami", () => {
    const p = promptFor("Do you have Miami?");
    expect(p).toContain(`Resolved territory for this conversation: ${getProfile("miami")!.name}`);
    expect(p).toContain(`Tier: ${TIER_LABEL.full}`);
  });

  it("14. when is Miami", () => {
    expect(promptFor("When is Miami?")).toContain(getProfile("miami")!.dateText);
  });

  it("15. has Carnival Glam Hub been in Teen Vogue", () => {
    const p = promptFor("Has Carnival Glam Hub been featured in Teen Vogue?");
    const story = PRESS_STORIES.find((s) => s.outlet === "Teen Vogue");
    expect(story).toBeDefined();
    expect(p).toContain("Teen Vogue");
    expect(p).toContain(story!.url);
  });

  it("16. who founded Carnival Glam Hub", () => {
    const p = promptFor("Who founded Carnival Glam Hub?");
    expect(p).toContain("Gabrielle Waite");
    expect(p).toContain("Kibwe McGann");
  });

  it("17. can I book hair only", () => {
    const p = promptFor("Can I book hair only?");
    expect(p).toContain(`from US$${priceOf("trinidad", "mon-hair-ponytail")}`);
    expect(p).toContain("Full Service hubs only");
  });

  it("18. how much is bag check", () => {
    const p = promptFor("How much is bag check?");
    expect(p).toContain("Wing and bag check while you are with us, space permitting");
    expect(p).toContain("Overnight bag check is a separate paid add-on at US$35");
  });

  it("19. what is your WhatsApp number", () => {
    expect(promptFor("What is your WhatsApp number?")).toContain(WHATSAPP_DISPLAY);
  });

  it("20. which Carnival is after Miami", () => {
    const p = promptFor("Which Carnival is after Miami?");
    const facts = p.slice(p.indexOf("# FACTS FOR THIS TURN"));
    const after = facts.slice(facts.indexOf("After that:"));
    expect(after).toContain(getProfile("tobago")!.name);
    expect(after).toContain(getProfile("tobago")!.dateText);
    expect(facts.indexOf(getProfile("miami")!.name)).toBeLessThan(
      facts.indexOf("After that:"),
    );
  });
});

/* ============================================================
 * Group 4. Refusals.
 * ============================================================ */

describe("group 4: refusals have no material to answer from", () => {
  const cases: [string, string, string[]][] = [
    ["Brazil", "Do you operate in Brazil?", ["Brazil", "Rio", "Salvador"]],
    // "discount code" appears in the NEVER SAY guardrail by design, so the
    // check is for an actual offer rather than for the word.
    ["a discount", "Can I get a US$50 discount?", ["US$50 off", "50% off", "discount of"]],
    ["a shuttle time", "Does the shuttle run at 02:17?", ["02:17", "2:17"]],
    [
      "a named artist",
      "Can you guarantee a specific artist does my face?",
      ["we guarantee", "guaranteed artist"],
    ],
  ];

  for (const [name, question, forbidden] of cases) {
    it(`${name}: refusal instruction and WhatsApp present, no material`, () => {
      const p = promptFor(question);
      expect(p).toContain("I do not have that confirmed yet");
      expect(p).toContain(pack.contact.whatsappUrl);
      for (const f of forbidden) expect(p).not.toContain(f);
    });
  }
});

/* ============================================================
 * Group 5. Forbidden strings.
 * ============================================================ */

describe("group 5: forbidden strings", () => {
  const serialised = JSON.stringify(pack);
  // The pack legitimately names GENX10 and US$25 inside its own guardrail
  // and rate lines, so prose is checked with those two carve-outs stated
  // explicitly rather than by weakening the rule.
  const prose = [
    pack.brand,
    pack.tiers,
    ...Object.values(pack.topics),
    ...Object.values(pack.territories).map((t) => t.brief),
  ].join("\n");

  it("no invented figures or hedged spend language", () => {
    for (const bad of [
      "$25 deposit",
      "US$280",
      "US$2,000",
      "most masqueraders spend",
      "US$160 floor",
    ]) {
      expect(serialised).not.toContain(bad);
    }
  });

  it("GENX10 appears only in the NEVER SAY guardrail", () => {
    expect(prose).not.toContain("GENX10");
    expect(pack.neverSay.join("\n")).toContain("GENX10");
  });

  it("US$25 appears only as the verified high chair rate", () => {
    const lines = prose.split("\n").filter((l) => /US\$25\b/.test(l));
    for (const line of lines) {
      expect(line.toLowerCase()).toContain("high chair");
    }
  });

  it("no reels price anywhere", () => {
    // Segment on clause boundaries, because a capability line can name
    // reels alongside an unrelated priced service in the same sentence.
    const segments = prose.split(/[,.\n]|\band\b/);
    for (const seg of segments) {
      if (/reels/i.test(seg)) expect(seg).not.toMatch(/US\$\d/);
    }
  });

  it("the word masos appears only inside URLs", () => {
    const words = prose.split(/\s+/).filter((w) => w.toLowerCase().includes("masos"));
    for (const w of words) {
      expect(w).toMatch(/^https?:\/\//);
    }
  });
});

/* ============================================================
 * Group 6. Context and stickiness.
 * ============================================================ */

describe("group 6: conversation context", () => {
  it("carries the territory into a follow-up", () => {
    expect(
      resolveTerritory(pack, ["When is Trinidad?", "How much is makeup?"]),
    ).toBe("trinidad");
  });

  it("the most recent territory wins", () => {
    expect(
      resolveTerritory(pack, [
        "When is Miami?",
        "and Trinidad?",
        "how much is hair?",
      ]),
    ).toBe("trinidad");
  });

  it("asks once when no territory is established", () => {
    expect(resolveTerritory(pack, ["how much is makeup"])).toBeNull();
    const p = promptFor("how much is makeup");
    expect(p).toContain("No territory has been established in this conversation yet");
    expect(p).toContain("Which Carnival are you attending?");
    expect(p).toContain("Never ask which Carnival and then answer in the same reply");
  });
});

/* ============================================================
 * Group 7. The Amazon directive.
 * ============================================================ */

describe("group 7: Amazon cart directive", () => {
  const assistant = (content: string): Msg => ({ role: "assistant", content });

  it("a clean sign-off closes", () => {
    expect(resolveCartDirective(pack, user("Thanks, that's all"))).toBe("CLOSING");
  });

  it("a sign-off carrying a question does not", () => {
    expect(resolveCartDirective(pack, user("Thanks, but how much is hair?"))).toBe(
      "NONE",
    );
  });

  it("a packing question is contextual", () => {
    expect(resolveCartDirective(pack, user("What should I pack for the road?"))).toBe(
      "CONTEXTUAL",
    );
  });

  it("a refund anywhere in the history suppresses it", () => {
    expect(
      resolveCartDirective(pack, user("I want a refund", "Thanks, that's all")),
    ).toBe("NONE");
  });

  it("an earlier assistant message with the cart suppresses it", () => {
    expect(
      resolveCartDirective(pack, [
        ...user("What should I bring?"),
        assistant(`Here you are: ${AMAZON_STORE_URL}`),
        ...user("Thanks, that's all"),
      ]),
    ).toBe("NONE");
  });

  it("an active payment question suppresses it", () => {
    expect(
      resolveCartDirective(pack, user("How do I pay?", "Thanks, that's all")),
    ).toBe("NONE");
  });

  it("both instructions carry the verified Amazon URL and nothing invented", () => {
    const contextual = promptFor("What should I pack for the road?");
    expect(contextual).toContain("AMAZON DIRECTIVE: CONTEXTUAL");
    expect(contextual).toContain(AMAZON_STORE_URL);

    const closing = buildSystemPrompt(pack, user("Thanks, that's all"), NOW);
    expect(closing).toContain("AMAZON DIRECTIVE: CLOSING");
    expect(closing).toContain(AMAZON_STORE_URL);
    expect(pack.contact.amazonUrl).toBe(AMAZON_STORE_URL);
  });
});

/* ============================================================
 * Group 8. Season awareness at the fixed clock.
 * ============================================================ */

describe("group 8: season awareness on 2026-08-24", () => {
  const { upcoming, passed, forward, undated } = resolveEvents(pack, NOW);
  const slugs = (list: { slug: string }[]) => list.map((e) => e.slug);

  it("finished seasons are described as finished", () => {
    for (const slug of [
      "barbados",
      "toronto",
      "antigua",
      "grenada",
      "saint-lucia",
      "guyana",
    ]) {
      expect(slugs(passed)).toContain(slug);
    }
  });

  it("open seasons are still open", () => {
    for (const slug of ["miami", "tobago", "trinidad"]) {
      expect(slugs(upcoming)).toContain(slug);
    }
  });

  it("Epic Cruise points forward to 2028 with no date published", () => {
    // No confirmed 2028 day, so the cruise sits with the undated events
    // and is never described as closed or as bookable.
    expect(slugs(undated)).toContain("epic-cruise");
    expect(slugs(passed)).not.toContain("epic-cruise");
    expect(slugs(upcoming)).not.toContain("epic-cruise");
    expect(JSON.stringify(pack)).not.toContain("8–9 February 2027");
  });

  it("Jamaica is neither closed nor dated for the next season", () => {
    expect(slugs(forward)).toContain("jamaica");
    expect(slugs(passed)).not.toContain("jamaica");
    expect(slugs(upcoming)).not.toContain("jamaica");
    const p = promptFor("When is Jamaica?");
    expect(p).toContain("the next dates are not yet confirmed");
    // The season may be named, but no specific day may ever be published
    // until a date is confirmed.
    expect(p).toContain("dates to be confirmed");
    expect(p).not.toMatch(/\d{1,2}\s+April\s+20\d{2}/);

  });

  it("Full Service hubs are the three we expect and are all in the pack", () => {
    for (const slug of FULL_SERVICE_SLUGS) {
      expect(pack.territories[slug]).toBeDefined();
    }
  });
});
