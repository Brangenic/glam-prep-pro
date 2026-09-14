// Tracker loading, gated on consent.
//
// Nothing here runs until the visitor has granted consent. The four tracker
// IDs, Google Tag Manager, GA4, Google Ads and the Meta Pixel, live in this
// file only. They are not in index.html any more.
//
// The linker configuration is preserved exactly, including
// carnivalglamhub.masos.app, because it carries booking attribution through
// to the booking platform.

import { getConsent, subscribeConsent } from "./consent";

const GTM_ID = "GTM-PN57SZF";
export const GA4_ID = "G-BZCF4FF50Y";
export const GOOGLE_ADS_ID = "AW-10894663311";
const META_PIXEL_ID = "2629600853863973";

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
  function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  }
  w.gtag = gtag as unknown as (...args: unknown[]) => void;

  injectScript(`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`);
  gtag("js", new Date());
  gtag("config", GA4_ID, { ...LINKER });
  gtag("config", GOOGLE_ADS_ID, { ...LINKER });

  // Google Tag Manager
  w.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  injectScript(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`);
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
  n("init", META_PIXEL_ID);
}

/**
 * Load the trackers, once, and fire the pageview they missed. Safe to call
 * at any point after consent is granted.
 */
export function loadTrackers() {
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
    send_to: GA4_ID,
  });
  w.gtag?.("event", "page_view", { page_path: path, send_to: GOOGLE_ADS_ID });
}

/**
 * Stop firing and clear what we can. Scripts already in the document cannot
 * be unloaded, so GA and Ads are switched off with their own opt-out flags
 * and every tracking cookie we can reach is removed.
 */
export function disableTrackers() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const w = window as unknown as Record<string, unknown>;
  w[`ga-disable-${GA4_ID}`] = true;
  w[`ga-disable-${GOOGLE_ADS_ID}`] = true;
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
export function initTrackingConsent() {
  if (typeof window === "undefined") return;
  if (getConsent() === "granted") loadTrackers();
  subscribeConsent((state) => {
    if (state === "granted") loadTrackers();
    else disableTrackers();
  });
}
