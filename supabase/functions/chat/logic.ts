/**
 * Glam Bot pure logic.
 *
 * This module deliberately has NO import statements and touches no Deno
 * API, so the Vitest suite in src/test/glamBotKnowledge.test.ts can
 * import it directly and prove the behaviour without a deployed
 * function. Every function takes the knowledge pack as an explicit
 * parameter, so there is no module-level state and no second copy of a
 * fact anywhere in here.
 *
 * The pack itself is generated from src/data by
 * scripts/generate-bot-knowledge.ts. Nothing in this file may hold a
 * business fact of its own.
 */

export type Msg = { role: "user" | "assistant" | "system"; content: string };

export type KnowledgeEvent = {
  slug: string;
  name: string;
  dateText: string;
  seasonEndISO: string | null;
  path: string | null;
  bookingUrl: string | null;
  bookableEvent?: boolean;
  quotable: boolean;
  tier: string | null;
  seasonForward: boolean;
};

export type Territory = {
  name: string;
  aliases: string[];
  path: string | null;
  brief: string;
};

export type Pack = {
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
  territories: Record<string, Territory>;
  topics: Record<string, string>;
  links: { label: string; url: string }[];
  neverSay: string[];
  unknowns: string[];
};

export type ResolvedEvents = {
  upcoming: KnowledgeEvent[];
  passed: KnowledgeEvent[];
  forward: KnowledgeEvent[];
  undated: KnowledgeEvent[];
};

export type CartDirective = "NONE" | "CONTEXTUAL" | "CLOSING";

/* ------------------------------------------------------------
 * 1. Today, resolved at request time and never at build time.
 * ------------------------------------------------------------ */

/** Matches src/data/seasons.ts: a season closes at the end of its last day. */
export function endOfDay(iso: string): number {
  return new Date(`${iso}T23:59:59Z`).getTime();
}

export function resolveEvents(pack: Pack, now: Date): ResolvedEvents {
  const t = now.getTime();
  const upcoming: KnowledgeEvent[] = [];
  const passed: KnowledgeEvent[] = [];
  const forward: KnowledgeEvent[] = [];
  const undated: KnowledgeEvent[] = [];

  for (const ev of pack.events) {
    if (ev.seasonForward) {
      // Never described as closed. It points forward to a season with no
      // confirmed dates, so it takes no place in the ordering.
      forward.push(ev);
      continue;
    }
    if (!ev.seasonEndISO) {
      undated.push(ev);
      continue;
    }
    if (t > endOfDay(ev.seasonEndISO)) passed.push(ev);
    else upcoming.push(ev);
  }

  upcoming.sort((a, b) => endOfDay(a.seasonEndISO!) - endOfDay(b.seasonEndISO!));
  passed.sort((a, b) => endOfDay(b.seasonEndISO!) - endOfDay(a.seasonEndISO!));
  return { upcoming, passed, forward, undated };
}

/* ------------------------------------------------------------
 * 2. Territory resolution, sticky across the conversation.
 * ------------------------------------------------------------ */

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function matchesAlias(text: string, alias: string): boolean {
  return new RegExp(
    `(^|[^a-z0-9])${escapeRegExp(alias)}([^a-z0-9]|$)`,
    "i",
  ).test(text);
}

/**
 * Scans user messages newest first. The most recent alias match wins and
 * holds for the rest of the session, so a follow-up question does not
 * have to name the territory again.
 */
export function resolveTerritory(
  pack: Pack,
  userMessages: string[],
): string | null {
  for (let i = userMessages.length - 1; i >= 0; i--) {
    const text = (userMessages[i] ?? "").toLowerCase();
    let best: { slug: string; length: number } | null = null;
    for (const [slug, territory] of Object.entries(pack.territories)) {
      for (const alias of territory.aliases) {
        if (matchesAlias(text, alias)) {
          if (!best || alias.length > best.length) {
            best = { slug, length: alias.length };
          }
        }
      }
    }
    if (best) return best.slug;
  }
  return null;
}

