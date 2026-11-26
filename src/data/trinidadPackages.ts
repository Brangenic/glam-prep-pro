import { TRINIDAD_BOOK_CATALOGUE as C, TRINIDAD_BOOK_FAQ, TRINIDAD_BOOK_INCLUSIONS_SENTENCE } from "@/data/trinidadBookPage";
import { packageDates, packagePath, packageService } from "@/lib/trinidadPackageLinks";
import { SITE_URL, WHATSAPP_URL } from "@/lib/constants";
import { TITLE_MAX } from "@/lib/metaText";

export const TRINIDAD_TIME_ZONE = C.time_zone;
export const TRINIDAD_CHECKOUT_NOTE = "Secure checkout on Stripe.";
// TODO(Kibwe): Confirm an immediate receipt delivery guarantee before promising one. Email delivery can be retried.
export const TRINIDAD_RECEIPT_NOTE = "Your receipt is sent to your inbox after payment clears.";

export function fullPackageDate(dates: typeof C.dates) {
  if (dates.length === 1) return dates[0].display;
  return dates.map((d, i) => i < dates.length - 1 ? d.display.replace(/ \w+ \d{4}$/, "") : d.display).join(" and ");
}

const serviceNames: Record<string, string> = {
  makeup: "Makeup", "makeup-and-photoshoot": "Makeup and photoshoot", photoshoot: "Photoshoot",
};

export const TRINIDAD_PACKAGES = C.products.map((product) => {
  const dates = packageDates(product, C.dates);
  const serviceSlug = packageService(product) ?? "";
  const path = packagePath(product, C.dates) ?? "/trinidad/book";
  const service = serviceNames[serviceSlug];
  const fullDate = fullPackageDate(dates);
  let title = `${service}, ${fullDate}, Trinidad Carnival | Glam Hub`;
  if (title.length > TITLE_MAX) title = `${service}, ${fullDate} | Glam Hub`;
  // Both-day titles retain the entire dated weekday pair within the title guard.
  if (title.length > TITLE_MAX) title = `${service}, ${fullDate}`;
  const intro = `${service} at ${C.venue}, on Carnival ${fullDate}. US$${product.price}, paid in full.`;
  return {
    product, dates, service, serviceSlug, path, url: `${SITE_URL}${path}`, fullDate, title,
    description: `${intro} Live time slots from ${friendlySlot(C.slot_times[0])} ${TRINIDAD_TIME_ZONE}.`,
    h1: `${fullDate}. Your Carnival glam, booked.`,
    intro,
    summary: `You're booking: ${service} · ${fullDate} · US$${product.price}`,
    directSentence: `${service}, Carnival ${fullDate}, at ${C.venue}: US$${product.price}, paid in full. Book directly:`,
  };
});

export type TrinidadPackage = typeof TRINIDAD_PACKAGES[number];
export const TRINIDAD_DIRECT_LLMS_SECTION = `## Book Trinidad Carnival 2027 directly\n${TRINIDAD_PACKAGES.map((p) => `${p.directSentence} ${p.url}`).join("\n")}`;
export function resolveTrinidadPackage(service?: string, day?: string) {
  return TRINIDAD_PACKAGES.find((p) => p.path === `/trinidad/book/${service}/${day}`);
}
export function friendlySlot(time = "") {
  if (!time) return "your time";
  const [hours, minutes] = time.split(":").map(Number);
  if (!Number.isFinite(hours)) return "your time";
  return `${hours % 12 || 12}${minutes ? `:${String(minutes).padStart(2, "0")}` : ""}${hours < 12 ? "am" : "pm"}`;
}
export function timeHeading(display: string) {
  return `Pick your time on ${display}. All times are ${TRINIDAD_TIME_ZONE}.`;
}
export function payLabel(p: TrinidadPackage, slots: Record<string, string>) {
  const times = p.dates.map((d) => `${friendlySlot(slots[d.day])}, ${d.display}`).join(" and ");
  return `Pay US$${p.product.price} and lock in ${times} (${TRINIDAD_TIME_ZONE})`;
}
export function soldOutLinks(p: TrinidadPackage, day: string) {
  return TRINIDAD_PACKAGES.filter((other) => other.serviceSlug === p.serviceSlug && other.product.day !== "both" && other.product.day !== day);
}
export const TRINIDAD_ENQUIRY_URL = WHATSAPP_URL;
export function packageJsonLd(p: TrinidadPackage, availability?: Record<string, { time: string; spots_left: number }[]>) {
  const inStock = p.dates.every((d) => !availability?.[d.day] || availability[d.day].some((s) => s.spots_left > 0));
  return [
    {
      "@context": "https://schema.org", "@type": "Offer", name: `${p.service}, ${p.fullDate}`,
      price: String(p.product.price), priceCurrency: C.currency,
      availability: `https://schema.org/${inStock ? "InStock" : "SoldOut"}`, url: p.url,
      itemOffered: {
        "@type": "Service", name: p.service, description: TRINIDAD_BOOK_INCLUSIONS_SENTENCE,
        availableChannel: { "@type": "ServiceChannel", serviceLocation: C.venue_place },
        isRelatedTo: p.dates.map((d) => ({ "@type": "Event", name: `${C.event}, ${d.display}`, startDate: `${d.date}T${C.slot_times[0]}:00${C.utc_offset}`, location: C.venue_place })),
      },
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: TRINIDAD_BOOK_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
}