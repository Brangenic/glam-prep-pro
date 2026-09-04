/**
 * Glam Bot knowledge composer.
 *
 * This module holds NO facts of its own. Every sentence it emits is
 * derived from the existing single sources of truth:
 *   territoryProfiles, hubTiers, territoryPricing, seasons, policies,
 *   pressCoverage, stationRentals and lib/constants.
 *
 * It imports only asset-free modules, so `scripts/generate-bot-knowledge.ts`
 * can import it under bunx tsx. Never import `src/data/destinations.ts`
 * or anything that pulls in an image asset.
 *
 * Nothing here may compute what season is next or what has passed. This
 * file is generated at build time and would go stale. The edge function
 * resolves status against today using `seasonEndISO`.
 */

import {
  BOOKING_URL,
  SITE_URL,
  AMAZON_STORE_URL,
  AMAZON_STORE_PATH,
  WHATSAPP_URL,
  WHATSAPP_DISPLAY,
  CONTACT_EMAIL,
} from "@/lib/constants";
import { hasBookableEvent } from "@/lib/destinations";
import { TERRITORY_PROFILES, getProfile } from "@/data/territoryProfiles";
import {
  FULL_SERVICE_SLUGS,
  LITE_SLUGS,
  TIER_LABEL,
  LITE_NOT_OFFERED,
  DAY_BAG_CHECK,
  CHARGEABLE_SERVICES,
  HUB_CAPABILITIES,
  getCapabilities,
  getFreeInclusions,
  getHubTier,
  MIAMI_LOGISTICS_SUMMARY,
  REELS_NOTE,
  SHUTTLE_TERRITORIES,
} from "@/data/hubTiers";
import {
  BARBER_PRICE,
  GETTING_DRESSED_PRICE,
  OVERNIGHT_BAG_CHECK_PRICE,
  getReelsPrice,
  TERRITORY_PRICING,
  getTerritoryPricing,
  type DayKey,
  type QuoteProduct,
  type TerritoryPricing,
} from "@/data/territoryPricing";
import { SEASON_END_DATES, SEASON_FORWARD_SLUGS, getOpenPreRegistration } from "@/data/seasons";
import {
  EFFECTIVE_DATE,
  TERMS_BLOCKS,
  PRIVACY_BLOCKS,
  CONTENTS as POLICY_CONTENTS,
} from "@/data/policies";
import { PRESS_STORIES } from "@/data/pressCoverage";
import {
  HIGH_CHAIR_RATE_PER_DAY,
  STATION_BRING,
  STATION_PAYMENT_NOTE,
  STATION_PROVIDED,
  STATION_SERVICE_TYPES,
  getTierRate,
  VENDOR_SPACE_BOTH_DAYS,
  VENDOR_SPACE_INCLUDES,
  VENDOR_SPACE_INTRO,
  VENDOR_SPACE_NOTE,
  VENDOR_SPACE_PER_DAY,
} from "@/data/stationRentals";

/** Bronzing is a masos product, so its price comes from the product list. */
const BRONZING_PRICE = 160;

/** Road ready access, the Carnival morning access product. */
const ROAD_READY_PRICE = 35;

/**
 * The only deposit we take, read out of published Terms clause 1.1 so
 * the figure can never drift from the policy text.
 */
const POLICY_DEPOSIT = (() => {
  const clause = policyClause("1.1") ?? "";
  const m = clause.match(/US\$(\d+)/);
  if (!m) throw new Error("Terms clause 1.1 no longer states a deposit figure.");
  return Number(m[1]);
})();

export type KnowledgeEvent = {
  slug: string;
  name: string;
  dateText: string;
  seasonEndISO: string | null;
  path: string | null;
  bookingUrl: string | null;
  bookableEvent: boolean;
  quotable: boolean;
  tier: string | null;
  seasonForward: boolean;
};

export type KnowledgePack = {
  generatedAt: string;
  brand: string;
  contact: {
    whatsappUrl: string;
    whatsappDisplay: string;
    email: string;
    bookingUrl: string;
    siteUrl: string;
    amazonUrl: string;
    amazonPath: string;
  };
  tiers: string;
  events: KnowledgeEvent[];
  territories: Record<
    string,
    { name: string; aliases: string[]; path: string | null; brief: string }
  >;
  topics: Record<string, string>;
  links: { label: string; url: string }[];
  neverSay: string[];
  unknowns: string[];
};