/* ------------------------------------------------------------
 * 3. Topics.
 * ------------------------------------------------------------ */

export const TOPIC_KEYWORDS: Record<string, string[]> = {
  pricing: ["price", "cost", "how much", "rate", "fee", "deposit"],
  services: [
    "makeup",
    "hair",
    "photoshoot",
    "photos",
    "dressed",
    "shuttle",
    "barber",
    "bronzing",
    "reels",
    "seamstress",
    "bag check",
  ],
  booking: ["book", "reserve", "slot", "availability", "appointment"],
  policies: [
    "refund",
    "cancel",
    "transfer",
    "late",
    "deposit",
    "policy",
    "terms",
    "privacy",
  ],
  press: ["press", "featured", "magazine", "article", "vogue", "media", "news"],
  stations: ["station", "rent", "vendor", "booth", "sell", "artist space"],
  essentials: [
    "pack",
    "bring",
    "road bag",
    "essentials",
    "buy before",
    "what do i need",
    "kit",
  ],
  about: ["founder", "founded", "history", "who are you", "about"],
  // Editorial only. Jab Jab and the oil mas questions that come with it,
  // including how to travel to Grenada for Spicemas and how to clean up
  // afterwards. Never an offer, see the J'OUVERT section of the prompt.
  jabJab: [
    "jab",
    "jouvert",
    "j'ouvert",
    "jouvay",
    "oil mas",
    "oil off",
    "black oil",
    "carenage",
    "spicemas",
    "get to grenada",
    "fly to grenada",
    "travel to grenada",
    "boat",
    "yacht",
  ],
};

export function topicsIn(text: string): string[] {
  const lower = text.toLowerCase();
  return Object.entries(TOPIC_KEYWORDS)
    .filter(([, words]) => words.some((w) => lower.includes(w)))
    .map(([topic]) => topic);
}

export function resolveTopics(userMessages: string[]): string[] {
  const recent = userMessages.slice(-2).join("\n");
  const matched = topicsIn(recent);
  if (!matched.length) return ["about", "booking"];
  for (const fallback of ["about", "booking"]) {
    if (!matched.includes(fallback)) matched.push(fallback);
  }
  return matched;
}

/* ------------------------------------------------------------
 * 4. Amazon cart directive, decided server side.
 * ------------------------------------------------------------ */

export const SUPPRESS_PATTERNS = [
  // Complaint language
  "complain",
  "unhappy",
  "disappointed",
  "terrible",
  "awful",
  "ruined",
  "rude",
  "late",
  "missed",
  "damaged",
  "wrong",
  "bad experience",
  // Refund or cancellation
  "refund",
  "cancel",
  "cancellation",
  "money back",
  "chargeback",
  "dispute",
  // Human support needed
  "speak to someone",
  "talk to a human",
  "real person",
  "manager",
  "call me",
  "contact the team",
  // Active booking flow
  "pay",
  "payment",
  "checkout",
  "my booking",
  "my appointment",
  "confirm my",
  "reschedule",
  "change my",
];

export const SIGN_OFFS = [
  "thank you",
  "thanks",
  "thx",
  "perfect",
  "got it",
  "great",
  "that's all",
  "thats all",
  "no thanks",
  "no thank you",
  "i'm good",
  "im good",
  "all good",
  "okay thank you",
  "ok thanks",
  "no more questions",
  "that's it",
  "cheers",
  "appreciate it",
  "bye",
];

export const INTERROGATIVES = [
  "how",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "can",
  "do",
  "does",
  "is",
  "are",
  "could",
  "would",
];

export const SERVICE_OR_PRICE_KEYWORDS = [
  ...TOPIC_KEYWORDS.services,
  ...TOPIC_KEYWORDS.pricing,
];

