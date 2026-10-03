---
name: AI booking app
description: Glam Hub MCP app for ChatGPT and Claude, Trinidad 2027 makeup and photoshoot only, own Stripe, 3 per slot, pay in full, no discounts
type: feature
---
- Trinidad Carnival 2027 only, Monday 8 and Tuesday 9 February 2027, at the Hilton Hotel, Port of Spain.
- Eight products only: mon/tue/both makeup, mon/tue/both makeup and photoshoot, mon/tue photoshoot. Standard artists only.
- Shuttle, getting-dressed assistance and refreshments included free.
- Slots 04:00 to 08:00, capacity 3 each. Both-days holds one slot on each day.
- Pay in full at booking via Stripe Checkout on our own account. No MasOS. No discount codes ever.
- Collect only first name, last name, email, cell, plus required Terms acceptance.
- Catalogue generated from src/data, never hand-edited. Fallback with no Stripe key: send to JADE on WhatsApp the site WhatsApp number (WHATSAPP_URL, +1 876 509 0997).
- Phase 2: Stripe webhook confirms payment (amount must match). Accounts email to carnivalglamhub@gmail.com, subject starts "ACCOUNTS |". Receipt "You're booked, Glam Girl. Trinidad Carnival 2027", never shows the booking reference. Sent via Gmail connector; skipped and retried if not linked. Owner confirmed Talk to JADE uses the site number +1 876 509 0997, read from WHATSAPP_URL.