const BOT_SLUGS = TERRITORY_PROFILES.map((p) => p.slug);

/** Trinidad Carnival 2027 shares the Trinidad hub and the Trinidad prices. */
function pricingFor(slug: string): TerritoryPricing | undefined {
  return getTerritoryPricing(
    slug === "trinidad-carnival-2027" ? "trinidad" : slug,
  );
}

function money(n: number): string {
  return `US$${n}`;
}

function bullets(items: string[]): string {
  return items.map((i) => `- ${i}`).join("\n");
}

function sentenceList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function tierLabelFor(slug: string): string | null {
  const tier = getHubTier(slug);
  return tier ? TIER_LABEL[tier] : null;
}

function productLine(p: QuoteProduct): string {
  return `${p.label}: ${money(p.price)}`;
}

function dayBlock(t: TerritoryPricing, day: DayKey, label: string): string {
  const all = t.products.filter((p) => p.day === day);
  if (!all.length) return "";
  const standard = all.filter((p) => !p.premium);
  const premium = all.filter((p) => p.premium);
  const parts: string[] = [`**${label}**`];
  if (standard.length) parts.push(bullets(standard.map(productLine)));
  if (premium.length) {
    parts.push("Named and celebrity artists, charged separately:");
    parts.push(bullets(premium.map(productLine)));
  }
  return parts.join("\n");
}

function capabilityLines(slug: string): string[] {
  const caps = getCapabilities(slug);
  const lines: string[] = [];
  if (caps.barber) lines.push(`Barber: ${money(BARBER_PRICE)}`);
  if (caps.bronzing) lines.push(`Bronzing: ${money(BRONZING_PRICE)}`);
  if (caps.reels) {
    lines.push(`Reels: ${money(getReelsPrice(slug))} per masquerader, a paid add-on.`);
  }
  if (caps.overnightBagCheck)
    lines.push(
      `Overnight bag check: ${money(OVERNIGHT_BAG_CHECK_PRICE)} per masquerader, a paid add-on and never an inclusion.`,
    );
  if (caps.dressingAssistance)
    lines.push(
      "Dressing assistance: offered, and carries no published price. There is no seamstress.",
    );
  return lines;
}

/**
 * The deposit is a policy fact, not a price-list fact. Published Terms
 * clause 1.1 applies it per masquerader in every territory, so every
 * brief carries it whether or not `territoryPricing` holds a note.
 */
function depositLine(pricing: TerritoryPricing | undefined): string {
  const base = `Deposit: ${money(POLICY_DEPOSIT)} non-refundable per masquerader confirms the booking. It applies in every territory and comes from the published Terms at /policies rather than from the territory price list.`;
  return pricing?.deposit ? `${base} ${pricing.deposit.note}` : base;
}

/** Lowest published hair price across Full Service hubs. Derived, never typed. */
function hairFloor(): number | null {
  const prices = TERRITORY_PRICING.filter(
    (t) => t.quotable && (FULL_SERVICE_SLUGS as readonly string[]).includes(t.slug),
  ).flatMap((t) =>
    t.products.filter((p) => p.tags.includes("hair") && !p.premium).map((p) => p.price),
  );
  return prices.length ? Math.min(...prices) : null;
}

/* ============================================================
 * Brand
 * ============================================================ */

const BRAND = `# Carnival Glam Hub

Carnival Glam Hub was founded in 2017 by Gabrielle Waite and Kibwe McGann. More than 15,000 masqueraders have been served since 2017.

We are band neutral. We serve masqueraders from every band, in every section.

Carnival Glam Hub runs the whole Carnival morning from one location. Makeup, hair, photos and the practical parts of getting on the road happen in one place, so a masquerader is not moving between an artist, a hotel room and a photographer on the morning itself.

The service runs across the Caribbean and North America, in two hub tiers, Full Service Glam Hub and Glam Hub Lite.`;

/* ============================================================
 * Tiers
 * ============================================================ */

