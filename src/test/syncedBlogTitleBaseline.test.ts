import { describe, expect, it } from "vitest";
import { BLOG_TITLE_BASELINE } from "@/data/blogTitleBaseline";
import { assertSyncedBlogTitle, SyncedBlogTitleError } from "@/lib/syncedBlogTitleGuard";

describe("frozen synced blog title baseline", () => {
  it("allows the 27 exact legacy titles and records their current lengths", () => {
    expect(Object.keys(BLOG_TITLE_BASELINE)).toHaveLength(27);
    for (const [slug, entry] of Object.entries(BLOG_TITLE_BASELINE)) {
      expect(entry.length).toBe(Array.from(entry.title).length);
      expect(entry.length).toBeGreaterThan(60);
      expect(() => assertSyncedBlogTitle(slug, entry.title)).not.toThrow();
    }
  });
  it("rejects a new synced post with a title over 60 characters", () => {
    expect(() => assertSyncedBlogTitle("new-synced-post", "x".repeat(61))).toThrow(SyncedBlogTitleError);
  });
  it("rejects a baseline title changed to a different overlong title, even at the same length", () => {
    const entry = BLOG_TITLE_BASELINE["2027-carnival-calendar"];
    expect(entry).toBeDefined();
    if (!entry) throw new Error("Calendar baseline missing");
    expect(() => assertSyncedBlogTitle("2027-carnival-calendar", "x".repeat(entry.length))).toThrow(SyncedBlogTitleError);
  });
  it("allows a corrected baseline title within the guard", () => {
    expect(() => assertSyncedBlogTitle("2027-carnival-calendar", "The 2027 Carnival Calendar")).not.toThrow();
  });
});