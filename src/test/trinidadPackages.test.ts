import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { TRINIDAD_PACKAGES, resolveTrinidadPackage, packageJsonLd } from "@/data/trinidadPackages";
import { TRINIDAD_BOOK_CATALOGUE as C } from "@/data/trinidadBookPage";
import { packagePath } from "@/lib/trinidadPackageLinks";

describe("catalogue-derived dated Trinidad packages", () => {
  it("has one route per product, exactly eight and never both-days photoshoot", () => {
    expect(TRINIDAD_PACKAGES).toHaveLength(8);
    expect(TRINIDAD_PACKAGES.map((p) => p.product.id)).toEqual(C.products.map((p) => p.id));
    expect(resolveTrinidadPackage("photoshoot", "both-days-8-9-feb")).toBeUndefined();
    expect(resolveTrinidadPackage("foo", "bar")).toBeUndefined();
  });
  it("derives the day slug from catalogue dates rather than a dated table", () => {
    expect(packagePath({ id: "tue-makeup", day: "tuesday" }, [{ day: "tuesday", date: "2028-03-07", display: "Tuesday 7 March 2028" }])).toBe("/trinidad/book/makeup/tuesday-7-mar");
  });
  it("all prices, day selections and full dates match their catalogue product", () => {
    for (const p of TRINIDAD_PACKAGES) {
      expect(p.product.price).toBe(C.products.find((product) => product.id === p.product.id)?.price);
      expect(p.dates.map((d) => d.day)).toEqual(p.product.day === "both" ? ["monday", "tuesday"] : [p.product.day]);
      expect(p.h1).toContain(p.fullDate);
      expect(p.summary).toContain(p.fullDate);
      expect(p.product.web_url).toBe(p.url);
    }
  });
  it("titles and descriptions are unique, titles retain the full date under 60 characters", () => {
    expect(new Set(TRINIDAD_PACKAGES.map((p) => p.title)).size).toBe(8);
    expect(new Set(TRINIDAD_PACKAGES.map((p) => p.description)).size).toBe(8);
    for (const p of TRINIDAD_PACKAGES) { expect(p.title.length).toBeLessThanOrEqual(60); expect(p.title).toContain(p.fullDate); }
  });
  it("offers use USD, package URLs and Trinidad time, with availability per booked day", () => {
    const p = TRINIDAD_PACKAGES.find((p) => p.product.id === "tue-makeup");
    if (!p) throw new Error("Missing Tuesday makeup");
    const offer = packageJsonLd(p)[0];
    expect(offer).toMatchObject({ "@type": "Offer", price: "210", priceCurrency: "USD", url: p.url, availability: "https://schema.org/InStock" });
    expect(offer.itemOffered?.isRelatedTo?.[0].startDate).toBe("2027-02-09T04:00:00-04:00");
    expect(packageJsonLd(p, { tuesday: [{ time: "04:00", spots_left: 0 }] })[0].availability).toBe("https://schema.org/SoldOut");
    expect(JSON.stringify(packageJsonLd(p))).not.toMatch(/AggregateRating|"@type":"Review"/);
  });
  it("each prerendered package head and body reads the same page data", async () => {
    const { allRoutes, rewriteHead } = await import("../../scripts/prerender-routes");
    const { trinidadPackageBody } = await import("../../scripts/prerender-bodies");
    for (const p of TRINIDAD_PACKAGES) {
      const r = allRoutes.find((r) => r.path === p.path);
      if (!r) throw new Error(`Missing prerender ${p.path}`);
      const html = rewriteHead(readFileSync("index.html", "utf8"), r);
      expect(html).toContain(`<title>${p.title}</title>`);
      expect(html).toContain(`content="${p.description}"`);
      expect(html).toContain(`href="${p.url}"`);
      const body = trinidadPackageBody(p);
      expect(body).toContain(p.intro);
      expect(body).toContain(p.summary.replace(/&/g, "&amp;"));
      expect(body).toContain("Trinidad time");
    }
  });
});