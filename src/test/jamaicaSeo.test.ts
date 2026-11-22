/**
 * /jamaica, Jamaica Carnival 2027. Head, answer-first content, FAQ and
 * JSON-LD all come from src/data/jamaicaPage.ts, which reads the data
 * layer. These tests pin the owner's facts and the schema shape.
 */
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

import {
  JAMAICA_EVENT_URL,
  JAMAICA_FAQ,
  JAMAICA_H1,
  JAMAICA_HERO_ALT,
  JAMAICA_HERO_IMAGE,
  JAMAICA_HERO_SRCSET,
  JAMAICA_OG_IMAGE,
  JAMAICA_PHOTOS,
  JAMAICA_LLMS_SECTION,
  JAMAICA_META_DESCRIPTION,
  JAMAICA_META_TITLE,
  JAMAICA_SECTIONS,
  jamaicaJsonLd,
} from "@/data/jamaicaPage";
import { getTerritoryPricing } from "@/data/territoryPricing";
import { destinations, getDestinationFaqs } from "@/data/destinations";
const getDestination = (slug: string) => destinations.find((d) => d.slug === slug);
import { getSeasonNotice, seasonNoticeText } from "@/data/blogSeasonNotices";

const EVENT = "https://carnivalglamhub.masos.app/events/0ad062ce-d1e0-4838-aeaf-f418ed526440";
const read = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8");

describe("Jamaica head", () => {
  it("targets Jamaica Carnival 2027 makeup in Kingston within length limits", () => {
    expect(JAMAICA_META_TITLE).toContain("Jamaica Carnival 2027");
    expect(JAMAICA_META_TITLE).toContain("Kingston");
    expect(JAMAICA_META_TITLE.length).toBeLessThan(60);
    expect(JAMAICA_META_DESCRIPTION.length).toBeLessThan(155);
    expect(JAMAICA_META_DESCRIPTION).toContain("Sunday 4 April 2027");
    expect(JAMAICA_H1).toContain("Jamaica Carnival 2027");
  });

  it("is the same on the React page and in the prerender", () => {
    expect(getDestination("jamaica")?.metaTitle).toBe(JAMAICA_META_TITLE);
    expect(getDestination("jamaica")?.metaDescription).toBe(JAMAICA_META_DESCRIPTION);
    const routes = read("scripts/prerender-routes.ts");
    expect(routes).toMatch(/path: "\/jamaica",[\s\S]{0,120}title: JAMAICA_META_TITLE,\s*description: JAMAICA_META_DESCRIPTION/);
  });
});

describe("Jamaica content", () => {
  it("books straight into the Jamaica MasOS event", () => {
    expect(JAMAICA_EVENT_URL).toBe(EVENT);
  });

  it("lists every Jamaica price from territoryPricing, including the Gabby Glam Team", () => {
    const text = JAMAICA_SECTIONS.map((s) => [s.a, ...(s.bullets ?? [])].join(" ")).join(" ");
    for (const p of getTerritoryPricing("jamaica")!.products) {
      expect(text).toContain(`${p.label}: US$${p.price}`);
    }
    expect(text).toContain("Gabby Glam Team makeup only: US$250");
  });

  it("has a How the morning works section", () => {
    expect(JAMAICA_SECTIONS.some((s) => /morning work/i.test(s.q))).toBe(true);
  });

  it("answers the eight FAQ questions the owner listed, and the page uses them", () => {
    expect(JAMAICA_FAQ).toHaveLength(8);
    expect(JAMAICA_FAQ[0].a.startsWith("Jamaica Carnival 2027 is on Sunday 4 April 2027")).toBe(true);
    expect(JAMAICA_FAQ.find((f) => /shuttle/i.test(f.q))!.a.startsWith("Yes")).toBe(true);
    expect(JAMAICA_FAQ.find((f) => /transfer/i.test(f.q))!.a).toContain("12 months");
    expect(JAMAICA_FAQ.find((f) => /arrive/i.test(f.q))!.a).toContain("30 minutes");
    expect(JAMAICA_FAQ.find((f) => /times are available/i.test(f.q))!.a).toContain(
      "Appointment start times run from 4:00am to 12:00 noon on Sunday 4 April 2027.",
    );
    expect(JAMAICA_FAQ.find((f) => /where is/i.test(f.q))!.a).toContain(
      "The Jamaica Pegasus Hotel, 81 Knutsford Boulevard, New Kingston, Kingston 5, Jamaica. The hotel is next to Emancipation Park.",
    );
    const d = getDestination("jamaica")!;
    expect(getDestinationFaqs(d).map((f) => f.question)).toEqual(JAMAICA_FAQ.map((f) => f.q));
  });

  it("never names J'ouvert, an em dash or the platform", () => {
    const all = [
      JAMAICA_META_TITLE,
      JAMAICA_META_DESCRIPTION,
      ...JAMAICA_SECTIONS.flatMap((s) => [s.q, s.a, ...(s.bullets ?? [])]),
      ...JAMAICA_FAQ.flatMap((f) => [f.q, f.a]),
    ].join(" ");
    expect(all).not.toMatch(/j.?ouvert/i);
    expect(all).not.toContain("\u2014");
    expect(all).not.toMatch(/masos/i);
  });
});

