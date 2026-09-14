import { useEffect, useRef, useState } from "react";
import {
  getConsent,
  setConsent,
  subscribe,
  unsubscribe,
  type ConsentStatus,
} from "@/lib/consent";
import { loadAnalytics } from "@/lib/analytics";

const REOPEN_EVENT = "cgh:open-cookie-settings";

/** Footer "Cookie settings" link calls this to reopen the banner. */
export function openCookieSettings() {
  window.dispatchEvent(new Event(REOPEN_EVENT));
}

/*
 * Consent banner. Quiet card, not a wall.
 *
 * Position: on mobile it sits above the Ask JADE launcher and well clear of
 * the sticky Book Your Glam bar at the bottom. On large screens it sits
 * bottom right. Do not move it down into either of those, that collision
 * has been checked at 375 wide.
 */
const CookieConsent = () => {
  const [status, setStatus] = useState<ConsentStatus | null>(null);
  const [ready, setReady] = useState(false);
  const [reopened, setReopened] = useState(false);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    setStatus(getConsent());
    setReady(true);
    const onChange = (next: ConsentStatus | null) => setStatus(next);
    subscribe(onChange);
    const onReopen = () => setReopened(true);
    window.addEventListener(REOPEN_EVENT, onReopen);
    return () => {
      unsubscribe(onChange);
      window.removeEventListener(REOPEN_EVENT, onReopen);
    };
  }, []);

  const visible = ready && (status === null || reopened);

  useEffect(() => {
    if (visible) headingRef.current?.focus();
  }, [visible]);

  if (!visible) return null;

  const choose = (next: ConsentStatus) => {
    setConsent(next);
    setReopened(false);
    if (next === "granted") loadAnalytics();
  };

  const buttonBase =
    "flex-1 min-h-[44px] rounded-full px-4 font-body text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-heading"
      aria-modal="false"
      data-testid="cookie-consent"
      className="fixed bottom-40 left-4 right-4 z-[60] lg:bottom-6 lg:left-auto lg:right-6 lg:w-[26rem]"
    >
      <div className="rounded-2xl border border-border bg-background p-4 shadow-2xl">
        <h2
          id="cookie-consent-heading"
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-base text-foreground focus-visible:outline-none"
        >
          Cookies on this site
        </h2>
        <p className="mt-2 font-body text-sm text-foreground leading-snug">
          We use cookies to measure how the site is used and to show our
          adverts. You can accept or decline. Declining does not affect
          anything you can do here.
        </p>
        <p className="mt-2 font-body text-sm">
          <a
            href="/policies#privacy"
            className="text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Read our privacy notice
          </a>
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            data-testid="cookie-accept"
            onClick={() => choose("granted")}
            className={`${buttonBase} bg-primary text-primary-foreground hover:bg-primary/90`}
          >
            Accept
          </button>
          <button
            type="button"
            data-testid="cookie-decline"
            onClick={() => choose("denied")}
            className={`${buttonBase} border border-border bg-muted text-foreground hover:bg-muted/80`}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
