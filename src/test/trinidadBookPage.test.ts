import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import catalogue from "../../supabase/functions/glam-hub-mcp/catalogue.json";
import { TRINIDAD_BOOK_PRODUCTS, TRINIDAD_BOOK_FAQ, TRINIDAD_BOOK_URL } from "@/data/trinidadBookPage";
import { isFullRefund, refundEmail, type EmailBooking } from "../../supabase/functions/_shared/glamHubEmails";
import { TRINIDAD_HUB_VENUE } from "@/data/hubTiers";

describe("/trinidad/book", () => {
  it("page prices equal the AI booking catalogue", () => {
    expect(TRINIDAD_BOOK_PRODUCTS.map((p) => [p.id, p.price])).toEqual(catalogue.products.map((p) => [p.id, p.price]));
  });
  it("canonical is on the production domain", () => expect(TRINIDAD_BOOK_URL).toBe("https://www.carnivalglamhub.com/trinidad/book"));
  it("no discount field anywhere in the booking surfaces", () => {
    const files = ["src/pages/TrinidadBook.tsx", "supabase/functions/glam-hub-mcp/index.ts", "src/data/trinidadBookPage.ts"];
    for (const f of files) {
      const s = readFileSync(f, "utf8").toLowerCase();
      expect(s).not.toMatch(/coupon|promo_code|promotion_code"|discount_code|discounts\[/);
    }
    const mcp = readFileSync("supabase/functions/glam-hub-mcp/index.ts", "utf8");
    expect(mcp).toContain('f.set("allow_promotion_codes", "false")');
    expect(mcp).toContain('f.set("billing_address_collection", "auto")');
    expect(mcp).not.toMatch(/shipping_address_collection|phone_number_collection|custom_fields/);
  });
  it("copy has no em dash and no masos", () => {
    const all = JSON.stringify([TRINIDAD_BOOK_FAQ, readFileSync("src/pages/TrinidadBook.tsx", "utf8"), readFileSync("src/pages/TrinidadBookResult.tsx", "utf8")]);
    expect(all).not.toContain("\u2014");
    expect(all.toLowerCase()).not.toContain("masos");
  });
  it("confirmed page never shows a reference", () => {
    expect(readFileSync("src/pages/TrinidadBookResult.tsx", "utf8")).not.toMatch(/reference|ref=/i.source === "" ? /x^/ : /searchParams|CGH-TT27/);
  });
});

describe("refunds", () => {
  const b: EmailBooking = {
    reference: "CGH-TT27-ABCDE", firstName: "Ana", lastName: "Lee", email: "a@t.com", phone: "+18685550100",
    productLabel: "Makeup only", amountUsd: 180, days: [{ day: "monday", time: "05:00" }],
    paymentIntentId: "pi_1", paidAt: "2026-10-03T11:00:00Z", source: "website", venue: TRINIDAD_HUB_VENUE, inclusions: [],
  };
  it("full vs partial", () => {
    expect(isFullRefund(18000, 18000)).toBe(true);
    expect(isFullRefund(18000, 5000)).toBe(false);
    expect(isFullRefund(0, 0)).toBe(false);
  });
  it("refund subject format", () => {
    expect(refundEmail(b, 180, false).subject).toBe("ACCOUNTS | REFUND | Trinidad 2027 | Mon 5am | Makeup only | US$180 | Ana Lee");
  });
  it("partial refund is flagged", () => {
    expect(refundEmail(b, 50, true).text.startsWith("PARTIAL REFUND")).toBe(true);
    expect(refundEmail(b, 180, false).text).not.toContain("PARTIAL REFUND");
  });
  it("webhook handles charge.refunded idempotently", () => {
    const w = readFileSync("supabase/functions/glam-hub-stripe-webhook/index.ts", "utf8");
    const f = readFileSync("supabase/functions/_shared/glamHubFulfil.ts", "utf8");
    expect(w).toContain('"charge.refunded"');
    expect(f).toContain("refund_notified_cents === c.amount_refunded");
  });
});
