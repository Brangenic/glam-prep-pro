import { describe, expect, it } from "vitest";

import {
  ALL_CARNIVAL_GUIDES,
  CARNIVAL_GUIDE_GROUPS,
  getGuidesForTerritory,
  guideHref,
} from "@/data/carnivalGuides";
import { isRealPostSlug } from "@/data/blogCatalogue";
import { isRemovedPostSlug } from "@/lib/removedPosts";
import { destinations } from "@/data/destinations";

describe("Carnival guides", () => {
  it("every guide resolves to a real post", () => {
    const dead = ALL_CARNIVAL_GUIDES.filter((g) => !isRealPostSlug(g.slug));
    expect(dead.map((g) => g.slug), "guides pointing at posts that do not exist").toEqual([]);
  });

  it("never links a withdrawn post", () => {
    for (const g of ALL_CARNIVAL_GUIDES) {
      expect(isRemovedPostSlug(g.slug), g.slug).toBe(false);
    }
  });

  it("every guide has real anchor text and a blog href", () => {
    for (const g of ALL_CARNIVAL_GUIDES) {
      expect(g.anchor.trim().length, g.slug).toBeGreaterThan(8);
      expect(g.anchor.toLowerCase()).not.toMatch(/^read more|^click here/);
      expect(g.blurb.trim().length, g.slug).toBeGreaterThan(8);
      expect(guideHref(g)).toBe(`/blogs/${g.slug}`);
    }
  });

  it("has no duplicate slug inside a group and no near-empty group", () => {
    for (const group of CARNIVAL_GUIDE_GROUPS) {
      const slugs = group.guides.map((g) => g.slug);
      expect(new Set(slugs).size, group.id).toBe(slugs.length);
      expect(group.guides.length, group.id).toBeGreaterThanOrEqual(3);
    }
  });

  it("only references destination slugs that exist", () => {
    // The shared Trinidad 2027 answer page is a valid target too.
    const valid = new Set([
      ...destinations.map((d) => d.slug),
      "trinidad-carnival-2027",
    ]);
    for (const g of ALL_CARNIVAL_GUIDES) {
      for (const t of g.territories ?? []) {
        expect(valid.has(t), `${g.slug} -> ${t}`).toBe(true);
      }
    }
  });

  /**
   * Guides are editorial, so they are deliberately NOT season filtered.
   * A wrapped Carnival keeps its guides, only the booking call to action
   * is season gated. This test exists so nobody "fixes" it later.
   */
  it("is not season filtered, a wrapped territory keeps its guides", () => {
    expect(getGuidesForTerritory("saint-lucia").length).toBeGreaterThan(0);
    expect(getGuidesForTerritory("barbados").length).toBeGreaterThan(0);
  });
});

describe("Featured guides", () => {
  it("all five featured guides resolve to real posts", async () => {
    const { FEATURED_CARNIVAL_GUIDES } = await import("@/data/carnivalGuides");
    expect(FEATURED_CARNIVAL_GUIDES.length).toBe(5);
    for (const g of FEATURED_CARNIVAL_GUIDES) {
      expect(isRealPostSlug(g.slug), g.slug).toBe(true);
      expect(isRemovedPostSlug(g.slug), g.slug).toBe(false);
    }
  });

  it("a guides column is never one lonely link", async () => {
    const { getRelatedGuides } = await import("@/data/carnivalGuides");
    for (const slug of ["grenada", "trinidad", "antigua", "toronto"]) {
      const guides = getRelatedGuides(slug);
      expect(guides.length, slug).toBeGreaterThanOrEqual(3);
      for (const g of guides) expect(isRealPostSlug(g.slug), g.slug).toBe(true);
    }
  });
});
