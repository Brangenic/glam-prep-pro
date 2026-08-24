import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import knowledge from "./knowledge.json" with { type: "json" };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/* ============================================================
 * The knowledge pack is generated from the site's own data
 * modules by scripts/generate-bot-knowledge.ts. This function
 * holds NO business facts of its own. It contributes logic only:
 * resolving today, the territory, the topics and the Amazon
 * directive, then assembling a prompt out of the pack.
 * ============================================================ */

type Msg = { role: "user" | "assistant" | "system"; content: string };

type KnowledgeEvent = {
  slug: string;
  name: string;
  dateText: string;
  seasonEndISO: string | null;
  path: string | null;
  bookingUrl: string;
  quotable: boolean;
  tier: string | null;
  seasonForward: boolean;
};

type Territory = {
  name: string;
  aliases: string[];
  path: string | null;
  brief: string;
};

type Pack = {
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

const pack = knowledge as unknown as Pack;

/* ------------------------------------------------------------
 * 1. Resolve today, at request time, never at build time.
 * ------------------------------------------------------------ */

/** Matches src/data/seasons.ts: a season closes at the end of its last day. */
function endOfDay(iso: string): number {
  return new Date(`${iso}T23:59:59Z`).getTime();
}

type ResolvedEvents = {
  upcoming: KnowledgeEvent[];
  passed: KnowledgeEvent[];
  forward: KnowledgeEvent[];
  undated: KnowledgeEvent[];
};

function resolveEvents(now: Date): ResolvedEvents {
  const t = now.getTime();
  const upcoming: KnowledgeEvent[] = [];
  const passed: KnowledgeEvent[] = [];
  const forward: KnowledgeEvent[] = [];
  const undated: KnowledgeEvent[] = [];

  for (const ev of pack.events) {
    if (!ev.seasonEndISO) {
      undated.push(ev);
      continue;
    }
    const ended = t > endOfDay(ev.seasonEndISO);
    if (ev.seasonForward) {
      // Never described as closed. It points forward to a season with
      // no confirmed dates, so it takes no place in the ordering.
      forward.push(ev);
      continue;
    }
    if (ended) passed.push(ev);
    else upcoming.push(ev);
  }

  upcoming.sort(
    (a, b) => endOfDay(a.seasonEndISO!) - endOfDay(b.seasonEndISO!),
  );
  passed.sort((a, b) => endOfDay(b.seasonEndISO!) - endOfDay(a.seasonEndISO!));
  return { upcoming, passed, forward, undated };
}

/* ------------------------------------------------------------
 * 2. Resolve the territory, and make it sticky.
 * ------------------------------------------------------------ */

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesAlias(text: string, alias: string): boolean {
  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(alias)}([^a-z0-9]|$)`, "i").test(
    text,
  );
}

/**
 * Scans user messages newest first. The most recent alias match wins and
 * holds for the rest of the session, so a follow-up question does not
 * have to name the territory again.
 */
export function resolveTerritory(userMessages: string[]): string | null {
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
 * 3. Resolve topics.
 * ------------------------------------------------------------ */

const TOPIC_KEYWORDS: Record<string, string[]> = {
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
};

function topicsIn(text: string): string[] {
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
 * 6. Amazon cart directive, decided server side.
 * ------------------------------------------------------------ */

const SUPPRESS_PATTERNS = [
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

const SIGN_OFFS = [
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

const INTERROGATIVES = [
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

const SERVICE_OR_PRICE_KEYWORDS = [
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

export type CartDirective = "NONE" | "CONTEXTUAL" | "CLOSING";

export function resolveCartDirective(messages: Msg[]): CartDirective {
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

function cartInstruction(directive: CartDirective): string {
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
 * 4 and 5. Context and the FACTS block.
 * ------------------------------------------------------------ */

function territoryIndex(): string {
  const lines = pack.events.map((ev) => {
    const tier = ev.tier ?? "Cruise partnership, no tier";
    const date = ev.dateText || "dates not confirmed";
    return `- ${ev.name}: ${tier}, ${date}${ev.path ? `, ${ev.path}` : ""}`;
  });
  return `## Territory index\n${lines.join("\n")}`;
}

function priceLines(brief: string): string[] {
  return brief
    .split("\n")
    .filter((l) => l.startsWith("- ") && l.includes("US$"));
}

function eventLine(ev: KnowledgeEvent, now: Date): string {
  const open = ev.seasonEndISO
    ? now.getTime() <= endOfDay(ev.seasonEndISO)
    : false;
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
    open
      ? "bookings are open"
      : "this season has finished, so bookings are closed for it",
  );
  if (ev.path) bits.push(`page ${ev.path}`);
  return `- ${bits.join(". ")}.`;
}