/**
 * A sign-off only counts as closing when it is genuinely a sign-off.
 * "Thanks, but how much is hair?" must fail here, on the question mark,
 * on the interrogative and on the service keyword.
 */
export function isClosing(lastUserMessage: string): boolean {
  const text = (lastUserMessage ?? "").toLowerCase().trim();
  if (!text) return false;
  if (!SIGN_OFFS.some((s) => text.includes(s))) return false;
  if (text.includes("?")) return false;
  const words = text.split(/[^a-z0-9']+/).filter(Boolean);
  if (words.length > 8) return false;
  if (words.some((w) => INTERROGATIVES.includes(w))) return false;
  if (SERVICE_OR_PRICE_KEYWORDS.some((k) => text.includes(k))) return false;
  return true;
}

export function resolveCartDirective(pack: Pack, messages: Msg[]): CartDirective {
  const userMessages = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content ?? "");
  const assistantMessages = messages
    .filter((m) => m.role === "assistant")
    .map((m) => m.content ?? "");
  const last = userMessages[userMessages.length - 1] ?? "";

  const alreadyShown = assistantMessages.some((m) =>
    m.includes(pack.contact.amazonUrl),
  );
  const haystack = userMessages.join("\n").toLowerCase();
  const suppressed = SUPPRESS_PATTERNS.some((p) => haystack.includes(p));
  const contextual = topicsIn(last).includes("essentials");
  const closing = isClosing(last);

  if (contextual && !alreadyShown && !suppressed) return "CONTEXTUAL";
  if (closing && !alreadyShown && !suppressed) return "CLOSING";
  return "NONE";
}

export function cartInstruction(pack: Pack, directive: CartDirective): string {
  const url = pack.contact.amazonUrl;
  if (directive === "CONTEXTUAL") {
    return `AMAZON DIRECTIVE: CONTEXTUAL. Answer the question fully first. Then, on its own final line, offer the cart exactly as [Shop our recommended Carnival essentials](${url}). Do not offer it more than once.`;
  }
  if (directive === "CLOSING") {
    return `AMAZON DIRECTIVE: CLOSING. Close warmly, then one short line in the spirit of "You are welcome. Before you go, if you are still getting ready for Carnival, we have put together our Carnival Glam Hub Amazon Cart with the things we recommend for Carnival morning and the road." Then, on its own final line, the cart exactly as [Shop the Carnival Glam Hub Amazon Cart](${url}). Never more than once in a conversation.`;
  }
  return "AMAZON DIRECTIVE: NONE. You must not mention or link the Amazon store in this reply, in any form.";
}

/* ------------------------------------------------------------
 * 5. Context and the FACTS block.
 * ------------------------------------------------------------ */

export function territoryIndex(pack: Pack): string {
  const lines = pack.events.map((ev) => {
    const tier = ev.tier ?? "Cruise partnership, no tier";
    const date = ev.dateText || "dates not confirmed";
    return `- ${ev.name}: ${tier}, ${date}${ev.path ? `, ${ev.path}` : ""}`;
  });
  return `## Territory index\n${lines.join("\n")}`;
}

/**
 * The whole "## Prices" section of a brief, from its heading up to the
 * next "## " heading. Slicing the section keeps the day headings and the
 * named-artist sub-heading with their figures, so three different
 * "Makeup only" prices can never arrive in the prompt unlabelled.
 */
export function priceSection(brief: string): string {
  const lines = brief.split("\n");
  const start = lines.findIndex((l) => l.trim() === "## Prices");
  if (start === -1) return "";
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith("## ")) {
      end = i;
      break;
    }
  }
  return lines
    .slice(start, end)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function eventLine(pack: Pack, ev: KnowledgeEvent, now: Date): string {
  const open = ev.seasonEndISO
    ? now.getTime() <= endOfDay(ev.seasonEndISO)
    : false;
  const bookableEvent = Boolean(ev.bookableEvent && ev.bookingUrl);
  const bits = [
    `${ev.name}, ${ev.dateText || "dates not confirmed"}`,
    ev.tier ? ev.tier : "cruise partnership, no tier",
  ];
  const venueLine = pack.territories[ev.slug]?.brief
    .split("\n")
    .find((l) => l.startsWith("Location: "));
  if (venueLine && !venueLine.includes("confirmed after booking")) {
    bits.push(venueLine.replace("Location: ", "venue: ").replace(/\.$/, ""));
  } else {
    bits.push("venue confirmed after booking");
  }
  bits.push(
    open && bookableEvent
      ? "bookings are open"
      : open
        ? "no bookable event is on file yet, so do not offer checkout"
        : "this season has finished, so bookings are closed for it",
  );
  if (ev.path) bits.push(`page ${ev.path}`);
  if (ev.path && !bookableEvent) bits.push(`register interest at ${ev.path}`);
  return `- ${bits.join(". ")}.`;
}

