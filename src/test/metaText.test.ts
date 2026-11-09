/**
 * Title fitting must never serve a title that ends on a dangling
 * conjunction. The Trinidad 2027 guide was served live ending in "&"
 * because the ampersand was not in the trailing strip.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fitTitle, stripDanglingEnd, isTitleTrimmed, TITLE_MAX } from "@/lib/metaText";

const STORED = "Trinidad Carnival 2027: Dates, Bands, Costumes & First-Timer Guide";
const SLUG = "ultimate-guide-to-trinidad-carnival-2026-mas-bands-dates-insider-tips";
const OVERRIDE = "Trinidad Carnival 2027 Guide: Dates, Bands, Costumes";

describe("fitTitle dangling conjunctions", () => {
  it("no longer leaves the stored Trinidad guide title ending in an ampersand", () => {
    expect(fitTitle(STORED)).toBe("Trinidad Carnival 2027: Dates, Bands, Costumes");
  });

  it.each(["&", "and", "or", "plus", "with", "the", "And", "THE"])("strips a trailing %s", (word) => {
    expect(stripDanglingEnd(`Bands, Costumes ${word}`)).toBe("Bands, Costumes");
  });

  it("strips punctuation, then the conjunction, then what the conjunction left, repeatedly", () => {
    expect(stripDanglingEnd("Dates, Bands, and the, ")).toBe("Dates, Bands");
    expect(stripDanglingEnd("Costumes & | with -")).toBe("Costumes");
  });

  it("leaves real words alone, including ones that end in a conjunction", () => {
    expect(stripDanglingEnd("Glam Brand")).toBe("Glam Brand");
    expect(stripDanglingEnd("Road Weather")).toBe("Road Weather");
    expect(stripDanglingEnd("The")).toBe("The");
  });

  it("never serves a fitted long title ending in a conjunction", () => {
    const long = "Carnival Makeup and Hair Guide for Masqueraders Who Want Glam and Comfort with the Best";
    const fitted = fitTitle(long);
    expect(fitted.length).toBeLessThanOrEqual(TITLE_MAX);
    expect(fitted).not.toMatch(/\s(?:&|and|or|plus|with|the)$/i);
  });

  it("reports whether a title is trimmed", () => {
    expect(isTitleTrimmed(STORED)).toBe(true);
    expect(isTitleTrimmed(OVERRIDE)).toBe(false);
  });
});

describe("Trinidad 2027 guide title override", () => {
  it("fits intact, with no trimming", () => {
    expect(fitTitle(OVERRIDE)).toBe(OVERRIDE);
  });

  it("is the same on the runtime page and in the prerender", () => {
    const entry = new RegExp(`"${SLUG}":\\s*"([^"]+)"`);
    const runtime = readFileSync(resolve("src/pages/BlogPost.tsx"), "utf8").match(entry)?.[1];
    const prerender = readFileSync(resolve("scripts/prerender-blog-meta.ts"), "utf8").match(entry)?.[1];
    expect(runtime).toBe(OVERRIDE);
    expect(prerender).toBe(OVERRIDE);
  });
});