describe("Jamaica JSON-LD", () => {
  const ld = jamaicaJsonLd({ image: "https://www.carnivalglamhub.com/x.jpg" });

  it("is a valid Event on 4 April 2027 at the Jamaica Pegasus Hotel with USD offers to the event", () => {
    const e = ld.event as any;
    expect(e["@context"]).toBe("https://schema.org");
    expect(e["@type"]).toBe("Event");
    expect(e.startDate).toBe("2027-04-04T04:00:00-05:00");
    expect(e.endDate).toBe("2027-04-04T12:00:00-05:00");
    expect(e.location.name).toBe("The Jamaica Pegasus Hotel");
    expect(e.location.address).toEqual({
      "@type": "PostalAddress",
      streetAddress: "81 Knutsford Boulevard",
      addressLocality: "Kingston",
      addressRegion: "Kingston 5",
      addressCountry: "JM",
    });
    expect(e.location.geo).toEqual({ "@type": "GeoCoordinates", latitude: 18.0025, longitude: -76.7878 });
    expect(e.offers).toHaveLength(getTerritoryPricing("jamaica")!.products.length);
    for (const o of e.offers) {
      expect(o.priceCurrency).toBe("USD");
      expect(o.url).toBe(EVENT);
      expect(Number(o.price)).toBeGreaterThan(0);
    }
  });

  it("describes the Kingston hub and the breadcrumb", () => {
    expect((ld.business as any)["@type"]).toBe("BeautySalon");
    expect((ld.business as any).address.streetAddress).toBe("81 Knutsford Boulevard");
    expect((ld.business as any).geo.latitude).toBe(18.0025);
    expect((ld.business as any).openingHoursSpecification).toMatchObject({
      opens: "04:00",
      closes: "12:00",
      validFrom: "2027-04-04",
      validThrough: "2027-04-04",
    });
    expect((ld.business as any).priceRange).toBe("US$120-US$440");
    const crumbs = (ld.breadcrumb as any).itemListElement;
    expect(crumbs.at(-1).item).toBe("https://www.carnivalglamhub.com/jamaica");
  });

  it("FAQPage matches the visible FAQ word for word", () => {
    const f = ld.faq as any;
    expect(f["@type"]).toBe("FAQPage");
    expect(f.mainEntity.map((q: any) => q.name)).toEqual(JAMAICA_FAQ.map((x) => x.q));
    expect(f.mainEntity.map((q: any) => q.acceptedAnswer.text)).toEqual(JAMAICA_FAQ.map((x) => x.a));
  });

  it("serialises to valid JSON", () => {
    for (const block of Object.values(ld)) expect(() => JSON.parse(JSON.stringify(block))).not.toThrow();
  });
});