export function buildFacts(
  pack: Pack,
  now: Date,
  territorySlug: string | null,
): string {
  const { upcoming, passed, forward, undated } = resolveEvents(pack, now);
  const today = now.toISOString().slice(0, 10);
  const parts: string[] = [
    "# FACTS FOR THIS TURN",
    "These facts are computed by the server for today's date and are authoritative. Quote them. Do not reason about dates yourself, and never contradict this block.",
    `Today is ${today}.`,
  ];

  if (upcoming.length) {
    parts.push(`The next Glam Hub is:\n${eventLine(pack, upcoming[0], now)}`);
    const following = upcoming.slice(1, 3);
    if (following.length) {
      parts.push(
        `After that:\n${following.map((e) => eventLine(pack, e, now)).join("\n")}`,
      );
    }
  } else {
    parts.push(
      "There is no territory with a confirmed future date in the knowledge pack. Hand the visitor to the team on WhatsApp.",
    );
  }

  for (const ev of forward) {
    parts.push(
      `${ev.name}: the ${ev.dateText.slice(-4)} season has finished and the next season's dates are not yet confirmed. Never describe it as closed for good, and never state a date for the next season.`,
    );
  }

  for (const ev of undated) {
    parts.push(
      `${ev.name}: a territory we serve, with no confirmed dates. Never state or estimate a date for it.`,
    );
  }

  if (passed.length) {
    parts.push(
      `Seasons that have already happened: ${passed
        .map((e) => `${e.name} (${e.dateText})`)
        .join(", ")}. Bookings are closed for those seasons.`,
    );
  }

  if (territorySlug) {
    const territory = pack.territories[territorySlug];
    const ev = pack.events.find((e) => e.slug === territorySlug);
    parts.push(`Resolved territory for this conversation: ${territory.name}.`);
    if (ev) {
      if (ev.seasonForward) {
        parts.push(
          `${territory.name} status: the most recent season has finished and the next dates are not yet confirmed. No bookable event is on file, so do not offer checkout. ${territory.path ? `Point the visitor to register interest at ${territory.path}.` : `Hand the visitor to WhatsApp at ${pack.contact.whatsappUrl}.`}`,
        );
      } else if (!ev.seasonEndISO) {
        parts.push(
          `${territory.name} status: no confirmed dates, so nothing is bookable for a date yet. No bookable event is on file, so do not offer checkout. ${territory.path ? `Point the visitor to register interest at ${territory.path}.` : `Hand the visitor to WhatsApp at ${pack.contact.whatsappUrl}.`}`,
        );
      } else if (now.getTime() <= endOfDay(ev.seasonEndISO) && ev.bookableEvent && ev.bookingUrl) {
        parts.push(
          `${territory.name} status: open. ${ev.dateText}. Bookings are open. The only booking URL for ${territory.name} is ${ev.bookingUrl}. Any booking link in this reply must be that URL. Never link the generic events list.`,
        );
      } else if (now.getTime() <= endOfDay(ev.seasonEndISO)) {
        parts.push(
          `${territory.name} status: ${ev.dateText}. No bookable event is on file, so do not offer checkout. ${territory.path ? `Point the visitor to register interest at ${territory.path}.` : `Hand the visitor to WhatsApp at ${pack.contact.whatsappUrl}.`}`,
        );
      } else {
        parts.push(
          `${territory.name} status: the ${ev.seasonEndISO.slice(0, 4)} season has finished and bookings are closed for it.`,
        );
      }
      if (ev.quotable) {
        const section = priceSection(territory.brief);
        if (section) {
          parts.push(
            `Published prices for ${territory.name}, per masquerader in US dollars. Quote these exactly, with the day they belong to, and never round or estimate:\n${section}`,
          );
        }
      } else {
        parts.push(
          `${territory.name} has no published prices. Do not quote a number for it.`,
        );
      }
    }
  } else {
    parts.push(
      "No territory has been established in this conversation yet. If the answer depends on one, ask which Carnival the visitor is attending, once.",
    );
  }

  return parts.join("\n\n");
}

