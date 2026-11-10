/**
 * The /blogs Latest Post hero must go to the genuinely newest post. Two
 * in-repo posts used to carry "today" as their published_date, so they
 * permanently won the hero and showed a false date on every card.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { MANUAL_POSTS, REACT_POST_PUBLISHED_DATES } from "@/data/manualBlogPosts";
import { buildBlogIndex, selectNewestPostSlug, type BlogIndexPost } from "@/lib/blogIndex";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const read = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8");

// Newest blog_posts rows as stored on 10 November 2026, read the way the
// /blogs page reads them (synced_at desc).
const DB_SNAPSHOT: BlogIndexPost[] = [
  ["2027-carnival-calendar", "The 2027 Carnival Calendar: Every Road Day Worth Planning Around", "Carnival Glam Hub", "2026-11-09"],
  ["tribe-carnival-2027-elysia-band-launch", "Tribe Carnival 2027", "Carnival Glam Hub", "Jul 6, 2026"],
  ["yuma-ferocious-trinidad-carnival-2027-band-launch", "Yuma 2027", "Gabby Glam", "Jul 2, 2026"],
  ["what-to-bring-for-carnival", "What to bring for Carnival", "Gabby Glam", "Jun 27, 2026"],
].map(([slug, title, author, date]) => ({
  external_id: slug,
  title,
  excerpt: null,
  image_url: null,
  slug,
  post_url: `/blogs/${slug}`,
  author_name: author,
  author_avatar_url: null,
  published_date: date,
  read_time: null,
}));

afterEach(() => {
  vi.useRealTimers();
  vi.resetModules();
});

describe("MANUAL_POSTS publication dates", () => {
  it("every entry has a fixed, real ISO date string", () => {
    for (const p of MANUAL_POSTS) {
      expect(typeof p.published_date, p.slug).toBe("string");
      expect(p.published_date, p.slug).toMatch(ISO_DATE);
      const d = new Date(`${p.published_date}T00:00:00Z`);
      expect(Number.isNaN(d.getTime()), p.slug).toBe(false);
      expect(d.toISOString().slice(0, 10), p.slug).toBe(p.published_date);
    }
  });

  it("no date is derived from the clock", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2020-01-01T12:00:00Z"));
    vi.resetModules();
    const early = (await import("@/data/manualBlogPosts")).MANUAL_POSTS.map((p) => p.published_date);
    vi.setSystemTime(new Date("2035-06-15T12:00:00Z"));
    vi.resetModules();
    const late = (await import("@/data/manualBlogPosts")).MANUAL_POSTS.map((p) => p.published_date);
    expect(late).toEqual(early);
  });

  it("no source assigns today's date to a blog post", () => {
    for (const file of ["src/pages/Blogs.tsx", "src/data/manualBlogPosts.ts", "src/lib/blogIndex.ts"]) {
      const src = read(file);
      expect(src, file).not.toMatch(/TODAY_ISO/);
      expect(src, file).not.toMatch(/new Date\(\)/);
      expect(src, file).not.toMatch(/Date\.now\(\)/);
    }
  });

  it("the two Glam Hub guides carry 21 June 2026 on their card and their page", () => {
    expect(REACT_POST_PUBLISHED_DATES["is-professional-carnival-makeup-worth-it"]).toBe("2026-06-21");
    expect(REACT_POST_PUBLISHED_DATES["how-far-in-advance-to-book-carnival-makeup"]).toBe("2026-06-21");
    for (const [slug, date] of Object.entries(REACT_POST_PUBLISHED_DATES)) {
      expect(MANUAL_POSTS.find((p) => p.slug === slug)?.published_date).toBe(date);
    }
    for (const file of ["src/pages/blog/CarnivalMakeupWorthIt.tsx", "src/pages/blog/BookEarly.tsx"]) {
      expect(read(file), file).toMatch(/const DATE_PUBLISHED = REACT_POST_PUBLISHED_DATES\[SLUG\];/);
    }
  });
});

describe("/blogs Latest Post hero", () => {
  it("is 2027-carnival-calendar with the current data", () => {
    const index = buildBlogIndex(DB_SNAPSHOT, MANUAL_POSTS as BlogIndexPost[]);
    expect(index[0].slug).toBe("2027-carnival-calendar");
    expect(selectNewestPostSlug([...MANUAL_POSTS, ...DB_SNAPSHOT] as BlogIndexPost[])).toBe(
      "2027-carnival-calendar",
    );
  });

  it("does not change as the clock moves on", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2031-02-01T12:00:00Z"));
    const index = buildBlogIndex(DB_SNAPSHOT, MANUAL_POSTS as BlogIndexPost[]);
    expect(index[0].slug).toBe("2027-carnival-calendar");
  });

  it("the prerendered /blogs page uses the same shared rule", () => {
    const bodies = read("scripts/prerender-bodies.ts");
    expect(bodies).toMatch(/buildBlogIndex\(/);
    expect(bodies).toMatch(/from "\.\.\/src\/data\/manualBlogPosts"/);
  });
});
