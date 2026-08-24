# Glam Bot rules

This document is the contract for Glam Bot, the concierge on
carnivalglamhub.com. Read it before changing anything the bot answers
from. British spelling, no em dashes.

## 1. Where the knowledge comes from

Glam Bot holds no facts of its own. Every sentence it can say is derived
from the site's own single sources of truth:

| Module | What it owns |
| --- | --- |
| `src/data/territoryProfiles.ts` | Territory names, short names, date text, site paths, venues, aliases |
| `src/data/hubTiers.ts` | The two tiers, inclusions, what Lite does not offer, territory-scoped capabilities, Miami logistics |
| `src/data/territoryPricing.ts` | Every published price, per territory, per day, standard and named artist |
| `src/data/seasons.ts` | Season end dates and the forward-selling exceptions |
| `src/data/policies.ts` | Terms, refunds, transfers, privacy, the deposit figure |
| `src/data/pressCoverage.ts` | Verified press stories |
| `src/data/stationRentals.ts` | Station spec, tier rates, vendor and merchandise space rates, payment note |
| `src/lib/constants.ts` | Booking URL, site URL, Amazon storefront, WhatsApp, contact email |

`src/data/destinations.ts` imports image assets, so no build script may
import it. `territoryProfiles.ts` mirrors its names and dates and a drift
test proves they match.

## 2. The generation pipeline

```
src/data/*  ->  src/data/botKnowledge.ts  ->  scripts/generate-bot-knowledge.ts
            ->  supabase/functions/chat/knowledge.json  ->  the edge function
```

`botKnowledge.ts` composes a `KnowledgePack`: brand, tiers, events,
territories (a markdown brief each), topics, links, `neverSay` and
`unknowns`. The generator runs on `predev` and `prebuild`, so the pack is
never stale in a build.

Never hand-edit `supabase/functions/chat/knowledge.json`. It is generated
output and a test fails the moment it diverges from a fresh build.

## 3. Retrieval logic

All of it lives in `supabase/functions/chat/logic.ts`, which has no
imports and touches no Deno API, so the Vitest suite can prove it.
`supabase/functions/chat/index.ts` is only CORS, loading the pack,
`buildSystemPrompt`, the gateway call and the stream.

Per turn the server resolves:

- **Today**, at request time. Season status is never baked into the pack.
- **The territory**, sticky. User messages are scanned newest first and
  the longest alias match wins, so a follow-up need not name the
  territory again.
- **The topics**, from keyword matches in the last two user messages,
  with `about` and `booking` always added.
- **The Amazon cart directive**, server side, one of `NONE`,
  `CONTEXTUAL` or `CLOSING`.

It then assembles a KNOWLEDGE block (brand, tiers, matched topics, the
resolved territory brief or the territory index, the links directory, the
never-say list, the unknowns) and a FACTS block computed for today.

## 4. Source-of-truth hierarchy

In this order. Higher always wins.

1. An explicit current instruction from Kibwe
2. Current structured project data in `src/data/`
3. Current booking product data
4. Current destination pages
5. Current general service pages
6. Historical content, including press and blog posts

Anything that cannot be reconciled is flagged, never guessed.

## 5. No hallucination

The bot may never invent or estimate a price, date, venue, opening hour,
inclusion, availability, discount, policy, artist name or transport
arrangement. Where a fact is absent it says so and hands over to WhatsApp.
`neverSay` and `unknowns` in the pack are hard guardrails, including the
rule that the word "masos" may only ever appear inside a URL.

## 6. Destination-aware pricing

There is no global price. Prices sit per territory and per day. If a
territory has been established anywhere in the conversation the bot uses
it. If none has and the answer depends on one, it asks once. The FACTS
block carries the resolved territory's whole `## Prices` section with its
day headings intact, so three different "Makeup only" figures can never
arrive unlabelled.

## 7. Conversation context

Territory stickiness is described above. The most recent territory
mentioned wins, so "and Trinidad?" after a Miami question moves the
conversation to Trinidad.

## 8. Links

Answer first, then link. Always the most specific page. Markdown with
descriptive text, never a bare URL. Only paths from the links directory,
which is built from `territoryProfiles.ts` plus the service, policy and
utility pages. Every entry must resolve against the route table in
`src/App.tsx`.

## 9. The Amazon cart rules

Three directives, decided server side, never by the model.

- `CONTEXTUAL`: the visitor asked what to bring or pack. Answer fully
  first, then one offer line.
- `CLOSING`: a genuine sign-off. A short warm close, then one offer line.
- `NONE`: anything else, and the model is told it must not mention the
  store at all.

Suppressions, any one of which forces `NONE`:

- Complaint language anywhere in the user's messages
- Refund, cancellation, money back, chargeback or dispute
- A request for a human
- An active booking or payment flow, including "pay", "checkout",
  "my booking", "reschedule"
- A sign-off that carries a question mark, an interrogative word, a
  service or price keyword, or runs over eight words
- The Amazon URL already appearing in an earlier assistant message

The URL is always the verified one from `src/lib/constants.ts`.

## 10. Update and synchronisation

Any change to factual content on the site must be reflected in the pack
in the same change set. Because the pack is generated from `src/data/`,
editing a data module and rebuilding is usually the whole job. Anything
added outside `src/data/` must be wired into `botKnowledge.ts` in the
same change.

## 11. Testing

`src/test/glamBotKnowledge.test.ts` is the gate. It covers drift between
`destinations.ts` and `territoryProfiles.ts`, the generated file matching
a fresh build, twenty knowledge questions, four refusals, forbidden
strings, context stickiness, the cart directive and season awareness at a
fixed clock. Run `npm run test` before publishing.

## 12. Fallback behaviour

If the bot is unsure, it says so plainly and hands over on WhatsApp. If
the gateway rate limits or runs out of credit, the function returns the
status through to the widget rather than inventing a reply. If no
territory has a confirmed future date, the FACTS block says so and sends
the visitor to the team.

## 13. How to change a price, worked example

Trinidad Carnival Monday makeup moves from US$180 to US$190.

1. Edit the one line in `src/data/territoryPricing.ts`:
   `{ id: "mon-makeup", label: "Makeup only", price: 190, day: "monday", ... }`
2. Rebuild, which regenerates the pack:
   `npx tsx scripts/generate-bot-knowledge.ts`
3. Run `npm run test`.
4. Commit both the data change and the regenerated
   `supabase/functions/chat/knowledge.json`.

That is the whole procedure. No component, page, prerender script or bot
string holds a second copy of the figure.
