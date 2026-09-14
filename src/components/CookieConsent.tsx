import { useEffect, useRef, useState } from "react";
import {
  getConsent,
  setConsent,
  subscribeConsent,
  type ConsentState,
} from "@/lib/consent";
import { initTrackingConsent } from "@/lib/trackerLoader";

const REOPEN_EVENT = "cgh:open-cookie-settings";

/** Footer "Cookie settings" link calls this to reopen the banner. */
export function openCookieSettings() {
  window.dispatchEvent(new Event(REOPEN_EVENT));
}

/*
 * Consent banner. Quiet card, not a wall.
 *
 * Position: on mobile it sits above the Ask JADE launcher (bottom-24) and
 * well clear of the sticky Book Your Glam bar (bottom-0). On large screens
 * it sits bottom right. Do not move it down into either of those, that
 * collision has been checked at 390 wide.
 */
const CookieConsent = () => {
  const [state, setState] = useState<ConsentState>("unknown");
  const [reopened, setReopened] = useState(false);
  const acceptRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    initTrackingConsent();
    setState(getConsent());
    const unsubscribe = subscribeConsent(setState);
    const onReopen = () => setReopened(true);
    window.addEventListener(REOPEN_EVENT, onReopen);
    return () => {
      unsubscribe();
      window.removeEventListener(REOPEN_EVENT, onReopen);
    };
  }, []);

  const visible = state === "unknown" || reopened;

  useEffect(() => {
    if (visible) acceptRef.current?.focus();
  }, [visible]);

  if (!visible) return null;

  const choose = (next: "granted" | "denied") => {
    setConsent(next);
    setReopened(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie settings"
      data-testid="cookie-consent"
      className="fixed bottom-40 left-4 right-4 z-[60] lg:bottom-6 lg:left-auto lg:right-6 lg:w-[26rem]"
    >
      <div className="rounded-2xl border border-border bg-background/98 p-4 shadow-2xl backdrop-blur-md">
        <p className="font-body text-sm text-muted-foreground leading-snug">
          We use cookies to measure how this site is used and how bookings are
          found. You can accept or decline. Read our{" "}
          <a
            href="/policies#privacy"
            className="text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            privacy policy
          </a>
          .
        </p>
        <div className="mt-3 flex gap-2">
          <button
            ref={acceptRef}
            type="button"
            data-testid="cookie-accept"
            onClick={() => choose("granted")}
            className="flex-1 min-h-[44px] rounded-full bg-primary px-4 font-body text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Accept
          </button>
          <button
            type="button"
            data-testid="cookie-decline"
            onClick={() => choose("denied")}
            className="flex-1 min-h-[44px] rounded-full border border-border bg-background px-4 font-body text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