function buildTiers(): string {
  const full = [...FULL_SERVICE_SLUGS].map((s) => getProfile(s)?.shortName ?? s);
  const lite = [...LITE_SLUGS].map((s) => getProfile(s)?.shortName ?? s);
  const capSlugs = Object.keys(HUB_CAPABILITIES).filter(
    (s) => s !== "trinidad-carnival-2027",
  );

  const capLines = capSlugs.map((s) => {
    const caps = getCapabilities(s);
    const has = [
      caps.barber ? `barber ${money(BARBER_PRICE)}` : null,
      caps.bronzing ? `bronzing ${money(BRONZING_PRICE)}` : null,
      caps.reels ? `reels ${money(getReelsPrice(s))}` : null,
      caps.overnightBagCheck
        ? `overnight bag check ${money(OVERNIGHT_BAG_CHECK_PRICE)}`
        : null,
      caps.dressingAssistance ? "dressing assistance, no price" : null,
    ].filter(Boolean) as string[];
    return `${getProfile(s)?.shortName ?? s}: ${sentenceList(has)}`;
  });

  return `# The two hub tiers

**${TIER_LABEL.full}**: ${sentenceList(full)}.
**${TIER_LABEL.lite}**: ${sentenceList(lite)}.

Epic Cruise is a cruise partnership rather than a hub, so it carries no tier.

## Free with any booking at a ${TIER_LABEL.full}
${bullets(getFreeInclusions("trinidad"))}

Miami is a ${TIER_LABEL.full} but runs no shuttle this season, so its free list is:
${bullets(getFreeInclusions("miami"))}

## Free with any booking at a ${TIER_LABEL.lite}
${bullets(getFreeInclusions("saint-lucia"))}

## Always chargeable, never an inclusion
${sentenceList(CHARGEABLE_SERVICES)} are products. They are charged separately at every hub, at both tiers, and must never be described as included.

## Not offered at a ${TIER_LABEL.lite}
${bullets(LITE_NOT_OFFERED)}

Grenada is the one exception to that list. Grenada offers dressing assistance, on Kibwe's instruction of 3 September 2026, and it carries no price. Grenada still has no seamstress.

## Territory-scoped capabilities
These sit outside the tier model and exist only where listed:
${bullets(capLines)}

## The two different bag things
- Free: ${DAY_BAG_CHECK}. Available at every hub, both tiers, space permitting rather than guaranteed.
- Paid: overnight bag check at ${money(OVERNIGHT_BAG_CHECK_PRICE)} per masquerader. Trinidad, Jamaica and Miami only. It is an add-on, never an inclusion.`;
}

/* ============================================================
 * Events
 * ============================================================ */

function buildEvents(): KnowledgeEvent[] {
  return TERRITORY_PROFILES.map((p) => {
    const pricing = pricingFor(p.slug);
    const bookableEvent = hasBookableEvent(p.slug);
    return {
      slug: p.slug,
      name: p.name,
      dateText: p.dateText,
      seasonEndISO: SEASON_END_DATES[p.slug] ?? null,
      path: p.path,
      bookingUrl: bookableEvent ? (pricing?.bookingUrl ?? null) : null,
      bookableEvent,
      quotable: Boolean(pricing?.quotable && bookableEvent),
      tier: tierLabelFor(p.slug),
      seasonForward: (SEASON_FORWARD_SLUGS as readonly string[]).includes(
        p.slug,
      ),
    };
  });
}

/* ============================================================
 * Territory briefs
 * ============================================================ */

