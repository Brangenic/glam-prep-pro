// Cookie consent state. This module owns the visitor's decision and nothing
// else. No tracker is loaded from here, see src/lib/analytics.ts.
//
// Bump CONSENT_VERSION if the policy materially changes: a stored decision
// from an older version reads as null, so everyone is asked again.

export type ConsentStatus = "granted" | "denied";

export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = "cghConsent";

type StoredConsent = {
  status: ConsentStatus;
  at: string;
  version: number;
};

type Listener = (status: ConsentStatus | null) => void;

const listeners = new Set<Listener>();

function notify(status: ConsentStatus | null) {
  listeners.forEach((fn) => {
    try {
      fn(status);
    } catch {
      /* a bad subscriber never breaks the rest */
    }
  });
}

/**
 * The visitor's decision, or null when they have not chosen yet. Blocked or
 * unavailable storage reads as null, never as granted.
 */
export function getConsent(): ConsentStatus | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (parsed.status === "granted" || parsed.status === "denied") return parsed.status;
    return null;
  } catch {
    return null;
  }
}

/** Record a decision and tell every subscriber. */
export function setConsent(status: ConsentStatus): void {
  try {
    const payload: StoredConsent = {
      status,
      at: new Date().toISOString(),
      version: CONSENT_VERSION,
    };
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* private windows and blocked storage must never break the page */
  }
  notify(status);
}

/** Forget the decision so the banner asks again. */
export function resetConsent(): void {
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    /* noop */
  }
  notify(null);
}

export function subscribe(fn: Listener): void {
  listeners.add(fn);
}

export function unsubscribe(fn: Listener): void {
  listeners.delete(fn);
}