export function buildKnowledgeContext(
  pack: Pack,
  topics: string[],
  territorySlug: string | null,
): string {
  const parts: string[] = ["# KNOWLEDGE", pack.brand, pack.tiers];
  const territoryEvent = territorySlug
    ? pack.events.find((e) => e.slug === territorySlug)
    : null;
  const territoryHasCheckout = territoryEvent
    ? Boolean(territoryEvent.bookableEvent && territoryEvent.bookingUrl)
    : true;
  // Where a territory is resolved and has its own event on file, the
  // generic events list must not reach the prompt at all. It would drop a
  // visitor who asked about one territory into a list of others.
  const territoryBookingUrl =
    territoryHasCheckout && territoryEvent?.bookingUrl?.includes("/events/")
      ? territoryEvent.bookingUrl
      : null;
  for (const topic of topics) {
    let block =
      topic === "booking" && territorySlug && !territoryHasCheckout
        ? "# Booking status for this territory\nNo bookable event is on file for this territory. Do not offer checkout, do not send the visitor to the booking platform and do not quote a deposit. Use the territory page if it exists, otherwise use the WhatsApp handover."
        : pack.topics[topic];
    if (block && territoryBookingUrl && territoryEvent) {
      block = block.split(pack.contact.bookingUrl).join(territoryBookingUrl);
    }
    if (block) parts.push(block);
  }
  parts.push(
    territorySlug ? pack.territories[territorySlug].brief : territoryIndex(pack),
  );
  let links = territoryHasCheckout
    ? pack.links
    : pack.links.filter((l) => l.label !== "Book now");
  if (territoryBookingUrl && territoryEvent) {
    links = links.map((l) =>
      l.url === pack.contact.bookingUrl
        ? { label: `Book ${territoryEvent.name}`, url: territoryBookingUrl }
        : l,
    );
  }
  parts.push(
    `## LINKS directory\n${links.map((l) => `- ${l.label}: ${l.url}`).join("\n")}`,
  );
  parts.push(`## NEVER SAY\n${pack.neverSay.map((n) => `- ${n}`).join("\n")}`);
  parts.push(
    `## TOPICS WE CANNOT ANSWER\n${pack.unknowns.map((u) => `- ${u}`).join("\n")}`,
  );
  return parts.join("\n\n");
}

/* ------------------------------------------------------------
 * 6. The system prompt.
 * ------------------------------------------------------------ */

