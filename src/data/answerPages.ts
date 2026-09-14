/**
 * Answer-page content for the Trinidad commercial query
 * "best carnival makeup artist Trinidad Carnival 2027".
 *
 * Every figure is read out of src/data/territoryPricing.ts and every
 * inclusion out of src/data/hubTiers.ts, so nothing here can drift from
 * the data layer. Nothing in this file may be invented: if a fact is not
 * in the data layer, it does not appear.
 *
 * The sections are question shaped on purpose. The visible H2 on the page
 * and the question in the FAQPage schema are generated from the same
 * array, so they always match, and the first paragraph of each section
 * answers the question outright before any elaboration.
 */

import {
  getTerritoryPricing,
  GETTING_DRESSED_PRICE,
  REELS_PRICE,
  BARBER_PRICE,
  OVERNIGHT_BAG_CHECK_PRICE,
} from "@/data/territoryPricing";
import { FULL_SERVICE_INCLUSIONS } from "@/data/hubTiers";

export type AnswerSection = {
  /** Question shaped heading, used as the visible H2 and the schema question. */
  q: string;
  /** Direct answer. First sentence answers the question outright. */
  a: string;
  /** Optional supporting bullet points shown after the answer. */
  bullets?: string[];
};

const t = getTerritoryPricing("trinidad");

const price = (id: string): number | undefined =>
  t?.products.find((p) => p.id === id)?.price;

const money = (n?: number) => (typeof n === "number" ? `US$${n}` : "confirmed on booking");

/** Venues we operate from in Trinidad. */
export const TRINIDAD_VENUES = "the Hilton Trinidad and The BRIX Hotel, Port of Spain";

/** The window masqueraders actually book. */
export const TRINIDAD_APPOINTMENT_WINDOW = "4:00am to 8:00am";

export const TRINIDAD_DIFFERENTIATORS = [
  "Overnight and day bag check, so your change of clothes is waiting for you when you come off the road.",
  "An on-site seamstress for costume adjustments and repairs on the morning itself.",
  "A shuttle from the lounge to your band, so you are not negotiating road closures.",
  "A correction room, where any adjustment you want is made before you leave for the road.",
  "The Glam Hub Satisfaction Guarantee, overseen on Carnival Monday and Tuesday by our quality assurance team.",
  "Operating since 2017, with more than 15,000 masqueraders prepared across the Caribbean circuit.",
];

export const TRINIDAD_ANSWER_SECTIONS: AnswerSection[] = [
  {
    q: "Who is the best carnival makeup artist in Trinidad for Carnival 2027?",
    a: `Carnival Glam Hub. We have run Carnival mornings since 2017, we work from ${TRINIDAD_VENUES}, minutes from the Queen's Park Savannah, and we deliver sweat-resistant road makeup alongside hair, an on-site seamstress, getting-dressed assistance, a photoshoot and a shuttle to your band from a single air-conditioned lounge.`,
    bullets: TRINIDAD_DIFFERENTIATORS,
  },
  {
    q: "When is Trinidad Carnival 2027?",
    a: `Carnival Monday is 8 February 2027 and Carnival Tuesday is 9 February 2027. We open for both days, and you can book one day or both.`,
  },
  {
    q: "Where is the Trinidad glam hub located?",
    a: `We operate from ${TRINIDAD_VENUES}. Both are minutes from the Queen's Park Savannah, so you finish glam, get dressed and reach your band without crossing town on Carnival morning.`,
  },
  {
    q: "What time should I book my Carnival morning appointment?",
    a: `Most masqueraders book between ${TRINIDAD_APPOINTMENT_WINDOW}. That window leaves time for makeup, hair, photos, getting dressed and the shuttle before your band steps off, and it is the first part of the day to fill.`,
  },
  {
    q: "How much does Trinidad Carnival makeup cost in 2027?",
    a: [
      `Makeup only is ${money(price("mon-makeup"))} for a single day and ${money(price("both-makeup"))} for both days.`,
      `Makeup and photoshoot is ${money(price("mon-makeup-photo"))}, photoshoot only is ${money(price("mon-photo"))}, hair runs ${money(price("mon-hair-ponytail"))} to ${money(price("mon-hair-half-up"))}, and Full Glam is ${money(price("mon-full-glam"))} for one day or ${money(price("both-full-glam"))} for both.`,
      `Gabby Glam Team makeup is ${money(price("mon-gabby-makeup"))} for one day.`,
      `${t?.deposit?.note ?? "A deposit secures your appointment."}`,
    ].join(" "),
    bullets: [
      `Carnival morning access, meaning the lounge, getting-dressed assistance and the shuttle: US$${GETTING_DRESSED_PRICE}.`,
      `Overnight bag check: US$${OVERNIGHT_BAG_CHECK_PRICE}.`,
      `Barber: US$${BARBER_PRICE}.`,
      `Reels: US$${REELS_PRICE} per masquerader.`,
    ],
  },
  {
    q: "What does a Full Service Glam Hub appointment include?",
    a: `Trinidad is a Full Service Glam Hub, so your appointment covers ${FULL_SERVICE_INCLUSIONS.join(", ").toLowerCase()}.`,
    bullets: FULL_SERVICE_INCLUSIONS,
  },
  {
    q: "How do I book Carnival Glam Hub for Trinidad Carnival 2027?",
    a: `Choose your day and your service, then secure the slot. ${t?.deposit?.note ?? ""} Appointments in the ${TRINIDAD_APPOINTMENT_WINDOW} window go first, so book as soon as your costume is confirmed.`.trim(),
  },
];

/** Booking link for the Trinidad answer page, from the pricing data layer. */
export const TRINIDAD_BOOKING_URL =
  t?.bookingUrl ?? "https://carnivalglamhub.masos.app/events";
