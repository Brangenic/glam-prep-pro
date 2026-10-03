/**
 * Shared copy and facts for /trinidad/book, the website channel of the AI
 * booking app. Asset-free, so the prerender scripts, the bot knowledge
 * builder and the React page all read the same words and figures. Every
 * price, slot, venue and inclusion comes from buildAiBookingCatalogue,
 * which itself reads territoryPricing.ts, hubTiers.ts and policies.ts.
 */
import { buildAiBookingCatalogue } from "@/data/aiBookingCatalogue";
import { SITE_URL } from "@/lib/constants";

export const TRINIDAD_BOOK_PATH = "/trinidad/book";
export const TRINIDAD_BOOK_URL = `${SITE_URL}${TRINIDAD_BOOK_PATH}`;
export const TRINIDAD_BOOK_CATALOGUE = buildAiBookingCatalogue();

const C = TRINIDAD_BOOK_CATALOGUE;

export const TRINIDAD_BOOK_H1 = "Book your Trinidad Carnival 2027 glam at the Hilton";
export const TRINIDAD_BOOK_TITLE = "Book Trinidad Carnival 2027 Makeup at the Hilton | Glam Hub";

const prices = C.products.map((p) => p.price);
export const TRINIDAD_BOOK_MIN_PRICE = Math.min(...prices);
export const TRINIDAD_BOOK_MAX_PRICE = Math.max(...prices);

export const TRINIDAD_BOOK_DESCRIPTION =
  `Book Trinidad Carnival makeup and photoshoots at the Hilton, Port of Spain, for Carnival Monday and Tuesday 2027. From US$${TRINIDAD_BOOK_MIN_PRICE}, live time slots, paid in full securely.`;

export const DAY_LABEL: Record<string, string> = {
  monday: "Carnival Monday",
  tuesday: "Carnival Tuesday",
  both: "Both days",
};

function list(items: string[]): string {
  const l = items.map((i, n) => (n === 0 ? i : i.toLowerCase()));
  return l.length < 2 ? l[0] ?? "" : `${l.slice(0, -1).join(", ")} and ${l[l.length - 1]}`;
}

export const TRINIDAD_BOOK_INCLUSIONS_SENTENCE = `${list(C.inclusions)} are included with every booking.`;
const firstSlot = C.slot_times[0];
const lastSlot = C.slot_times[C.slot_times.length - 1];
export const TRINIDAD_BOOK_SLOTS_SENTENCE =
  `Appointments start every hour from ${firstSlot} to ${lastSlot} on ${C.dates.map((d) => d.display).join(" and ")}, with ${C.slot_capacity} places per time. A both-days booking holds one time on each day.`;
export const TRINIDAD_BOOK_PAYMENT_SENTENCE =
  "You pay the full price securely on Stripe when you book. Prices are fixed and there are no discount codes.";

export type BookProductLine = { id: string; label: string; day: string; dayLabel: string; price: number };
export const TRINIDAD_BOOK_PRODUCTS: BookProductLine[] = C.products.map((p) => ({
  id: p.id, label: p.label, day: p.day, dayLabel: DAY_LABEL[p.day], price: p.price,
}));

export const TRINIDAD_BOOK_FAQ: { q: string; a: string }[] = [
  { q: "Where is the Trinidad Carnival 2027 Glam Hub?", a: `At ${C.venue}. ${TRINIDAD_BOOK_INCLUSIONS_SENTENCE}` },
  { q: "What can I book on this page?", a: `Makeup only, makeup and photoshoot, or photoshoot only, for Carnival Monday, Carnival Tuesday or both days. Prices run from US$${TRINIDAD_BOOK_MIN_PRICE} to US$${TRINIDAD_BOOK_MAX_PRICE}.` },
  { q: "What times are available?", a: TRINIDAD_BOOK_SLOTS_SENTENCE },
  { q: "How do I pay?", a: TRINIDAD_BOOK_PAYMENT_SENTENCE },
  { q: "What are the booking terms?", a: `${C.terms.summary.join(" ")} The full Terms are at ${C.terms.url}.` },
];
