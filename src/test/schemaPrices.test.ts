import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  makeupOnlyRange,
  schemaPriceRange,
} from "@/data/territoryPricing";

/**
 * Guards the price claims in the head of `index.html` against the product
 * lists in `src/data/territoryPricing.ts`. If a price changes there and
 * nobody updates the schema, this test fails and names the file to edit.
 */
const INDEX_HTML = "index.html";

const html = readFileSync(resolve(process.cwd(), INDEX_HTML), "utf8");

describe("index.html schema prices match territoryPricing.ts", () => {
  it("priceRange is the real computed range with a plain hyphen", () => {
    const expected = schemaPriceRange();
    const found = /"priceRange":\s*"([^"]+)"/.exec(html)?.[1];
    expect(
      found,
      `No "priceRange" found in ${INDEX_HTML}.`,
    ).toBeDefined();
    expect(
      found,
      `${INDEX_HTML} claims priceRange "${found}" but territoryPricing.ts computes "${expected}". Update ${INDEX_HTML}.`,
    ).toBe(expected);
    expect(found).not.toContain("\u2013");
    expect(found).not.toContain("\u2014");
  });

  it("the makeup Offer minPrice and maxPrice match single-day makeup only", () => {
    const { min, max } = makeupOnlyRange();
    const spec = /"minPrice":\s*"(\d+)",\s*"maxPrice":\s*"(\d+)"/.exec(html);
    expect(spec, `No makeup priceSpecification found in ${INDEX_HTML}.`).not.toBeNull();
    expect(
      Number(spec?.[1]),
      `${INDEX_HTML} claims makeup minPrice ${spec?.[1]} but the real floor is ${min}. Update ${INDEX_HTML}.`,
    ).toBe(min);
    expect(
      Number(spec?.[2]),
      `${INDEX_HTML} claims makeup maxPrice ${spec?.[2]} but the real ceiling is ${max}. Update ${INDEX_HTML}.`,
    ).toBe(max);
  });

  it("the retired US$160 floor and US$2,000 ceiling are gone", () => {
    expect(html).not.toContain("2000");
    expect(html).not.toContain("2,000");
  });
});
