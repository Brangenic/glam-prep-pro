// Cookie consent state. This module owns the visitor's decision and nothing
// else. No tracker is loaded from here, see src/lib/trackerLoader.ts.
//
// Bump CONSENT_VERSION if the policy materially changes: a stored decision
// from an older version is treated as unknown, so everyone is asked again.

export type ConsentState = "unknown" | "granted" | "denied";

export const CONSENT_VERSION = 2;
export const CONSENT_STORAGE_KEY = "cgh.cookieConsent";

type StoredConsent = {
  state: "granted" | "denied";
  version: number;
  decidedAt: string;
};

let current: ConsentState | null = null;
const listeners = new Set<(state: ConsentState) => void>();

function read(): ConsentState {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return "unknown";
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed.version !== CONSENT_VERSION) return "unknown";
    if (parsed.state === "granted" || parsed.state === "denied") return parsed.state;
    return "unknown";
  } catch {
    return "unknown";
  }
}

/** The visitor's current decision. "unknown" means they have not chosen yet. */
export function getConsent(): ConsentState {
  if (typeof window === "undefined") return "unknown";
  if (current === null) current = read();
  return current;
}

/** Record a decision and tell every subscriber. */
export function setConsent(state: "granted" | "denied"): void {
  current = state;
  try {
    const payload: StoredConsent = {
      state,
      version: CONSENT_VERSION,
      decidedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* private windows and blocked storage must never break the page */
  }
  listeners.forEach((fn) => {
    try {
      fn(state);
    } catch {
      /* a bad subscriber never breaks the rest */
    }
  });
}

/** Forget the decision so the banner asks again. */
export function resetConsent(): void {
  current = "unknown";
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    /* noop */
  }
  listeners.forEach((fn) => {
    try {
      fn("unknown");
    } catch {
      /* noop */
    }
  });
}

/** React to changes. Returns an unsubscribe function. */
export function subscribeConsent(fn: (state: ConsentState) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