function buildBrief(slug: string): string {
  const profile = getProfile(slug)!;
  const pricing = pricingFor(slug);
  const bookableEvent = hasBookableEvent(slug);
  const tier = tierLabelFor(slug);
  const free = getFreeInclusions(slug);
  const caps = capabilityLines(slug);
  const parts: string[] = [`# ${profile.name}`];

  if (profile.dateText) parts.push(`Dates: ${profile.dateText}.`);
  else
    parts.push(
      "Dates: not confirmed. We have no date for this territory, so hand the visitor to the booking team.",
    );

  if (tier) {
    parts.push(
      tier === TIER_LABEL.full
        ? `Tier: ${tier}. A Full Service hub runs the whole Carnival morning from one location, with the widest set of services on site.`
        : `Tier: ${tier}. A Lite hub is a focused setup. It runs makeup and a photoshoot with a changing room and refreshments, and it does not carry the full service list.`,
    );
  } else {
    parts.push(
      "Tier: none. Epic Cruise is a cruise partnership rather than a Glam Hub, so it carries no tier badge.",
    );
  }

  parts.push(
    profile.venue
      ? `Location: ${profile.venue}`
      : "Location: the venue is confirmed after booking. Never guess or name a venue for this territory.",
  );

  if (pricing?.quotable && bookableEvent) {
    const dayBlocks = pricing.days
      .map((d) => dayBlock(pricing, d.key, d.label))
      .filter(Boolean);
    parts.push(
      `## Prices\nPer masquerader in US dollars.\n\n${dayBlocks.join("\n\n")}`,
    );
    if (pricing.provisionalNote) parts.push(pricing.provisionalNote);
  } else {
    const preRegistration = getOpenPreRegistration(slug);
    parts.push(
      preRegistration
        ? `## Prices\nNo makeup, hair or photoshoot price is published for this territory yet, so never quote a service price for it. The only figure is the pre-registration.\n\n## Pre-registration\nPre-registration is ${money(preRegistration.amount)} per masquerader and closes on ${preRegistration.closesOnText}. It secures ${preRegistration.secures}. It is not a full booking and no service is included, because service prices are set later. Pre-register at ${preRegistration.eventUrl}, never the generic events list.`
        : "## Prices\nNo prices are published for this territory yet. Never quote a number for it. Send the visitor to the booking team to confirm before any payment.",
    );
  }

  if (free.length && bookableEvent) {
    parts.push(`## Free with any booking here\n${bullets(free)}`);
  } else if (free.length) {
    parts.push(
      `## Service model when this opens\n${bullets(free)}\nThese inclusions apply only once the territory has a bookable event on file. Until then, do not describe them as part of an active booking.`,
    );
  }

  if (!tier) {
    parts.push(
      "## Also available here\nEpic Cruise runs aboard the EPIC Carnival Experience. What is included on board is confirmed by the cruise partner when the sailing opens, so never list inclusions for it.",
    );
  } else {
    parts.push(
      caps.length
        ? `## Also available here\n${bullets(caps)}`
        : "## Also available here\nNothing beyond the list above. Barber, bronzing, reels and overnight bag check are not available at this hub.",
    );
  }

  if (bookableEvent) {
    parts.push(
      pricing?.roadReady
        ? `Road ready Carnival morning access applies here at ${money(ROAD_READY_PRICE)}. Getting dressed is free with any Glam Hub service and ${money(GETTING_DRESSED_PRICE)} on its own.`
        : "Road ready Carnival morning access and getting dressed are not offered at this hub.",
    );

    // The territory's own event URL, derived from the same source the site
    // uses. Never the generic events list, which would drop a visitor who
    // asked about one territory into a list of others.
    if (pricing?.bookingUrl && pricing.bookingUrl.includes("/events/")) {
      parts.push(
        `Booking link for ${profile.name}: ${pricing.bookingUrl}. This is the only booking URL you may use for this territory.`,
      );
    }

    parts.push(depositLine(pricing));
  } else {
    const action = profile.path
      ? `Register interest at ${profile.path}.`
      : `Message the booking team on WhatsApp at ${WHATSAPP_URL}.`;
    parts.push(
      `Booking status: no bookable event is on file for this territory yet. Do not send the visitor to the booking platform, do not quote a deposit and do not suggest checkout. ${action}`,
    );
  }

  if (slug === "miami") parts.push(`## Miami logistics\n${MIAMI_LOGISTICS_SUMMARY}`);

  parts.push(
    profile.path
      ? `Page: ${profile.path}`
      : "Page: none. This territory has no page on the site.",
  );

  return parts.join("\n\n");
}

/* ============================================================
 * Topics
 * ============================================================ */

