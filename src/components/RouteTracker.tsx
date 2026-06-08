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
    // Remove any stray duplicate canonical links so there is exactly one.
    const canonicals = document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]');
    canonicals.forEach((node, idx) => {
      if (idx > 0) node.parentNode?.removeChild(node);
    });
    let canonical = canonicals[0] as HTMLLinkElement | undefined;
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

    const setNamedMeta = (name: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };
    setNamedMeta("twitter:url", href);
  }, [location.pathname]);

  return null;
};

export default RouteTracker;