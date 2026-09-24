import {
  pricingSummarySentence,
  OVERNIGHT_BAG_CHECK_PRICE,
  REELS_PRICE,
} from "@/data/territoryPricing";
import { MIAMI_SHUTTLE_NOTE } from "@/data/hubTiers";

/**
 * The single source for the home page FAQ.
 *
 * The visible accordion in `src/components/landing/FAQ.tsx` and the
 * `FAQPage` JSON-LD in `src/pages/Index.tsx` both render from this array.
 * Neither surface may hold its own copy of a question or an answer.
 *
 * Every price is interpolated from `src/data/territoryPricing.ts`, so a
 * price change in the data layer updates the copy and the schema at once.
 */
export type HomeFaq = {
  /** Short question shown in the accordion. */
  q: string;
  /** Longer question used for the FAQPage schema, where it differs. */
  schemaQ?: string;
  a: string;
};

export const HOME_FAQS: HomeFaq[] = [
  {
    q: "How do I book?",
    schemaQ: "How do I book Carnival Glam Hub?",
    a: "Select your destination and choose your glam package. You will receive confirmation after booking.",
  },
  {
    q: "How far in advance should I book?",
    schemaQ: "How far in advance should I book carnival makeup?",
    a: "As early as you can. Carnival morning is a fixed window and appointments are booked by time slot, so the popular times go first.",
  },
  {
    q: "What is included in my appointment?",
    schemaQ: "What is included in a Carnival Glam Hub appointment?",
    a: `A Full Service Glam Hub appointment (Jamaica, Trinidad, Miami) includes shuttle, wing and bag check while you are with us, space permitting, breakfast and refreshments, alcohol, makeup, hair, seamstress, a changing room, photoshoot, and coffee and tea. Bronzing is available in Trinidad and Jamaica. Reels are a paid add-on in Trinidad and Jamaica at US$${REELS_PRICE} per masquerader. Overnight bag check is a paid add-on at US$${OVERNIGHT_BAG_CHECK_PRICE} per masquerader in Trinidad, Jamaica and Miami. Jamaica and Trinidad also offer a barber. ${MIAMI_SHUTTLE_NOTE} You can come back to the hotel that night or early the next morning and collect your bag yourself, or opt for delivery the following day at additional cost, confirmed when you book. A Glam Hub Lite appointment, offered in all other territories, includes makeup, photoshoot, a changing room, wing and bag check while you are with us space permitting, and coffee, tea and light refreshments.`,
  },
  {
    q: "Where does the glam take place?",
    schemaQ: "Where does the carnival glam take place?",
    a: "Each destination has a designated glam hub location shared after booking confirmation.",
  },
  {
    q: "Can I book for a group?",
    schemaQ: "Can I book carnival glam for a group?",
    a: "Yes. Group bookings are available and recommended for friends or band sections.",
  },
  {
    q: "How are appointment times allocated?",
    schemaQ: "How are Carnival Glam Hub appointment times allocated?",
    a: "Carnival morning is a fixed window, and every appointment is booked into a time slot within it. The popular times go first, so book early to get the time you want.",
  },
  {
    q: "How much does professional Carnival makeup cost?",
    a: `${pricingSummarySentence()} This is not everyday makeup. The look is built to last a full day on the road and to complement your costume, so it usually involves dramatic eye work, gems, specialist skin prep and setting techniques that hold up in heat and sweat.`,
  },
  {
    q: "Can I do my own Carnival makeup without experience?",
    a: "You can, but there is a real risk. Without sweat-proof technique, even beautiful makeup can slide by midday once the sun is high and you start to sweat heavily. Carnival makeup is a different discipline from everyday makeup. Our MUAs are sweat-proof trained, so your look holds from the morning through the last lap. If you are experienced, go ahead and do your own. If you want it to last all day without worry, leave it to a trained Carnival artist.",
  },
  {
    q: "What is the difference between regular makeup and Carnival makeup?",
    a: "The technique. Carnival makeup is built to survive heavy sweat and an eight-hour day on the road. It puts far more focus on the eyes and lips, using methods such as cut crease and sweat-proof application, and adds drama through the application of gems. Regular makeup is made for a few hours in controlled conditions. Carnival makeup is made for the road.",
  },
];

/** The FAQPage JSON-LD for the home page, derived from HOME_FAQS. */
export const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQS.map(({ q, schemaQ, a }) => ({
    "@type": "Question",
    name: schemaQ ?? q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};