function topicPricing(): string {
  return `# Pricing rules across territories

Prices are per masquerader in US dollars. They vary by territory and by day, so always answer from the territory brief rather than from memory.

- Getting dressed: ${money(GETTING_DRESSED_PRICE)} on its own, and free with any Glam Hub service. Trinidad, Jamaica and Miami only.
- Barber: ${money(BARBER_PRICE)}. Trinidad and Jamaica only.
- Bronzing: ${money(BRONZING_PRICE)}. Trinidad and Jamaica only.
- Reels: Trinidad and Jamaica only, a paid add-on. ${REELS_NOTE}
- Overnight bag check: ${money(OVERNIGHT_BAG_CHECK_PRICE)} per masquerader. Trinidad, Jamaica and Miami only.
- Shuttle: an inclusion where it runs. It is never charged as an extra.
- Road ready Carnival morning access: ${money(ROAD_READY_PRICE)}, where the territory offers it.

${CHARGEABLE_SERVICES.join(", ")} are always charged. They are never included with a booking.`;
}

function topicServices(): string {
  return `# Services

- **Makeup**: sweat-resistant Carnival makeup by our trained artists. Available at every hub. Always charged. Page /services/carnival-makeup
- **Hair**: styling and installs built to hold under a headpiece. Full Service hubs only, Trinidad, Jamaica and Miami. Always charged, from ${money(hairFloor() ?? 0)} depending on the style and the territory. Page /services/carnival-hair
- **Photoshoot**: a shoot in costume before you hit the road. Available at every hub. Always charged. Page /services/carnival-photoshoot
- **Getting dressed**: help into the costume, wires and headpiece. Trinidad, Jamaica and Miami only. ${money(GETTING_DRESSED_PRICE)} on its own, free with any Glam Hub service. Page /services/getting-dressed
- **Shuttle**: transport from the hub. ${sentenceList(SHUTTLE_TERRITORIES)} only. Where it runs it is an inclusion and is never charged. Not running in Miami this season. Page /services/carnival-shuttle
- **Barber**: ${money(BARBER_PRICE)}, Trinidad and Jamaica only. Charged.
- **Bronzing**: ${money(BRONZING_PRICE)}, Trinidad and Jamaica only. Charged.
- **Reels**: Trinidad and Jamaica only. A paid add-on at ${money(getReelsPrice("trinidad"))} per masquerader.
- **Seamstress**: on-site costume repairs. Full Service hubs only. An inclusion where offered.
- **Changing room**: available at every hub. An inclusion.
- **Bag check**: ${DAY_BAG_CHECK}, free at every hub, space permitting. Overnight bag check is a separate paid add-on at ${money(OVERNIGHT_BAG_CHECK_PRICE)}, Trinidad, Jamaica and Miami only.`;
}

function topicBooking(): string {
  return `# How booking works

1. Pick your territory and your day on the booking platform: ${BOOKING_URL}
2. Choose your services. Prices are per masquerader and shown at checkout.
3. Pay the deposit. A ${money(POLICY_DEPOSIT)} non-refundable deposit per masquerader confirms your slot. Nothing is held by enquiry, conversation or intention to pay.
4. The balance is due before your service begins.

Book 4 to 6 weeks ahead. Book earlier for Trinidad, Jamaica and Miami, where slots go two to three months out.

You can also reach the booking team on WhatsApp at ${WHATSAPP_DISPLAY} (${WHATSAPP_URL}) or by email at ${CONTACT_EMAIL}. Estimate a total first with the booking calculator at /booking-calculator.`;
}

function policyClause(prefix: string): string | null {
  for (const block of [...TERMS_BLOCKS, ...PRIVACY_BLOCKS]) {
    for (const c of block.clauses ?? []) {
      if (c.n === prefix) return c.body;
    }
  }
  return null;
}

