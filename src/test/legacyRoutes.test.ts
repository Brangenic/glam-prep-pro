/**
 * Bing reported duplicate titles, duplicate descriptions and a missing h1
 * because alias, /destinations/* and private URLs served the homepage
 * head or copied their target's head. These rules keep every one unique.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  PRIVATE_ROBOTS,
  PRIVATE_ROUTES,
  ROOT_ALIASES,
  aliasName,
  destinationStubMeta,
  isTerritoryStubPath,
  rootAliasMeta,
} from "@/data/legacyRoutes";
import { TRINIDAD_2027_PAGE_TITLE } from "@/data/pageMeta";
import { BLOG_SEASON_NOTICES, seasonNoticeText } from "@/data/blogSeasonNotices";
import { blogImageAlt } from "@/data/blogImageAlt";

const BASE = "https://www.carnivalglamhub.com";
const read = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8");

// Paths in the destinationRoutes array of scripts/prerender-routes.ts.
const routesSrc = read("scripts/prerender-routes.ts");
const destBlock = routesSrc.slice(
  routesSrc.indexOf("const destinationRoutes"),
  routesSrc.indexOf("const staticRoutes"),
);
const destinationPaths = [...destBlock.matchAll(/path:\s*"([^"]+)"/g)].map((m) => m[1]);

describe("/destinations/* stubs", () => {
  it("are only emitted for real territory slugs", () => {
    expect(isTerritoryStubPath("/jamaica")).toBe(true);
    expect(isTerritoryStubPath("/saint-lucia")).toBe(true);
    expect(isTerritoryStubPath("/trinidad/book")).toBe(false);
    expect(isTerritoryStubPath("/ai-booking-app")).toBe(false);
    expect(isTerritoryStubPath("/trinidad-carnival-2027")).toBe(false);
  });

  it("say the page has moved, never copying the target's head", () => {
    const m = destinationStubMeta("saint-lucia", BASE);
    expect(m.title).toBe("Saint Lucia has moved | Carnival Glam Hub");
    expect(m.description).toBe(
      "The Carnival Glam Hub Saint Lucia page has moved to its short URL at https://www.carnivalglamhub.com/saint-lucia. Follow the link for Carnival makeup, hair, photos and glam services.",
    );
    expect(m.h1).toBe("Saint Lucia has moved");
    expect(destinationStubMeta("epic-cruise", BASE).title).toBe("Epic Cruise has moved | Carnival Glam Hub");
  });
});

describe("root aliases", () => {
  it("cover every legacy alias with the agreed target", () => {
    const map = Object.fromEntries(ROOT_ALIASES.map((a) => [a.from, a.to]));
    expect(map).toEqual({
      "/glam-store": "/amazon-store",
      "/trinidad-and-tobago": "/trinidad",
      "/antigua-and-barbuda": "/antigua",
      "/st-lucia": "/saint-lucia",
      "/stlucia": "/saint-lucia",
      "/saintlucia": "/saint-lucia",
      "/epic": "/epic-cruise",
      "/join-our-team": "/joinourteam",
      "/blog": "/blogs",
      "/fr/toronto": "/toronto",
      "/terms": "/policies",
      "/terms-and-conditions": "/policies",
      "/refund-policy": "/policies",
      "/refunds": "/policies",
      "/cancellation-policy": "/policies",
      "/privacy": "/policies",
      "/privacy-policy": "/policies",
      "/atlanta": "/",
    });
  });

  it("derive the name from the old path", () => {
    const name = (from: string) => aliasName(ROOT_ALIASES.find((a) => a.from === from)!);
    expect(name("/refund-policy")).toBe("Refund Policy");
    expect(name("/privacy-policy")).toBe("Privacy Policy");
    expect(name("/terms-and-conditions")).toBe("Terms and Conditions");
    expect(name("/trinidad-and-tobago")).toBe("Trinidad and Tobago");
    expect(name("/atlanta")).toBe("Atlanta");
    const privacy = rootAliasMeta(ROOT_ALIASES.find((a) => a.from === "/privacy-policy")!, BASE);
    expect(privacy.title).toBe("Privacy Policy has moved | Carnival Glam Hub");
    expect(privacy.description).toBe(
      "The Carnival Glam Hub Privacy Policy page has moved to https://www.carnivalglamhub.com/policies. Follow the link to continue.",
    );
  });

  it("keep the existing Glam Store wording", () => {
    expect(ROOT_ALIASES.find((a) => a.from === "/glam-store")!.body).toBe(
      "The Glam Store has moved. Every Carnival Glam Hub product pick now lives on one page, the Amazon storefront, with the makeup, hair, costume and travel items our artists actually use on Carnival morning.",
    );
  });
});

describe("private routes", () => {
  it("carry their agreed titles and noindex, follow", () => {
    expect(Object.fromEntries(PRIVATE_ROUTES.map((p) => [p.path, p.title]))).toEqual({
      "/auth": "Sign In | Carnival Glam Hub",
      "/admin": "Admin | Carnival Glam Hub",
      "/booking-confirmed": "Booking Confirmed | Carnival Glam Hub",
      "/thank-you": "Thank You | Carnival Glam Hub",
      "/trinidad/book/confirmed": "Trinidad Carnival Booking Confirmed | Carnival Glam Hub",
      "/trinidad/book/cancelled": "Trinidad Carnival Booking Cancelled | Carnival Glam Hub",
    });
    expect(PRIVATE_ROBOTS).toBe("noindex, follow");
  });

  it("are not disallowed in robots.txt, so crawlers can see the noindex", () => {
    const robots = read("public/robots.txt");
    for (const p of PRIVATE_ROUTES) {
      expect(robots).not.toMatch(new RegExp(`^Disallow:\\s*${p.path}\\s*$`, "m"));
    }
  });
});

describe("every generated title and description is unique", () => {
  const stubs = destinationPaths
    .filter(isTerritoryStubPath)
    .map((p) => destinationStubMeta(p.slice(1), BASE));
  const aliases = ROOT_ALIASES.map((a) => rootAliasMeta(a, BASE));
  const titles = [...stubs, ...aliases, ...PRIVATE_ROUTES].map((x) => x.title);
  const descriptions = [...stubs, ...aliases, ...PRIVATE_ROUTES].map((x) => x.description);

  it("found the territory routes", () => {
    expect(stubs.length).toBeGreaterThanOrEqual(10);
  });
  it("titles", () => {
    expect(new Set(titles).size).toBe(titles.length);
  });
  it("descriptions", () => {
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });
  it("uses no em dash or en dash", () => {
    expect([...titles, ...descriptions, ...ROOT_ALIASES.map((a) => a.body)].join(" ")).not.toMatch(/[\u2013\u2014]/);
  });
});

describe("Trinidad Carnival 2027 dates", () => {
  it("are in the page title", () => {
    expect(TRINIDAD_2027_PAGE_TITLE).toBe("Trinidad Carnival 2027: 8 and 9 February | Glam Hub");
  });

  it("are in the notice on the 2026 guide, with both links", () => {
    const parts = BLOG_SEASON_NOTICES["ultimate-guide-to-trinidad-carnival-2026-mas-bands-dates-insider-tips"];
    expect(seasonNoticeText(parts)).toBe(
      "Looking for Trinidad Carnival 2027? Carnival Monday and Tuesday 2027 fall on 8 and 9 February. See our Trinidad Carnival 2027 page and the 2027 first-time masquerader guide.",
    );
    const links = parts.filter((p): p is { text: string; href: string } => typeof p !== "string");
    expect(links).toEqual([
      { text: "Trinidad Carnival 2027 page", href: "/trinidad-carnival-2027" },
      { text: "2027 first-time masquerader guide", href: "/blogs/trinidad-carnival-2027-first-time-masquerader-guide" },
    ]);
  });
});

describe("blog image alt", () => {
  it("fills an empty alt from the map and keeps an existing one", () => {
    expect(blogImageAlt("https://player.tegotv.com/img/roku.png", "")).toBe("Roku logo");
    expect(blogImageAlt("https://player.tegotv.com/img/roku.png", "Watch on Roku")).toBe("Watch on Roku");
    expect(blogImageAlt("https://example.com/unknown.png", "")).toBeUndefined();
  });
});