function buildFacts(messages: Msg[], now: Date, territorySlug: string | null): string {
  const { upcoming, passed, forward, undated } = resolveEvents(now);
  const today = now.toISOString().slice(0, 10);
  const parts: string[] = [
    "# FACTS FOR THIS TURN",
    "These facts are computed by the server for today's date and are authoritative. Quote them. Do not reason about dates yourself, and never contradict this block.",
    `Today is ${today}.`,
  ];

  if (upcoming.length) {
    parts.push(
      `The next Glam Hub is:\n${eventLine(upcoming[0], now)}`,
    );
    const following = upcoming.slice(1, 3);
    if (following.length) {
      parts.push(
        `After that:\n${following.map((e) => eventLine(e, now)).join("\n")}`,
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
          `${territory.name} status: the most recent season has finished and the next dates are not yet confirmed.`,
        );
      } else if (!ev.seasonEndISO) {
        parts.push(
          `${territory.name} status: no confirmed dates, so nothing is bookable for a date yet.`,
        );
      } else if (now.getTime() <= endOfDay(ev.seasonEndISO)) {
        parts.push(
          `${territory.name} status: open. ${ev.dateText}. Bookings are open.`,
        );
      } else {
        parts.push(
          `${territory.name} status: the ${ev.seasonEndISO.slice(0, 4)} season has finished and bookings are closed for it.`,
        );
      }
      if (ev.quotable) {
        const lines = priceLines(territory.brief);
        if (lines.length) {
          parts.push(
            `Published prices for ${territory.name}, per masquerader in US dollars. Quote these exactly and never round or estimate:\n${lines.join("\n")}`,
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

function buildKnowledgeContext(topics: string[], territorySlug: string | null): string {
  const parts: string[] = ["# KNOWLEDGE", pack.brand, pack.tiers];
  for (const topic of topics) {
    const block = pack.topics[topic];
    if (block) parts.push(block);
  }
  parts.push(
    territorySlug
      ? pack.territories[territorySlug].brief
      : territoryIndex(),
  );
  parts.push(
    `## LINKS directory\n${pack.links.map((l) => `- ${l.label}: ${l.url}`).join("\n")}`,
  );
  parts.push(`## NEVER SAY\n${pack.neverSay.map((n) => `- ${n}`).join("\n")}`);
  parts.push(
    `## TOPICS WE CANNOT ANSWER\n${pack.unknowns.map((u) => `- ${u}`).join("\n")}`,
  );
  return parts.join("\n\n");
}

/* ------------------------------------------------------------
 * 7. The system prompt.
 * ------------------------------------------------------------ */

export function buildSystemPrompt(messages: Msg[], now: Date): string {
  const userMessages = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content ?? "");
  const territorySlug = resolveTerritory(userMessages);
  const topics = resolveTopics(userMessages);
  const directive = resolveCartDirective(messages);

  return `You are Glam Bot, the concierge for Carnival Glam Hub. You know this operation from the inside. You are not a general beauty assistant, and you do not answer questions that are not about Carnival Glam Hub.

VOICE
Knowledgeable, warm, direct and brief. British spelling. Never use an em dash. Never use an emoji. Keep exclamation marks to the occasional natural one. Never write hype such as "get ready to hit the road" or "we are so excited". Do not open with filler. Default to under 120 words.

SHAPE OF AN ANSWER
Give the direct answer first. Then the useful context. Then the next action or a link. Never lead with a link, and never answer a question by sending someone somewhere when you could simply tell them.

KNOWLEDGE RULE, ABSOLUTE
Every fact you state must come from the KNOWLEDGE and FACTS blocks in this prompt. You have no other source. You must never invent or estimate a price, date, venue, opening hour, package inclusion, availability, discount, policy, artist name or transport arrangement. If you are not certain the answer is in your knowledge, you do not know it.

WHEN YOU DO NOT KNOW
Say so plainly and hand over: "I do not have that confirmed yet. The Glam Hub team can help you directly on WhatsApp." followed by [Message the Glam Hub team on WhatsApp](${pack.contact.whatsappUrl}). It is always better to say something is not confirmed than to guess.

DESTINATION-FIRST PRICING
Prices and service availability are territory specific. If a territory has been established anywhere in this conversation, use it and do not ask again. If none has been established and the answer depends on it, ask once: "Which Carnival are you attending? Pricing and services vary by destination." Never quote one global price.

CURRENT VERSUS HISTORICAL
Press coverage describes what we have done. It never establishes where we operate now or what a territory offers this season. The FACTS block is the only authority on what is current.

LINKS
Answer first, then link. Always link to the most specific page that exists, never the home page when a destination or service page covers it. Write links as markdown with descriptive text, for example [View Trinidad Carnival Glam Hub details](/trinidad), never a bare URL. Use the paths in the LINKS directory exactly. Internal paths stay root-relative. For human help use the WhatsApp link. One or two links per reply, never a list of them.

NEVER SAY
The following must never appear in a reply under any circumstances, including when a visitor asks directly for a discount or a promotion code:
${pack.neverSay.map((n) => `- ${n}`).join("\n")}

TOPICS WE CANNOT ANSWER
Hand these to the team rather than answering:
${pack.unknowns.map((u) => `- ${u}`).join("\n")}

${cartInstruction(directive)}

${buildKnowledgeContext(topics, territorySlug)}

${buildFacts(messages, now, territorySlug)}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = buildSystemPrompt(
      (messages ?? []) as Msg[],
      new Date(),
    );

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