export function buildSystemPrompt(pack: Pack, messages: Msg[], now: Date): string {
  const userMessages = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content ?? "");
  const territorySlug = resolveTerritory(pack, userMessages);
  const topics = resolveTopics(userMessages);
  const directive = resolveCartDirective(pack, messages);

  return `You are Glam Bot, the concierge for Carnival Glam Hub. You know this operation from the inside. You are not a general beauty assistant, and you do not answer questions that are not about Carnival Glam Hub.

VOICE
Knowledgeable, warm, direct and brief. British spelling. Never use an em dash. Never use an emoji. Keep exclamation marks to the occasional natural one. Never write hype such as "get ready to hit the road" or "we are so excited". Do not open with filler. Default to under 120 words.

SHAPE OF AN ANSWER
Give the direct answer first. Then the useful context. Then the next action or a link. Never lead with a link, and never answer a question by sending someone somewhere when you could simply tell them.

KNOWLEDGE RULE, ABSOLUTE
Every fact you state must come from the KNOWLEDGE and FACTS blocks in this prompt. You have no other source. You must never invent or estimate a price, date, venue, opening hour, package inclusion, availability, discount, policy, artist name or transport arrangement. If you are not certain the answer is in your knowledge, you do not know it.

WHEN YOU DO NOT KNOW
Say so plainly and hand over: "I do not have that confirmed yet. The Glam Hub team can help you directly on WhatsApp." followed by [Message the Glam Hub team on WhatsApp](${pack.contact.whatsappUrl}). It is always better to say something is not confirmed than to guess.
Whenever you refuse a request or cannot confirm something, always close the reply with the WhatsApp handover link, even if you have also pointed to a policy or booking page.

DESTINATION-FIRST PRICING
Prices and service availability are territory specific. If a territory has been established anywhere in this conversation, use it and do not ask again. Before asking which Carnival, check whether the answer would actually change by territory. If it would not, or if the thing being asked about is not confirmed in any territory, do not ask. Answer or refuse directly instead. Ask only when the territory genuinely determines the answer, such as a price, a date, a venue or whether a service runs there. If no territory has been established and you genuinely cannot answer without one, ask only the question and stop: "Which Carnival are you attending? Pricing and services vary by destination." Never ask which Carnival and then answer in the same reply. If your reply contains an answer or a refusal, it must not contain a clarifying question at all, not even rhetorically or mid sentence. If you can give a useful general answer, give it, and only invite the visitor to name their Carnival at the end if a territory-specific detail would add something. Never quote one global price.

J'OUVERT
You have a jabJab knowledge topic. When a visitor asks about Jab Jab, oil mas, cleaning the oil off, or how to travel to Grenada for Spicemas, answer from it in full rather than saying you do not know, and link the journal post. J'ouvert is a real part of Carnival and you may talk about it as a festival, including pointing a visitor at our journal guides at /blogs. Carnival Glam Hub sells nothing for it. Never offer, imply or quote makeup, hair, a photoshoot, paint, oil or body art for J'ouvert in any territory. If asked, say plainly that we do not do J'ouvert glam because J'ouvert is oil, paint and mud, and offer our Carnival day services instead.

CURRENT VERSUS HISTORICAL
Press coverage describes what we have done. It never establishes where we operate now or what a territory offers this season. The FACTS block is the only authority on what is current.

LINKS
Answer first, then link. Always link to the most specific page that exists, never the home page when a destination or service page covers it. Write links as markdown with descriptive text, for example [View Trinidad Carnival Glam Hub details](/trinidad), never a bare URL. Use the paths in the LINKS directory exactly. Internal paths stay root-relative. For human help use the WhatsApp link. One or two links per reply, never a list of them.
When a territory has been established, any booking link must be that territory's own event URL, exactly as given in its brief and in the FACTS block. Never link the generic events list once a territory is established, and never link it for a territory that has no bookable event.

NEVER SAY
The following must never appear in a reply under any circumstances, including when a visitor asks directly for a discount or a promotion code:
${pack.neverSay.map((n) => `- ${n}`).join("\n")}

TOPICS WE CANNOT ANSWER
Hand these to the team rather than answering:
${pack.unknowns.map((u) => `- ${u}`).join("\n")}

${cartInstruction(pack, directive)}

${buildKnowledgeContext(pack, topics, territorySlug)}

${buildFacts(pack, now, territorySlug)}`;
}