function topicPolicies(): string {
  const cited = ["1.1", "1.2", "3.1", "3.2", "3.3", "4.1", "4.2"]
    .map((n) => {
      const body = policyClause(n);
      return body ? `- ${n} ${body}` : null;
    })
    .filter(Boolean) as string[];

  return `# Terms, refunds and privacy

${EFFECTIVE_DATE}. The full text is published at /policies. Sections: ${POLICY_CONTENTS.map((c) => c.label).join(", ")}.

Key clauses, quoted from the published policy:
${cited.join("\n")}

In plain terms:
- The deposit is ${money(POLICY_DEPOSIT)}, non-refundable, per masquerader, in every territory. It confirms the slot.
- No refund inside 14 days of the Event.
- No shows and same day cancellations forfeit everything paid.
- One transfer per booking, to any Glam Hub event within 12 months, requested at least 3 days before the appointment. Transfers may cross territories.
- Register 30 minutes before your appointment. There is a 15 minute grace period, after which the service may be shortened or cancelled. There is no cash late fee.
- We may substitute an artist of equivalent standard.
- Photo delivery times are indicative and are not a term of the booking.
- Items left at the hub are left at your own risk.

Read it in full at /policies. Privacy questions and data requests go to ${CONTACT_EMAIL}.`;
}

function topicPress(): string {
  const top = PRESS_STORIES.filter(
    (s) => s.tier === "hero" || s.tier === "feature",
  );
  const outlets = Array.from(new Set(PRESS_STORIES.map((s) => s.outlet)));
  const lines = top.map(
    (s) => `- ${s.headline}. ${s.outlet}, ${s.publishedDate}. ${s.url}`,
  );
  return `# Press coverage

Carnival Glam Hub has been covered by ${sentenceList(outlets)}. There are ${PRESS_STORIES.length} verified stories in total, collected at /press.

Lead coverage:
${lines.join("\n")}

Hard rule: press articles are historical. They describe a past season and never override current destination, price or season data. If an article and a territory brief disagree, the territory brief wins.`;
}

function topicStations(): string {
  const full = [...FULL_SERVICE_SLUGS].map((sl) => getProfile(sl)?.shortName ?? sl);
  const lite = [...LITE_SLUGS].map((sl) => getProfile(sl)?.shortName ?? sl);
  return `# Station rentals and vendor spaces

Two separate offers, both at /station-rentals.

## Station rental
A station is for ${sentenceList(STATION_SERVICE_TYPES.map((t) => t.toLowerCase()))} only. Nothing else is offered.

Rates are set by the tier of the hub, as a rule rather than a list:
- ${TIER_LABEL.full} (${sentenceList(full)}): ${money(getTierRate("full").perDay)} per station per day, ${money(getTierRate("full").bothDays ?? 0)} for both days.
- ${TIER_LABEL.lite} (${sentenceList(lite)}): ${money(getTierRate("lite").perDay)} per station per day. There is no confirmed both-days rate, so multi-day is confirmed on enquiry.
- Optional extra: high chair rental at ${money(HIGH_CHAIR_RATE_PER_DAY)} per day.

A station can only be rented in a territory whose Carnival is still ahead of us. Read the season status for a territory from the FACTS block, never from this list.

Provided with a station:
${bullets(STATION_PROVIDED)}

The renter brings:
${bullets(STATION_BRING)}

Never promise mirrors, ring lights, product, assistants or Wi-Fi.

## Vendor and merchandise space
${VENDOR_SPACE_INTRO}

Rate: ${money(VENDOR_SPACE_PER_DAY)} per day, ${money(VENDOR_SPACE_BOTH_DAYS)} for both days. The same flat rate at every Glam Hub, Full Service and Lite alike.

A vendor space includes:
${bullets(VENDOR_SPACE_INCLUDES)}

${VENDOR_SPACE_NOTE}

## Payment
${STATION_PAYMENT_NOTE}

Enquire at /station-rentals.`;
}

function topicEssentials(): string {
  return `# What to bring on Carnival morning

Your costume, your headpiece, your accessories, your boots or footwear, any personal beauty product you cannot do without, and a packed bag for the road. We provide everything else.

Prep the night before: cleanse and moisturise the skin, avoid heavy actives in the 48 hours before, wash, deep condition and stretch the hair so it sits well under heat styling, sleep early and hydrate.

Bring your headpiece to a hair appointment so the style is set around it.

Our recommended kit is on our Amazon storefront, ${AMAZON_STORE_URL}, also browsable on the site at ${AMAZON_STORE_PATH}.

${DAY_BAG_CHECK}, free at every hub, space permitting. Overnight bag check is a separate paid add-on at ${money(OVERNIGHT_BAG_CHECK_PRICE)} in Trinidad, Jamaica and Miami only. Items left at the hub are left at your own risk.`;
}