describe("Jamaica photos", () => {
  const exists = (p: string) => existsSync(resolve(process.cwd(), "public", p.replace(/^\//, "")));

  it("uses the owner supplied Glam Hub Jamaica hero, not the old overlay photo", () => {
    expect(JAMAICA_HERO_IMAGE).toBe("/images/destinations/jamaica-glam-hub-feathers-1280.webp");
    expect(getDestination("jamaica")?.image).toBe(JAMAICA_HERO_IMAGE);
    expect(getDestination("jamaica")?.imageSrcSet).toBe(JAMAICA_HERO_SRCSET);
    for (const src of JAMAICA_HERO_SRCSET.split(",").map((x) => x.trim().split(" ")[0])) expect(exists(src)).toBe(true);
    expect(JAMAICA_HERO_ALT.endsWith("Carnival Glam Hub Jamaica")).toBe(true);
    expect(read("src/data/destinations.ts")).not.toContain("jamaica-meliza-hernandez");
    expect(read("scripts/prerender-routes.ts")).not.toContain("jamaica-meliza-hernandez");
  });

  it("shares a 1200 by 630 JPG of the same photo", () => {
    expect(JAMAICA_OG_IMAGE).toBe("/images/destinations/jamaica-glam-hub-feathers-og.jpg");
    expect(exists(JAMAICA_OG_IMAGE)).toBe(true);
    expect(read("scripts/prerender-routes.ts")).toContain('"/jamaica": JAMAICA_OG_IMAGE,');
  });

  it("puts the second owner photo on the page with Glam Hub Jamaica alt text", () => {
    expect(JAMAICA_PHOTOS).toHaveLength(1);
    for (const p of JAMAICA_PHOTOS) {
      expect(exists(p.src)).toBe(true);
      expect(p.alt.endsWith("Carnival Glam Hub Jamaica")).toBe(true);
    }
  });
});

describe("Jamaica discovery", () => {
  it("is in sitemap.xml at priority 0.9", () => {
    expect(read("public/sitemap.xml")).toContain(
      "<loc>https://www.carnivalglamhub.com/jamaica</loc><lastmod>",
    );
    expect(read("public/sitemap.xml")).toMatch(/\/jamaica<\/loc><lastmod>[\d-]+<\/lastmod><changefreq>weekly<\/changefreq><priority>0\.9</);
    expect(read("scripts/generate-sitemap.ts")).toContain('{ path: "/jamaica", priority: "0.9"');
  });

  it("llms.txt carries the Jamaica section exactly as the data builds it", () => {
    expect(read("public/llms.txt")).toContain(JAMAICA_LLMS_SECTION);
    expect(JAMAICA_LLMS_SECTION).toContain(EVENT);
    expect(JAMAICA_LLMS_SECTION).toContain("81 Knutsford Boulevard, New Kingston, Kingston 5, Jamaica");
    expect(JAMAICA_LLMS_SECTION).toContain("4:00am to 12:00 noon");
  });

  it("JADE knows the address and the appointment times", () => {
    const pack = JSON.parse(read("supabase/functions/chat/knowledge.json"));
    const brief: string = pack.territories.jamaica.brief;
    expect(brief).toContain("Address: The Jamaica Pegasus Hotel, 81 Knutsford Boulevard, New Kingston, Kingston 5, Jamaica.");
    expect(brief).toContain("next to Emancipation Park");
    expect(brief).toContain("4:00am to 12:00 noon");
  });

  it("the 2025 guide points at /jamaica at the top", () => {
    const parts = getSeasonNotice("your-ultimate-guide-to-jamaica-carnival-2025-everything-you-need-to-know")!;
    expect(parts.some((p) => typeof p !== "string" && p.href === "/jamaica")).toBe(true);
    expect(seasonNoticeText(parts)).toContain("Jamaica Pegasus Hotel, Kingston");
  });
});
