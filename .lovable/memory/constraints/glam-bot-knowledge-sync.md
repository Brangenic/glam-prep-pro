---
name: Glam Bot knowledge sync
description: Glam Bot knowledge is generated from src/data via botKnowledge.ts. Never hand-write bot facts, never hand-edit knowledge.json, always resync in the same change set.
type: constraint
---
Glam Bot's knowledge is generated from `src/data/`, never hand-written, and never a second copy of a fact. `src/data/botKnowledge.ts` composes the pack and `scripts/generate-bot-knowledge.ts` writes `supabase/functions/chat/knowledge.json` on predev and prebuild.

Rules:
- Any factual change to the site, a price, a date, a venue, a tier, a policy clause, a press story, a station or vendor rate, must be reflected in the pack in the same change set.
- Anything added outside `src/data/` must be wired into `botKnowledge.ts` in the same change.
- Never hand-edit `supabase/functions/chat/knowledge.json`. It is generated output.
- Bot logic lives in `supabase/functions/chat/logic.ts` with no imports, so it stays testable. `index.ts` is transport only.
- Run `npm run test` before publishing. `src/test/glamBotKnowledge.test.ts` fails on drift between `destinations.ts` and `territoryProfiles.ts` and on a stale generated pack.

**Why:** Kibwe's standing rule, 24 August 2026. Site content and bot answers must never be inconsistent. Full detail in `GLAM_BOT_RULES.md` and `CLAUDE.md`.
