import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { TRINIDAD_BOOK_FAQ, TRINIDAD_BOOK_CATALOGUE as C } from "@/data/trinidadBookPage";
import { BOOKING_TERMS_LABEL } from "@/data/policies";
import { assertSyncedBlogTitle } from "@/lib/syncedBlogTitleGuard";
import { homeMetaDescription } from "@/data/homeMeta";
import { TRINIDAD_HISTORY_SENTENCE, TRINIDAD_PRESS_STORY } from "@/data/pressCoverage";

describe("booking source and disclosure rules", () => {
  it("has supported late-arrival, refunds, rescheduling and time zone answers without inventing duration or packing rules", () => {
    expect(TRINIDAD_BOOK_FAQ.find((f) => /late for/.test(f.q))?.a).toContain("15 minute grace period");
    expect(TRINIDAD_BOOK_FAQ.find((f) => /refund or/.test(f.q))?.a).toContain("3 days");
    expect(TRINIDAD_BOOK_FAQ.find((f) => /time zone/.test(f.q))?.a).toContain("UTC minus 4");
    expect(TRINIDAD_BOOK_FAQ.some((f) => /How long|bring anything/.test(f.q))).toBe(false);
  });
  it("has one Terms acceptance label in the catalogue, website and MCP card/schema", () => {
    expect(C.terms.acceptance_label).toBe("I accept the Carnival Glam Hub Terms and refund policy.");
    expect(C.terms.acceptance_label).toBe(BOOKING_TERMS_LABEL);
    for (const [file, symbol] of [["src/pages/TrinidadBook.tsx", "BOOKING_TERMS_LABEL"], ["supabase/functions/glam-hub-mcp/widget.ts", "CAT.terms.acceptance_label"], ["supabase/functions/glam-hub-mcp/index.ts", "CAT.terms.acceptance_label"]]) expect(readFileSync(file, "utf8")).toContain(symbol);
  });
  it("no package page or new package display hardcodes a price, event date, slot or phone", () => {
    for (const file of ["src/pages/TrinidadBook.tsx", "src/components/TrinidadDirectPackages.tsx", "src/data/trinidadPackages.ts", "src/lib/trinidadPackageLinks.ts"]) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(/US\$\d|2027-02-0[89]|\b[89] February 2027|["']0[4-8]:00["']|(?:\+1 ?868|876 ?509) ?\d/);
    }
  });
  it("default meta leads with the two open 2027 dates under the length guard", () => {
    const d = homeMetaDescription(new Date("2026-11-26"));
    expect(d).toContain("Trinidad, 8 and 9 February 2027");
    expect(d).toContain("Jamaica, 4 April 2027");
    expect(d.length).toBeLessThanOrEqual(160);
    expect(homeMetaDescription(new Date("2027-02-10"))).not.toContain("Trinidad,");
  });
  it("synced titles over 60 characters fail rather than silently truncate", () => {
    expect(() => assertSyncedBlogTitle("test", "x".repeat(60))).not.toThrow();
    expect(() => assertSyncedBlogTitle("test", "x".repeat(61))).toThrow("TODO(Kibwe)");
    expect(() => assertSyncedBlogTitle("test", "&".repeat(13))).toThrow();
  });
  it("reuses the existing confirmed 2020 article, not a duplicated press entry", () => {
    expect(TRINIDAD_PRESS_STORY?.publishedDate).toBe("2020-03-02");
    expect(TRINIDAD_PRESS_STORY?.summary).toContain("150 clients");
    expect(TRINIDAD_PRESS_STORY?.summary).toContain("over 400 people between midnight and 2pm");
    expect(TRINIDAD_HISTORY_SENTENCE).toBe("Glam Hub opened in Trinidad at the Hilton for Carnival 2020.");
  });
});