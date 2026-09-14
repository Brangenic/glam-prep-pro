// Analytics and advertising tag loading, gated on consent.
//
// Nothing here runs until the visitor has granted consent. The four tag IDs
// live in this file only. They are not in index.html any more.
//
// The linker configuration is preserved exactly, including the booking
// platform host, because it carries booking attribution through to it.

import { getConsent, subscribe } from "./consent";

export const ANALYTICS_IDS = {
  gtm: "GTM-PN57SZF",
  ga4: "G-BZCF4FF50Y",
  googleAds: "AW-10894663311",
  metaPixel: "2629600853863973",
} as const;

const LINKER = {
  linker: {
    domains: [
      "carnivalglamhub.com",
      "www.carnivalglamhub.com",
      "carnivalglamhub.masos.app",
    ],
    accept_incoming: true,
  },
};

let loaded = false;

function injectScript(src: string) {
  const el = document.createElement("script");
  el.async = true;
  el.src = src;
  document.head.appendChild(el);
}

function loadGoogle() {
  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  w.dataLayer = w.dataLayer || [];
  // gtag must push the arguments object itself, not an array copy: that is
  // what gtag.js reads.
  const gtag = function (this: unknown, ..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments as unknown as IArguments);
  } as (...args: unknown[]) => void;
  w.gtag = gtag;

  // One gtag.js load serves both the GA4 and the Google Ads ID.
  injectScript(`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_IDS.ga4}`);
  gtag("js", new Date());
  gtag("config", ANALYTICS_IDS.ga4, { ...LINKER });
  gtag("config", ANALYTICS_IDS.googleAds, { ...LINKER });

  // Google Tag Manager
  w.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  injectScript(`https://www.googletagmanager.com/gtm.js?id=${ANALYTICS_IDS.gtm}`);
}

function loadMeta() {
  const w = window as unknown as {
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      push?: unknown;
      loaded?: boolean;
      version?: string;
    };
    _fbq?: unknown;
  };
  if (w.fbq) return;
  const n = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod.apply(n, args);
    else n.queue!.push(args);
  } as NonNullable<typeof w.fbq>;
  w.fbq = n;
  if (!w._fbq) w._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  injectScript("https://connect.facebook.net/en_US/fbevents.js");
  n("init", ANALYTICS_IDS.metaPixel);
}

/**
 * Load the tags, once per page load, and fire the pageview they missed.
 * Safe to call at any point after consent is granted.
 */
export function loadAnalytics() {
  if (loaded) return;
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (getConsent() !== "granted") return;
  loaded = true;

  loadGoogle();
  loadMeta();

  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  };
  const path = window.location.pathname + window.location.search;
  w.fbq?.("track", "PageView");
  w.gtag?.("event", "page_view", {
    page_path: path,
    page_title: document.title,
    send_to: ANALYTICS_IDS.ga4,
  });
  w.gtag?.("event", "page_view", {
    page_path: path,
    send_to: ANALYTICS_IDS.googleAds,
  });
}

/**
 * Stop firing and clear what we can. Scripts already in the document cannot
 * be unloaded, so Analytics and Ads are switched off with their own opt-out
 * flags and every tracking cookie we can reach is removed.
 */
export function disableAnalytics() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const w = window as unknown as Record<string, unknown>;
  w[`ga-disable-${ANALYTICS_IDS.ga4}`] = true;
  w[`ga-disable-${ANALYTICS_IDS.googleAds}`] = true;
  w.gtag = undefined;
  w.fbq = undefined;

  const host = window.location.hostname;
  const domains = [host, `.${host}`, `.${host.replace(/^www\./, "")}`];
  document.cookie.split(";").forEach((entry) => {
    const name = entry.split("=")[0]?.trim();
    if (!name) return;
    if (!/^(_ga|_gid|_gat|_gcl|_fbp|_fbc)/.test(name)) return;
    domains.forEach((domain) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
    });
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}

/** Called once at app start. Loads on consent, now or later. */
export function initAnalytics() {
  if (typeof window === "undefined") return;
  if (getConsent() === "granted") loadAnalytics();
  subscribe((status) => {
    if (status === "granted") loadAnalytics();
    else disableAnalytics();
  });
}
