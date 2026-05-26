import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, installOutboundClickTracking } from "@/lib/tracking";

/**
 * Fires Meta Pixel + Google Ads pageviews on every SPA route change,
 * and installs the global outbound-click conversion listener once.
 */
const RouteTracker = () => {
  const location = useLocation();
  // The initial pageview is already counted by the gtag('config', ...) calls
  // and fbq('track','PageView') in index.html. Skip the first mount here so
  // we don't double-count the landing pageview, then fire on every SPA
  // navigation afterwards.
  const isInitialMount = useRef(true);

  useEffect(() => {
    installOutboundClickTracking();
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const origin = "https://www.carnivalglamhub.com";
    const path = location.pathname === "/" ? "/" : location.pathname.replace(/\/+$/, "");
    const href = `${origin}${path}`;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", href);

    const setOg = (property: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };
    setOg("og:url", href);
  }, [location.pathname]);

  return null;
};

export default RouteTracker;