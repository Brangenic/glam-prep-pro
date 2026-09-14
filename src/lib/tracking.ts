// Site-wide analytics helpers for Meta Pixel + Google Ads (gtag).
// Pageviews fire automatically on route change via <RouteTracker />.
// Outbound clicks to booking/WhatsApp/tel/mailto fire conversion-grade
// Lead/Contact/Schedule events automatically via the global listener.
// Google Ads conversion labels:
//   - Booking Enquiry Submitted: 7s1DCKX357McEI-9_coo  (mailto + form helper)
//   - WhatsApp Click:            ZigKCKv357McEI-9_coo
//   - Phone Number Click:        kSs4CK7357McEI-9_coo
//   - Booking CTA Click:         zIoVCMj-iLAcEI-9_coo  (legacy, fired inline by CTAs)
//   - Booking Confirmed:         esrcCKj357McEI-9_coo  (fired on /booking-confirmed)

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// The Google Ads and GA4 IDs live in src/lib/trackerLoader.ts, which is the
// only place a tracker ID appears. Nothing here loads a tracker: every call
// goes through window.gtag / window.fbq, which exist only once the visitor
// has consented, so all of it no-ops safely before then.
import { GA4_ID, GOOGLE_ADS_ID } from "./trackerLoader";

const ENQUIRY_LABEL = "7s1DCKX357McEI-9_coo";
const WHATSAPP_LABEL = "ZigKCKv357McEI-9_coo";
const PHONE_LABEL = "kSs4CK7357McEI-9_coo";
const BOOKING_CTA_LABEL = "zIoVCMj-iLAcEI-9_coo";
const BOOKING_CONFIRMED_LABEL = "esrcCKj357McEI-9_coo";

/** Booking CTA click, fired inline by every "Book now" style button. */
export function trackBookingCtaClick() {
  try {
    window.gtag?.("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/${BOOKING_CTA_LABEL}`,
      value: 1.0,
      currency: "USD",
    });
  } catch {
    /* noop */
  }
}

/** Booking confirmed, fired on /booking-confirmed. */
export function trackBookingConfirmed(opts: {
  total?: number;
  id?: string;
  currency: string;
}) {
  try {
    const payload: Record<string, unknown> = {
      send_to: `${GOOGLE_ADS_ID}/${BOOKING_CONFIRMED_LABEL}`,
      currency: opts.currency,
    };
    if (typeof opts.total === "number") payload.value = opts.total;
    if (opts.id) payload.transaction_id = opts.id;
    window.gtag?.("event", "conversion", payload);
  } catch {
    /* noop */
  }
}

// SPA route-change pageview. Fire one page_view to GA4 and one to Google Ads,
// plus a Meta Pixel PageView. The initial pageview is already counted by the
// gtag('config', ...) calls in index.html and the inline fbq('track','PageView'),
// so <RouteTracker /> intentionally skips the first mount and only calls this
// helper on subsequent location changes.
export function trackPageView(path: string) {
  try {
    const title = typeof document !== "undefined" ? document.title : undefined;
    window.fbq?.("track", "PageView");
    window.gtag?.("event", "page_view", {
      page_path: path,
      page_title: title,
      send_to: GA4_ID,
    });
    window.gtag?.("event", "page_view", {
      page_path: path,
      send_to: GOOGLE_ADS_ID,
    });
  } catch {
    /* analytics never throw */
  }
}

type EventName = "Lead" | "Contact" | "Schedule" | "ViewContent";

export function trackEvent(name: EventName, params: Record<string, unknown> = {}) {
  try {
    window.fbq?.("track", name, params);
    // Map Meta event names → Google equivalents
    const gaName =
      name === "Lead" || name === "Schedule"
        ? "generate_lead"
        : name === "Contact"
        ? "contact"
        : "view_item";
    // GA4 conversion event
    window.gtag?.("event", gaName, params);
    // Google Ads conversion signal
    window.gtag?.("event", "conversion", { send_to: GOOGLE_ADS_ID, ...params });
  } catch {
    /* noop */
  }
}

// Fire Google Ads "Booking Enquiry Submitted" conversion. Call this from any
// enquiry/contact form's success handler. If the form captured a monetary
// value, pass it as `value`; otherwise the default 50 USD is used.
export function trackEnquirySubmitted(value: number = 50.0, currency: string = "USD") {
  try {
    window.gtag?.("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/${ENQUIRY_LABEL}`,
      value,
      currency,
    });
    window.fbq?.("track", "Lead", { value, currency });
  } catch {
    /* noop */
  }
}

// Auto-track outbound clicks. Categorises by href so Meta/Google receive
// standardised events without us touching every CTA.
export function installOutboundClickTracking() {
  if (typeof document === "undefined") return;
  if ((window as unknown as { __cghTracking?: boolean }).__cghTracking) return;
  (window as unknown as { __cghTracking?: boolean }).__cghTracking = true;

  document.addEventListener(
    "click",
    (e) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (!href) return;

      const lower = href.toLowerCase();

      if (lower.includes("masos.app")) {
        trackEvent("Schedule", { source: "booking_cta", href });
      } else if (
        lower.startsWith("https://wa.me/") ||
        lower.startsWith("https://api.whatsapp.com/") ||
        lower.startsWith("wa.me/") ||
        lower.includes("wa.me") ||
        lower.includes("whatsapp")
      ) {
        // Google Ads "WhatsApp Click" conversion, fires before navigation
        // because this listener uses { capture: true }.
        try {
          window.gtag?.("event", "conversion", {
            send_to: `${GOOGLE_ADS_ID}/${WHATSAPP_LABEL}`,
          });
        } catch { /* noop */ }
        trackEvent("Contact", { source: "whatsapp", href });
      } else if (lower.startsWith("tel:")) {
        // Google Ads "Phone Number Click" conversion, fires before navigation.
        try {
          window.gtag?.("event", "conversion", {
            send_to: `${GOOGLE_ADS_ID}/${PHONE_LABEL}`,
          });
        } catch { /* noop */ }
        trackEvent("Contact", { source: "phone", href });
      } else if (lower.startsWith("mailto:")) {
        // Treat email click as a Booking Enquiry submission (the site has no
        // dedicated enquiry form yet, wire trackEnquirySubmitted() into any
        // future form's success handler).
        trackEnquirySubmitted();
        trackEvent("Lead", { source: "email", href });
      }
    },
    { capture: true },
  );
}