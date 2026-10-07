/**
 * Composer for the AI booking app catalogue (Trinidad Carnival 2027,
 * makeup and photoshoot only). Asset-free, so Node scripts can import it.
 * scripts/generate-ai-booking-catalogue.ts writes the result to
 * supabase/functions/glam-hub-mcp/catalogue.json. Never hand-edit that file.
 */
import { getTerritoryPricing } from "@/data/territoryPricing";
import { TRINIDAD_HUB_VENUE, ALWAYS_INCLUDED } from "@/data/hubTiers";
import { TERMS_BLOCKS } from "@/data/policies";
import { WHATSAPP_URL, SITE_URL } from "@/lib/constants";
import { GALLERY_HREF } from "@/data/seasons";
import { GOOGLE_RATING } from "@/data/googleRating";

export const AI_BOOKING_PRODUCT_IDS = [
  "mon-makeup",
  "mon-makeup-photo",
  "mon-photo",
  "tue-makeup",
  "tue-makeup-photo",
  "tue-photo",
  "both-makeup",
  "both-makeup-photo",
] as const;

export const AI_BOOKING_SLOT_TIMES = ["04:00", "05:00", "06:00", "07:00", "08:00"];
export const AI_BOOKING_SLOT_CAPACITY = 3;
export const POLICIES_URL = "https://www.carnivalglamhub.com/policies";

/** One photo per product type, shared by the Monday, Tuesday and both-days lines. */
export const AI_BOOKING_IMAGES = {
  makeup: { file: "makeup.webp", alt: "Carnival makeup by Carnival Glam Hub" },
  "makeup-photo": { file: "makeup-photo.webp", alt: "Carnival makeup and costume photoshoot by Carnival Glam Hub" },
  photo: { file: "photo.webp", alt: "Carnival photoshoot by Carnival Glam Hub" },
} as const;

function productType(id: string): keyof typeof AI_BOOKING_IMAGES {
  const type = id.replace(/^(mon|tue|both)-/, "");
  if (!(type in AI_BOOKING_IMAGES)) throw new Error(`No image for product type ${type}`);
  return type as keyof typeof AI_BOOKING_IMAGES;
}

function clause(n: string): string {
  for (const b of TERMS_BLOCKS) {
    const c = b.clauses?.find((x) => x.n === n);
    if (c) return c.body;
  }
  throw new Error(`Policy clause ${n} not found`);
}

export function buildAiBookingCatalogue() {
  const t = getTerritoryPricing("trinidad");
  if (!t) throw new Error("Trinidad pricing missing");
  const products = AI_BOOKING_PRODUCT_IDS.map((id) => {
    const p = t.products.find((x) => x.id === id);
    if (!p) throw new Error(`Product ${id} missing from territoryPricing.ts`);
    if (p.premium) throw new Error(`Product ${id} is premium`);
    const img = AI_BOOKING_IMAGES[productType(id)];
    return {
      id: p.id, label: p.label, day: p.day, price: p.price, tags: p.tags,
      image_url: `${SITE_URL}/images/ai-booking/${img.file}`, image_alt: img.alt,
    };
  });
  return {
    event: "Trinidad Carnival 2027",
    dates: [
      { day: "monday", label: "Carnival Monday", date: "2027-02-08", display: "Monday 8 February 2027" },
      { day: "tuesday", label: "Carnival Tuesday", date: "2027-02-09", display: "Tuesday 9 February 2027" },
    ],
    venue: TRINIDAD_HUB_VENUE,
    currency: "USD",
    whatsapp: WHATSAPP_URL,
    google_rating: { rating: GOOGLE_RATING.rating, count: GOOGLE_RATING.count, as_of: GOOGLE_RATING.asOf, url: GOOGLE_RATING.url },
    gallery_url: `${SITE_URL}${GALLERY_HREF}`,
    inclusions: ["Shuttle", "Getting-dressed assistance", "Breakfast and refreshments", ALWAYS_INCLUDED],
    products,
    slot_times: AI_BOOKING_SLOT_TIMES,
    slot_capacity: AI_BOOKING_SLOT_CAPACITY,
    terms: {
      summary: [
        `Full payment is taken at booking. ${clause("1.6")}`,
        clause("3.2"),
        `${clause("4.1")} ${clause("4.2")} ${clause("4.3")}`,
        clause("6.1"),
        clause("6.2"),
      ],
      url: POLICIES_URL,
    },
  };
}
