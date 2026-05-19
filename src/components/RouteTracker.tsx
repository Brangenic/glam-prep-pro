import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, installOutboundClickTracking } from "@/lib/tracking";

/**
 * Fires Meta Pixel + Google Ads pageviews on every SPA route change,
 * and installs the global outbound-click conversion listener once.
 */
const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    installOutboundClickTracking();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return null;
};

export default RouteTracker;