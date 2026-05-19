// Site-wide analytics helpers for Meta Pixel + Google Ads (gtag).
// Pageviews fire automatically on route change via <RouteTracker />.
// Outbound clicks to booking/WhatsApp/tel/mailto fire conversion-grade
// Lead/Contact/Schedule events automatically via the global listener.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GOOGLE_ADS_ID = "AW-10894663311";
const GA4_ID = "G-BZCF4FF50Y";

export function trackPageView(path: string) {
  try {
    window.fbq?.("track", "PageView");
    window.gtag?.("event", "page_view", {
      page_path: path,
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
      } else if (lower.includes("wa.me") || lower.includes("whatsapp")) {
        trackEvent("Contact", { source: "whatsapp", href });
      } else if (lower.startsWith("tel:")) {
        trackEvent("Contact", { source: "phone", href });
      } else if (lower.startsWith("mailto:")) {
        trackEvent("Lead", { source: "email", href });
      }
    },
    { capture: true },
  );
}