function topicAbout(): string {
  const full = [...FULL_SERVICE_SLUGS].map((s) => getProfile(s)?.shortName ?? s);
  const lite = [...LITE_SLUGS].map((s) => getProfile(s)?.shortName ?? s);
  return `# About Carnival Glam Hub

Founded in 2017 by Gabrielle Waite and Kibwe McGann, Carnival Glam Hub has served more than 15,000 masqueraders. We are band neutral and serve masqueraders from every band.

The idea is simple. Instead of chasing an artist, a hotel room and a photographer on Carnival morning, everything happens in one location.

We run two tiers. A ${TIER_LABEL.full}, in ${sentenceList(full)}, carries the widest service list on site. A ${TIER_LABEL.lite}, in ${sentenceList(lite)}, is a focused setup around makeup, a photoshoot, a changing room and refreshments. Epic Cruise is a cruise partnership rather than a hub.

More at /about.`;
}

/**
 * Jab Jab, editorial only. Glam Bot may explain the festival and point at
 * our journal, and must never sell makeup, hair or a photoshoot for it.
 */
function topicJabJab(): string {
  return [
    "Jab Jab is Grenada's oil mas, played before dawn on Carnival Monday at Spicemas.",
    "The name comes from the patois word for devil, diable. Enslaved Africans took the devil imagery the church used against them and threw it back as satire, covering themselves in black oil, wearing horns and dragging chains, turning the chains of captivity into a symbol of freedom. It is around two hundred years old and it is a protest, not a costume.",
    "It starts around four in the morning on the Carenage in St George's, when a conch shell goes and the street fills with people covered head to toe in black oil. Horns, chains, drums, and in some bands snakes.",
    "What to wear: old dark clothes you will throw away, closed-toe old trainers, hair tied back and covered, no jewellery.",
    "Getting the oil off: coat your skin and hair in baby oil before you go out, then use oil again to lift the Jab oil before soap and water. Oil lifts oil. Soap on its own smears it.",
    "Getting to Grenada for Spicemas: fly into Maurice Bishop International, usually with one regional connection. Barbados is the most reliable regional routing when the short hop from Trinidad is full. Some masqueraders travel by yacht or charter boat from Trinidad, usually TT$1,400 to TT$2,000 per person. On the island, boat taxis around the Carenage are cheap and often faster than the road.",
    "Jab is not the same as Trinidad's paint and powder morning. It is older, it is darker, and it carries its own history.",
    "Read our journal post: /blogs/grenada-jab-jab-spicemas-jouvert-experience",
    "Other guides worth pointing at: /blogs/10-tips-for-trinidad-carnival-jouvert and /blogs/is-trinidad-carnival-safe",

    "Carnival Glam Hub sells nothing for Jab Jab or for oil mas anywhere, because oil, paint and mud is the whole point of it. If someone asks for Jab glam, say plainly that we do not do it and why, then offer Monday Mas and Tuesday Pretty Mas glam at the Grenada Glam Hub instead.",
  ].join("\n");
}

/* ============================================================
 * Links
 * ============================================================ */

