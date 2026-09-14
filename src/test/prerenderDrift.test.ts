/**
 * The prerendered HTML is a second rendering surface. This test fails loudly
 * when it drifts from the data layer: hand-typed territory lists, hand-typed
 * prices, a single founder, or claims we removed from the React surface.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { FULL_SERVICE_NAMES, LITE_NAMES } from "@/data/hubTiers";

const SCRIPTS = [
  "scripts/prerender-bodies.ts",
  "scripts/prerender-routes.ts",
];

const read = (p: string) =>
  readFileSync(resolve(process.cwd(), p), "utf8");

const ALL_SCRIPTS = SCRIPTS.map(read).join("\n");

describe("prerendered surface does not drift from the data layer", () => {
  it("names both founders and never one alone", () => {
    const bodies = read("scripts/prerender-bodies.ts");
    expect(bodies).toContain("Gabrielle Waite and Kibwe McGann");
    expect(ALL_SCRIPTS).not.toMatch(/founded by Gabrielle Waite\b(?! and)/i);
    expect(ALL_SCRIPTS).not.toMatch(/booking director/i);
  });

  it("carries no unsubstantiated claim we removed from the React pages", () => {
    for (const phrase of [
      "The only glam service",
      "synced daily",
      "Real reviews",
      "Real Client",
      "fill quickly",
      "award winning",
      "award-winning",
      "Port of Spain to solve",
    ]) {
      expect(ALL_SCRIPTS.toLowerCase()).not.toContain(phrase.toLowerCase());
    }
  });

  it("uses no en dash or em dash in prose", () => {
    expect(ALL_SCRIPTS).not.toMatch(/[\u2013\u2014]/);
  });

  it("hand-types no territory list of operating hubs", () => {
    // A comma run of four or more known territory names is a hand-typed list.
    const names = [...FULL_SERVICE_NAMES, ...LITE_NAMES];
    const run = new RegExp(
      `(${names.join("|")}), (${names.join("|")}), (${names.join("|")}), (${names.join("|")})`,
    );
    expect(ALL_SCRIPTS).not.toMatch(run);
  });

  it("quotes no hand-typed price sentence", () => {
    // Two or more US$ figures inside one double-quoted string means the
    // sentence was typed rather than built from territoryPricing.ts.
    const quoted = ALL_SCRIPTS.match(/"[^"\n]*"/g) ?? [];
    const offenders = quoted.filter(
      (q) => (q.match(/US\$\d/g) ?? []).length >= 2,
    );
    expect(offenders).toEqual([]);
  });
});
