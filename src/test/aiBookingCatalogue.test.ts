import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { buildAiBookingCatalogue, AI_BOOKING_PRODUCT_IDS } from "@/data/aiBookingCatalogue";

const committedRaw = readFileSync(
  resolve(process.cwd(), "supabase/functions/glam-hub-mcp/catalogue.json"),
  "utf8",
);
const committed = JSON.parse(committedRaw);

describe("AI booking catalogue", () => {
  it("committed catalogue equals a fresh generation", () => {
    expect(committed).toEqual(buildAiBookingCatalogue());
  });
  it("shared copy equals the committed catalogue", () => {
    const shared = readFileSync(resolve(process.cwd(), "supabase/functions/_shared/glamHubCatalogue.json"), "utf8");
    expect(shared).toBe(committedRaw);
  });
  it("contains exactly the eight approved products", () => {
    const ids = committed.products.map((p: { id: string }) => p.id).sort();
    expect(ids).toEqual([...AI_BOOKING_PRODUCT_IDS].sort());
  });
  it("carries no premium product", () => {
    expect(committedRaw.toLowerCase()).not.toContain("gabby");
    expect(committed.products.every((p: { premium?: boolean }) => !p.premium)).toBe(true);
  });
  it("has no masos, jouvert or em dash", () => {
    const lower = committedRaw.toLowerCase();
    expect(lower).not.toContain("masos");
    expect(lower.replace(/['\u2019]/g, "")).not.toContain("jouvert");
    expect(committedRaw).not.toContain("\u2014");
  });
});
