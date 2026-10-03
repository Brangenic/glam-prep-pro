import { describe, it, expect } from "vitest";
import { accountsEmail, receiptEmail, type EmailBooking } from "../../supabase/functions/_shared/glamHubEmails";
import { TRINIDAD_HUB_VENUE } from "@/data/hubTiers";
import catalogue from "../../supabase/functions/glam-hub-mcp/catalogue.json";

const base: EmailBooking = {
  reference: "CGH-TT27-ABCDE", firstName: "Ana", lastName: "Lee", email: "ana@test.com", phone: "+18685550100",
  productLabel: "Makeup only", amountUsd: 180, days: [{ day: "monday", time: "05:00", spotsLeft: 2 }],
  paymentIntentId: "pi_123", paidAt: "2026-10-03T11:00:00Z", source: "chatgpt",
  venue: TRINIDAD_HUB_VENUE, inclusions: catalogue.inclusions,
};
const both: EmailBooking = { ...base, productLabel: "Makeup and photoshoot", amountUsd: 480,
  days: [{ day: "tuesday", time: "06:00", spotsLeft: 1 }, { day: "monday", time: "05:00", spotsLeft: 2 }] };

describe.each([["single day", base], ["both days", both]])("AI booking emails, %s", (_n, b) => {
  const a = accountsEmail(b);
  const r = receiptEmail(b);
  it("accounts subject starts with ACCOUNTS |", () => expect(a.subject.startsWith("ACCOUNTS |")).toBe(true));
  it("receipt carries no reference", () => {
    for (const s of [r.subject, r.text, r.html]) { expect(s).not.toContain(b.reference); expect(s).not.toContain("CGH-TT27"); }
  });
  it("no em dash and no masos", () => {
    for (const s of [a.subject, a.text, r.subject, r.text, r.html]) {
      expect(s).not.toContain("\u2014");
      expect(s.toLowerCase()).not.toContain("masos");
    }
  });
  it("receipt names the venue capitalised", () => expect(r.text).toContain("Where: The Hilton Hotel, Port of Spain"));
});

it("both-days subject and receipt order the days", () => {
  expect(accountsEmail(both).subject).toBe("ACCOUNTS | Trinidad 2027 | Mon and Tue 5am and 6am | Makeup and photoshoot | US$480 | Ana Lee");
  expect(receiptEmail(both).text).toContain("When: Carnival Monday 8 February 2027 at 5am and Carnival Tuesday 9 February 2027 at 6am");
});