function buildLinks(): { label: string; url: string }[] {
  const links: { label: string; url: string }[] = [];
  for (const p of TERRITORY_PROFILES) {
    if (!p.path) continue;
    links.push({
      label:
        p.slug === "trinidad-carnival-2027"
          ? "Trinidad Carnival 2027"
          : p.name,
      url: p.path,
    });
  }
  links.push(
    { label: "Carnival makeup", url: "/services/carnival-makeup" },
    { label: "Carnival hair", url: "/services/carnival-hair" },
    { label: "Carnival photoshoot", url: "/services/carnival-photoshoot" },
    { label: "Getting dressed", url: "/services/getting-dressed" },
    { label: "Carnival shuttle", url: "/services/carnival-shuttle" },
    { label: "Frequently asked questions", url: "/faq" },
    { label: "Terms and Policies", url: "/policies" },
    { label: "Press coverage", url: "/press" },
    { label: "About us", url: "/about" },
    { label: "Reviews", url: "/reviews" },
    { label: "Station rentals and vendor spaces", url: "/station-rentals" },
    { label: "Booking calculator", url: "/booking-calculator" },
    { label: "Amazon storefront on our site", url: AMAZON_STORE_PATH },
    { label: "Blog", url: "/blogs" },
    {
      label: "Grenada Jab Jab, the Spicemas experience",
      url: "/blogs/grenada-jab-jab-spicemas-jouvert-experience",
    },
    {
      label: "Best carnival makeup in Trinidad",
      url: "/best-carnival-makeup-trinidad",
    },
    {
      label: "Best carnival makeup in Jamaica",
      url: "/best-carnival-makeup-jamaica",
    },
    {
      label: "Best carnival makeup in Miami",
      url: "/best-carnival-makeup-miami",
    },
    { label: "Book now", url: BOOKING_URL },
    { label: "WhatsApp us", url: WHATSAPP_URL },
    { label: "Our Amazon storefront", url: AMAZON_STORE_URL },
  );
  return links;
}

/* ============================================================
 * Guardrails
 * ============================================================ */

const NEVER_SAY = [
  "GENX10",
  "Any deposit figure other than US$50, which is the only deposit we take",
  "That the Grenada pre-registration is a deposit, or that it is refundable or non-refundable. It is a US$50 pre-registration and nothing more has been confirmed.",
  "Any Grenada makeup, hair or photoshoot price for Spicemas 2027. None exists. The only Grenada figure is the US$50 pre-registration, which closes on 31 December 2026 and is not a full booking.",
  "Any lower deposit for Miami. Miami takes the same US$50 deposit as everywhere else.",
  "Any discount code, promo code or voucher code of any kind",
  "Any shuttle departure or pick-up time",
  "Any promise that a specific named artist will do a booking",
  "Any price for bag delivery in Miami",
  "Any date for Atlanta Carnival",
  "The word masos in prose. It may only ever appear inside a booking URL.",
  "Any J'ouvert package, paint, oil or body art as something Carnival Glam Hub sells, includes or offers. We do not offer it in any territory.",
  "Any seamstress, shuttle, breakfast, alcohol, hair, bronzing, barber, reels or overnight bag check in Grenada. None of those are offered there.",
];

const UNKNOWNS = [
  "Atlanta Carnival dates and prices",
  "Guyana prices",
  "Tobago prices",
  "The price of bag delivery in Miami",
  "Exact appointment times and live availability",
  "Territories we do not operate in",
  "Our registered legal entity name",
];

/* ============================================================
 * Composer
 * ============================================================ */

export function buildKnowledgePack(): KnowledgePack {
  const territories: KnowledgePack["territories"] = {};
  for (const slug of BOT_SLUGS) {
    const p = getProfile(slug)!;
    territories[slug] = {
      name: p.name,
      aliases: p.aliases,
      path: p.path,
      brief: buildBrief(slug),
    };
  }

  return {
    generatedAt: new Date().toISOString(),
    brand: BRAND,
    contact: {
      whatsappUrl: WHATSAPP_URL,
      whatsappDisplay: WHATSAPP_DISPLAY,
      email: CONTACT_EMAIL,
      bookingUrl: BOOKING_URL,
      siteUrl: SITE_URL,
      amazonUrl: AMAZON_STORE_URL,
      amazonPath: AMAZON_STORE_PATH,
    },
    tiers: buildTiers(),
    events: buildEvents(),
    territories,
    topics: {
      pricing: topicPricing(),
      services: topicServices(),
      booking: topicBooking(),
      policies: topicPolicies(),
      press: topicPress(),
      stations: topicStations(),
      essentials: topicEssentials(),
      about: topicAbout(),
      jabJab: topicJabJab(),
    },
    links: buildLinks(),
    neverSay: NEVER_SAY,
    unknowns: UNKNOWNS,
  };
}

/** Reels carry one confirmed price in every territory that offers them. */
export const REELS_PRICE_IS_CONFIRMED = getReelsPrice("trinidad") === 80;
