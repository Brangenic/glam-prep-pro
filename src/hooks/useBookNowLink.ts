import { useLocation } from "react-router-dom";
import { resolveBookNowLink, type BookNowLink } from "@/lib/bookingBar";

/** Where this page's generic "Book Now" button goes. See resolveBookNowLink. */
export function useBookNowLink(campaign: string): BookNowLink {
  const { pathname } = useLocation();
  return resolveBookNowLink(pathname, campaign);
}
