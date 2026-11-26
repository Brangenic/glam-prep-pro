/**
 * Shared copy and facts for /trinidad/book, the website channel of the AI
 * booking app. Asset-free, so the prerender scripts, the bot knowledge
 * builder and the React page all read the same words and figures. Every
 * price, slot, venue and inclusion comes from buildAiBookingCatalogue,
 * which itself reads territoryPricing.ts, hubTiers.ts and policies.ts.
 */
import { buildAiBookingCatalogue } from "@/data/aiBookingCatalogue";
import { SITE_URL } from "@/lib/constants";
import { TERMS_BLOCKS } from "@/data/policies";

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
  `Appointments start every hour from ${firstSlot} to ${lastSlot} Trinidad time on ${C.dates.map((d) => d.display).join(" and ")}, with ${C.slot_capacity} places per time. A both-days booking holds one time on each day.`;
export const TRINIDAD_BOOK_PAYMENT_SENTENCE =
  "You pay the full price securely on Stripe when you book. Prices are fixed and there are no discount codes.";

export type BookProductLine = { id: string; label: string; day: string; dayLabel: string; price: number };
export const TRINIDAD_BOOK_PRODUCTS: BookProductLine[] = C.products.map((p) => ({
  id: p.id, label: p.label, day: p.day, dayLabel: DAY_LABEL[p.day], price: p.price,
}));

const clauses = (...numbers: string[]) => numbers.map((n) => TERMS_BLOCKS.flatMap((b) => b.clauses ?? []).find((c) => c.n === n)?.body).filter(Boolean).join(" ");
// TODO(Kibwe): Confirm appointment duration for each catalogue service. No session length is in the permitted sources.
// TODO(Kibwe): Confirm what customers need to bring for these bookings. No packing requirement is in the permitted sources.

export const TRINIDAD_BOOK_FAQ: { q: string; a: string }[] = [
  { q: "Where is the Trinidad Carnival 2027 Glam Hub?", a: `At ${C.venue}. ${TRINIDAD_BOOK_INCLUSIONS_SENTENCE}` },
  { q: "What can I book on this page?", a: `Makeup only and makeup and photoshoot for Carnival Monday, Carnival Tuesday or both days, and photoshoot only for Carnival Monday or Carnival Tuesday. Prices run from US$${TRINIDAD_BOOK_MIN_PRICE} to US$${TRINIDAD_BOOK_MAX_PRICE}.` },
  { q: "What times are available?", a: TRINIDAD_BOOK_SLOTS_SENTENCE },
  { q: "How do I pay?", a: TRINIDAD_BOOK_PAYMENT_SENTENCE },
  { q: "What are the booking terms?", a: `${C.terms.summary.join(" ")} The full Terms are at ${C.terms.url}.` },
  { q: "What is not included?", a: "Only the catalogue's standard makeup and photoshoot services are sold on this page. Hair, Full Glam, Gabby Glam Team, bronzing and add-ons are not sold on this page." },
  { q: "What if I am late for my time?", a: clauses("6.1", "6.2", "6.3", "6.4", "3.5") },
  { q: "Can I get a refund or change my time?", a: clauses("3.1", "3.2", "3.3", "3.6", "5.1", "5.2") },
  { q: "Will I be ready before my band leaves?", a: `${TRINIDAD_BOOK_SLOTS_SENTENCE} The venue is ${C.venue}. ${clauses("6.5")} No band's departure time or completion time is promised.` },
  { q: "What time zone are the times in?", a: `All appointment times are ${C.time_zone}, UTC minus ${Math.abs(Number(C.utc_offset.split(":")[0]))}.` },
];
