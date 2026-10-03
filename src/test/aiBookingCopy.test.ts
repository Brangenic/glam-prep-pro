import { it, expect } from "vitest";
import { prePaymentSummary, startBookingText, statusSummary } from "../../supabase/functions/glam-hub-mcp/copy";

it("start_booking text never says paid in full", () => {
  const s = prePaymentSummary("Trinidad Carnival 2027", "Makeup only", "Monday 05:00", "The Hilton Hotel, Port of Spain", 160);
  const t = startBookingText(s, "CGH-TT27-ABCDE", "https://checkout.stripe.com/x");
  expect(s).toContain("US$160, payable in full now");
  expect(t.toLowerCase()).not.toContain("paid in full");
});

it("status says paid in full only when paid", () => {
  expect(statusSummary("E", "L", 160, "paid")).toContain("paid in full");
  expect(statusSummary("E", "L", 160, "pending_payment")).not.toContain("paid in full");
});
