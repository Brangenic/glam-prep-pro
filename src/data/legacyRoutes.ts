/**
 * Legacy alias URLs, /destinations/* stubs and private routes.
 *
 * Lovable hosting has no edge redirect layer, so every one of these URLs
 * would otherwise fall through to dist/index.html and serve the homepage
 * title and description, which Bing reports as duplicate titles and
 * duplicate meta descriptions. scripts/prerender-routes.ts reads this
 * module and writes each one its own head; scripts/prerender-bodies.ts
 * reads PRIVATE_ROUTES for their prerendered h1.
 *
 * Titles for aliases are derived from the OLD path, never the target,
 * because several aliases share one target and would otherwise duplicate
 * each other. src/test/legacyRoutes.test.ts fails if any title repeats.
 *
 * This module imports no assets, so the Node prerender scripts can read it.
 */

export const SITE_SUFFIX = "Carnival Glam Hub";

/** "saint-lucia" to "Saint Lucia", "terms-and-conditions" to "Terms and Conditions". */
export function titleCaseWords(segment: string): string {
  return segment
    .split("-")
    .filter(Boolean)
    .map((w, i) =>
      i > 0 && w === "and" ? w : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join(" ");
}

// ---------------------------------------------------------------
// /destinations/<slug> stubs
// ---------------------------------------------------------------

/** Paths that are not real territory slugs and must never get a /destinations/* stub. */
const NON_TERRITORY_PATHS = new Set(["/ai-booking-app", "/trinidad-carnival-2027"]);

/**
 * True only for a real territory slug such as "/jamaica". Skips nested
 * paths like "/trinidad/book" and the two non-territory pages, so
 * /destinations/trinidad/book and friends are never created.
 */
export function isTerritoryStubPath(path: string): boolean {
  if (path.slice(1).includes("/")) return false;
  return !NON_TERRITORY_PATHS.has(path);
}

export function destinationStubMeta(slug: string, baseUrl: string) {
  const humanName = titleCaseWords(slug);
  const absoluteTarget = `${baseUrl}/${slug}`;
  return {
    humanName,
    absoluteTarget,
    title: `${humanName} has moved | ${SITE_SUFFIX}`,
    description: `The Carnival Glam Hub ${humanName} page has moved to its short URL at ${absoluteTarget}. Follow the link for Carnival makeup, hair, photos and glam services.`,
    h1: `${humanName} has moved`,
    sentence: `The Carnival Glam Hub ${humanName} page now lives at its short URL, ${absoluteTarget}.`,
  };
}

// ---------------------------------------------------------------
// Root-level legacy aliases
// ---------------------------------------------------------------

export type RootAlias = {
  /** Old path, for example "/privacy-policy". */
  from: string;
  /** Canonical target path, for example "/policies". */
  to: string;
  /** Section the visitor lands on, matching the React Navigate in App.tsx. Never part of the canonical. */
  hash?: string;
  /** Overrides the derived name only where the rule would collide with another title. */
  name?: string;
  /** One body sentence, so the stub is never read as an empty page. */
  body: string;
  /** Text of the link through to the target. */
  linkText: string;
};

const POLICIES_LINK = "Continue to Terms, Refund Policy and Privacy Policy";

export const ROOT_ALIASES: RootAlias[] = [
  {
    from: "/glam-store",
    to: "/amazon-store",
    body: "The Glam Store has moved. Every Carnival Glam Hub product pick now lives on one page, the Amazon storefront, with the makeup, hair, costume and travel items our artists actually use on Carnival morning.",
    linkText: "Continue to the Carnival Glam Hub Amazon storefront",
  },
  {
    from: "/trinidad-and-tobago",
    to: "/trinidad",
    body: "Our Trinidad and Tobago page now lives on the Trinidad Carnival page, with makeup, hair, photoshoots, getting dressed and the shuttle.",
    linkText: "Continue to Trinidad Carnival",
  },
  {
    from: "/antigua-and-barbuda",
    to: "/antigua",
    body: "Our Antigua and Barbuda page now lives on the Antigua Carnival page.",
    linkText: "Continue to Antigua Carnival",
  },
  {
    from: "/st-lucia",
    to: "/saint-lucia",
    body: "Our St Lucia page now lives on the Saint Lucia Carnival page.",
    linkText: "Continue to Saint Lucia Carnival",
  },
  {
    from: "/stlucia",
    to: "/saint-lucia",
    body: "This old St Lucia address now points to our Saint Lucia Carnival page.",
    linkText: "Continue to Saint Lucia Carnival",
  },
  {
    from: "/saintlucia",
    to: "/saint-lucia",
    body: "This old Saint Lucia address now points to our Saint Lucia Carnival page.",
    linkText: "Continue to Saint Lucia Carnival",
  },
  {
    from: "/epic",
    to: "/epic-cruise",
    body: "Our EPIC page now lives on the Epic Cruise page, where you can register your interest in the next sailing.",
    linkText: "Continue to the Epic Cruise page",
  },
  {
    from: "/join-our-team",
    to: "/joinourteam",
    body: "Our careers page now lives at a new address, with the roles we hire for on Carnival morning and how to apply.",
    linkText: "Continue to Join Our Team",
  },
  {
    from: "/blog",
    to: "/blogs",
    body: "The Carnival Glam Hub blog now lives in our journal, with guides on Carnival makeup, hair, costumes and travel.",
    linkText: "Continue to the Carnival Glam Hub journal",
  },
  {
    from: "/fr/toronto",
    to: "/toronto",
    // "Toronto" alone would repeat the /destinations/toronto stub title.
    name: "Toronto (French)",
    body: "The French language Toronto page has been retired. Our Toronto Carnival page has everything in English.",
    linkText: "Continue to Toronto Carnival",
  },
  {
    from: "/terms",
    to: "/policies",
    hash: "#terms",
    body: "Our booking terms now live on one page, alongside the refund policy and the privacy policy.",
    linkText: POLICIES_LINK,
  },
  {
    from: "/terms-and-conditions",
    to: "/policies",
    hash: "#terms",
    body: "Our terms and conditions now live on one page, alongside the refund policy and the privacy policy.",
    linkText: POLICIES_LINK,
  },
  {
    from: "/refund-policy",
    to: "/policies",
    hash: "#refunds",
    body: "Our refund policy now lives on one page, alongside the booking terms and the privacy policy.",
    linkText: POLICIES_LINK,
  },
  {
    from: "/refunds",
    to: "/policies",
    hash: "#refunds",
    body: "Refund rules now live in the cancellations and refunds section of our policies page.",
    linkText: POLICIES_LINK,
  },
  {
    from: "/cancellation-policy",
    to: "/policies",
    hash: "#refunds",
    body: "Our cancellation policy now lives in the cancellations and refunds section of our policies page.",
    linkText: POLICIES_LINK,
  },
  {
    from: "/privacy",
    to: "/policies",
    hash: "#privacy",
    body: "Privacy information now lives in the privacy section of our policies page.",
    linkText: POLICIES_LINK,
  },
  {
    from: "/privacy-policy",
    to: "/policies",
    hash: "#privacy",
    body: "Our privacy policy now lives on one page, alongside the booking terms and the refund policy.",
    linkText: POLICIES_LINK,
  },
  {
    from: "/atlanta",
    to: "/",
    hash: "#destinations",
    body: "Carnival Glam Hub does not have an Atlanta page. Our homepage lists the Carnivals we are glamming next.",
    linkText: "Continue to the Carnival Glam Hub homepage",
  },
];

/** "/refund-policy" to "Refund Policy", "/fr/toronto" to "Toronto" unless overridden. */
export function aliasName(alias: Pick<RootAlias, "from" | "name">): string {
  if (alias.name) return alias.name;
  const segments = alias.from.split("/").filter(Boolean);
  return titleCaseWords(segments[segments.length - 1] ?? "");
}

export function rootAliasMeta(alias: RootAlias, baseUrl: string) {
  const oldPathName = aliasName(alias);
  const absoluteTarget = alias.to === "/" ? `${baseUrl}/` : `${baseUrl}${alias.to}`;
  return {
    oldPathName,
    absoluteTarget,
    title: `${oldPathName} has moved | ${SITE_SUFFIX}`,
    description: `The Carnival Glam Hub ${oldPathName} page has moved to ${absoluteTarget}. Follow the link to continue.`,
    h1: `${oldPathName} has moved`,
  };
}

// ---------------------------------------------------------------
// Private and post-transaction routes. Prerendered with noindex, follow.
// Never disallowed in robots.txt, or crawlers could not see the noindex.
// ---------------------------------------------------------------

export type PrivateRoute = { path: string; title: string; description: string; h1: string };

export const PRIVATE_ROUTES: PrivateRoute[] = [
  {
    path: "/auth",
    title: `Sign In | ${SITE_SUFFIX}`,
    h1: "Sign In",
    description: "Sign in to your Carnival Glam Hub account.",
  },
  {
    path: "/admin",
    title: `Admin | ${SITE_SUFFIX}`,
    h1: "Admin",
    description: "The Carnival Glam Hub admin area, for the team only.",
  },
  {
    path: "/booking-confirmed",
    title: `Booking Confirmed | ${SITE_SUFFIX}`,
    h1: "Booking Confirmed",
    description: "Your Carnival Glam Hub booking is confirmed. Thank you for booking your Carnival morning glam.",
  },
  {
    path: "/thank-you",
    title: `Thank You | ${SITE_SUFFIX}`,
    h1: "Thank You",
    description: "Thank you for booking with Carnival Glam Hub. We look forward to glamming you on Carnival morning.",
  },
  {
    path: "/trinidad/book/confirmed",
    title: `Trinidad Carnival Booking Confirmed | ${SITE_SUFFIX}`,
    h1: "Trinidad Carnival Booking Confirmed",
    description: "Payment received for your Trinidad Carnival 2027 appointment. Your receipt is on its way to your email.",
  },
  {
    path: "/trinidad/book/cancelled",
    title: `Trinidad Carnival Booking Cancelled | ${SITE_SUFFIX}`,
    h1: "Trinidad Carnival Booking Cancelled",
    description: "Your Trinidad Carnival 2027 payment was not completed, so nothing has been charged.",
  },
];

export const PRIVATE_ROBOTS = "noindex, follow";
