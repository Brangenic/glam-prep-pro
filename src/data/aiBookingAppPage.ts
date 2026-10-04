/**
 * Shared copy for /ai-booking-app, the public documentation page for the
 * Carnival Glam Hub app in ChatGPT and Claude. Asset-free, so the React page
 * and the prerender scripts render the same words. Every fact comes from the
 * AI booking catalogue or src/lib/constants.ts.
 */
import { buildAiBookingCatalogue } from "@/data/aiBookingCatalogue";
import { CONTACT_EMAIL, SITE_URL, WHATSAPP_URL } from "@/lib/constants";

export const AI_APP_PATH = "/ai-booking-app";
export const AI_APP_URL = `${SITE_URL}${AI_APP_PATH}`;
export const AI_APP_SERVER_URL = "https://bvrejdrsrmvdknzoskxi.supabase.co/functions/v1/glam-hub-mcp";
export const AI_APP_PRIVACY_HREF = "/policies#privacy";

const C = buildAiBookingCatalogue();
const venueShort = C.venue.split(",").slice(0, 2).join(",").trim();

export const AI_APP_H1 = "Book Carnival Glam Hub inside ChatGPT and Claude";
export const AI_APP_TITLE = "Carnival Glam Hub App for ChatGPT and Claude | Glam Hub";
export const AI_APP_DESCRIPTION =
  `Book Trinidad Carnival 2027 makeup and photoshoots at ${venueShort} inside ChatGPT and Claude. Live times, paid in full on Stripe's secure checkout.`;

export type AiAppLink = { label: string; href: string; external?: boolean };
export type AiAppSection = { heading: string; paras: string[]; items?: string[]; links?: AiAppLink[] };

const days = C.dates.map((d) => d.display).join(" and ");
const times = `${C.slot_times.slice(0, -1).join(", ")} and ${C.slot_times[C.slot_times.length - 1]}`;

export const AI_APP_EXAMPLE_PROMPT = "Book me makeup and a photoshoot for Trinidad Carnival Tuesday at 6am";

export const AI_APP_SECTIONS: AiAppSection[] = [
  {
    heading: "What it does",
    paras: [
      `The Carnival Glam Hub app books ${C.event} makeup and photoshoot appointments at ${C.venue}, on ${days}.`,
      `There are ${C.slot_times.length} start times each day (${times}), with ${C.slot_capacity} places at each time. Every booking is paid in full on Stripe's secure checkout. There are no discount codes.`,
    ],
  },
  {
    heading: "How to add it",
    paras: ["No sign-in or account is needed to use the app."],
    items: [
      `Claude: open Settings, then Connectors, choose Add custom connector and paste the server URL ${AI_APP_SERVER_URL}`,
      "ChatGPT: once the app is listed, search for \"Carnival Glam Hub\" in apps. Until then it can be added with developer mode using the same server URL.",
    ],
  },
  {
    heading: "What the app can do",
    paras: [`Try asking: "${AI_APP_EXAMPLE_PROMPT}".`],
    items: [
      "See options: lists the makeup and photoshoot services, prices, days and what is included.",
      "Check times: shows how many places are left at each start time.",
      "Start a booking: holds your chosen time and creates a secure Stripe payment link.",
      "Check a booking: tells you whether your booking is paid and confirmed.",
    ],
  },
  {
    heading: "Payment",
    paras: [
      "The app never takes or sees card details. It creates a Stripe Checkout link, and you complete the payment yourself on Stripe.",
      `Full payment is taken at booking. Your receipt arrives by email from ${CONTACT_EMAIL}.`,
    ],
  },
  {
    heading: "Your data",
    paras: [
      "The app collects only your first name, last name, email and cell number, and uses them only to deliver your booking.",
    ],
    links: [{ label: "Read our Privacy Policy", href: AI_APP_PRIVACY_HREF }],
  },
  {
    heading: "Support",
    paras: [`Email ${CONTACT_EMAIL} or talk to JADE on WhatsApp. Prefer the website? Book the same times directly on our booking page.`],
    links: [
      { label: `Email ${CONTACT_EMAIL}`, href: `mailto:${CONTACT_EMAIL}` },
      { label: "Talk to JADE", href: WHATSAPP_URL, external: true },
      { label: "Book on the website", href: "/trinidad/book" },
    ],
  },
];
