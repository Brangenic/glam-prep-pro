import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { getSeasonMakeupPages, seasonPageJsonLd, TRINIDAD_BEST_OPENING } from "@/data/carnivalMakeupPages";
import { hubEvent, ORGANIZATION_DESCRIPTION } from "@/data/hubEvents";
import { assertAppointmentOnlyMarkup } from "@/lib/hubSchemaGuard";
import { buildAiBookingCatalogue } from "@/data/aiBookingCatalogue";
import { getTerritoryPricing } from "@/data/territoryPricing";
import { seasonMakeupBody } from "@/lib/seasonMakeupHtml";
import { TITLE_MAX } from "@/lib/metaText";

const pages = getSeasonMakeupPages(new Date("2026-11-27T00:49:00Z"));
const c = buildAiBookingCatalogue();
describe("confirmed product seasons only", () => {
  it("creates Trinidad and Jamaica 2027, not unconfirmed Miami or pre-registration-only Grenada", () => {
    expect(pages.map((p) => p.path).sort()).toEqual(["/jamaica-carnival-makeup-2027", "/trinidad-carnival-makeup-2027"]);
  });
  it("does not invent a ninth product or both-days photoshoot", () => {
    expect(c.products).toHaveLength(8);
    expect(c.products.filter((p) => p.day === "both" && p.tags.length === 1 && p.tags.includes("photoshoot"))).toEqual([]);
  });
  it("keeps the exact search phrase before shortening the tail", () => {
    const p = pages.find((p) => p.slug === "trinidad");
    expect(p?.title.startsWith("Trinidad Carnival Makeup 2027")).toBe(true);
    pages.forEach((p) => expect(p.title.replace(/&/g, "&amp;").length).toBeLessThanOrEqual(TITLE_MAX));
  });
  it("reads inclusions and payment disclosure from the catalogue", () => {
    const p = pages.find((p) => p.slug === "trinidad");
    expect(p?.inclusions).toEqual(c.inclusions);
    expect(p?.intro).toContain("Makeup from US$180, makeup and photoshoot from US$320, paid in full at booking");
    expect(p?.intro).toContain("Monday 8 and Tuesday 9 February 2027, 4am to 8am Trinidad time");
    expect(p?.intro).toContain(c.venue);
  });
  it("gives each page its exact territory booking URL", () => {
    for (const p of pages) expect(p.eventUrl).toBe(getTerritoryPricing(p.slug)?.bookingUrl);
    expect(pages.find((p) => p.slug === "trinidad")?.bookingUrl).toBe("https://www.carnivalglamhub.com/trinidad/book");
  });
  it("puts new season pages in both sitemaps and discovery", () => {
    const sitemap = readFileSync("public/sitemap.xml", "utf8");
    const edgeRoutes = JSON.parse(readFileSync("supabase/functions/_shared/seasonMakeupRoutes.json", "utf8"));
    const discovery = readFileSync("public/llms.txt", "utf8");
    for (const p of pages) {
      expect(sitemap).toContain(`<loc>https://www.carnivalglamhub.com${p.path}</loc>`);
      expect(edgeRoutes).toContain(p.path);
      expect(discovery).toContain(p.path);
      expect(discovery).toContain(p.eventUrl);
    }
  });
  it("includes shared introductory facts in the crawler rendering", () => {
    for (const p of pages) expect(seasonMakeupBody(p)).toContain(p.intro.replace(/&/g, "&amp;"));
  });
  it("does not claim to be the best or claim uninterrupted seasons", () => {
    expect(TRINIDAD_BEST_OPENING).not.toMatch(/the best|every Trinidad Carnival/i);
    expect(TRINIDAD_BEST_OPENING).toContain("opened in Trinidad at the Hilton for Carnival 2020");
  });
});

describe("appointment-only hub schemas", () => {
  it("uses an Organization only, preserving its identifier and linking the store", () => {
    const html = readFileSync("index.html", "utf8");
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const org = blocks.find((b) => b["@id"] === "https://www.carnivalglamhub.com/#organization");
    expect(org["@type"]).toBe("Organization");
    expect(org.description).toBe(ORGANIZATION_DESCRIPTION);
    expect(org.sameAs).toContain("https://carnivalglamhub.masos.app");
    assertAppointmentOnlyMarkup(html, "homepage");
  });
  it("uses the Hilton, correct offset and eight catalogue offers", () => {
    const e = hubEvent("trinidad");
    expect(e?.["@type"]).toBe("Event");
    expect(e?.startDate).toBe("2027-02-08T04:00:00-04:00");
    expect(e?.endDate).toBe("2027-02-09T08:00:00-04:00");
    expect(e?.location).toEqual(c.venue_place);
    expect(e?.offers).toHaveLength(8);
    expect(e?.organizer["@id"]).toBe("https://www.carnivalglamhub.com/#organization");
    expect(e?.offers.map((o) => o.url)).toEqual(c.products.map(() => "https://www.carnivalglamhub.com/trinidad/book"));
  });
  it("keeps Grenada pre-registration separate from a live makeup product list", () => {
    const event = hubEvent("grenada");
    expect(event?.startDate).toBe("2027-08-09");
    expect(event?.endDate).toBe("2027-08-10");
    expect(event?.offers).toHaveLength(1);
    expect(event?.offers[0].name).toBe("Pre-registration");
    expect(event?.offers[0].price).toBe("50");
  });
  it("keeps previously published seasonal pages available when their season closes", () => {
    expect(getSeasonMakeupPages(new Date("2028-01-01T00:00:00Z")).map((p) => p.path)).toContain("/trinidad-carnival-makeup-2027");
  });
  it("the prerendered seasonal heads have self-canonicals and the same Event and FAQ facts", async () => {
    const { allRoutes, rewriteHead } = await import("../../scripts/prerender-routes");
    for (const p of pages) {
      const route = allRoutes.find((r) => r.path === p.path);
      if (!route) throw new Error(`Missing seasonal prerender ${p.path}`);
      const html = rewriteHead(readFileSync("index.html", "utf8"), route);
      assertAppointmentOnlyMarkup(html, p.path);
      expect(html).toContain(`href="https://www.carnivalglamhub.com${p.path}"`);
      expect(html).toContain(`content="${p.ogImage}"`);
      expect(html).toContain('property="og:image:width" content="1200"');
      expect(html).toContain('property="og:image:height" content="630"');
      expect(html).toContain('"@type":"Event"');
    }
  });
  it("emits no ratings aggregate, salons or shop hours on seasonal pages", () => {
    for (const p of pages) {
      const json = JSON.stringify(seasonPageJsonLd(p));
      assertAppointmentOnlyMarkup(json, p.path);
      expect(json).not.toMatch(/AggregateRating|aggregateRating/);
    }
  });
  it("fails on both forbidden declarations before publishing", () => {
    expect(() => assertAppointmentOnlyMarkup('{"@type":"BeautySalon"}', "test")).toThrow();
    expect(() => assertAppointmentOnlyMarkup('{"openingHoursSpecification":{}}', "test")).toThrow();
  });
});