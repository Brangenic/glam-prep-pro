// Single source of truth for the external booking destination.
// Use this everywhere the user is sent to "Book now". The URL is
// external (MasOS), so always render with <a href={BOOKING_URL}
// target="_blank" rel="noopener">…</a>.
export const BOOKING_URL = "https://carnivalglamhub.masos.app/events";

/** Canonical production origin. Never a mirror host. */
export const SITE_URL = "https://www.carnivalglamhub.com";

/** Our Amazon storefront. Kept here so no page holds a second copy. */
export const AMAZON_STORE_URL =
  "https://www.amazon.com/shop/carnivalglamhub?ccs_id=7e98f14b-a852-49d9-a50d-4fb90fee34c8";

/** Our own on-site storefront page. */
export const AMAZON_STORE_PATH = "/amazon-store";

/** WhatsApp. Used by the floating launcher and every in-page enquiry link. */
export const WHATSAPP_URL = "https://wa.me/18765090997";
export const WHATSAPP_DISPLAY = "+1 876 509 0997";

/** The address published in the live Terms and Privacy Policy. */
export const CONTACT_EMAIL = "carnivalglamhub@gmail.com";

/** Published booking phone number. Never hardcode this inline. */
export const CONTACT_PHONE_DISPLAY = "876-509-0997";
export const CONTACT_PHONE_HREF = "tel:+18765090997";

/** Customer-facing name of our virtual assistant. */
export const ASSISTANT_NAME = "JADE";
