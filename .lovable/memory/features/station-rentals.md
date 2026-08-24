---
name: Station Rentals
description: B2B /station-rentals page selling Glam Hub station space to independent artists, with tier-derived rates, station spec and payment methods
type: feature
---
Page `/station-rentals` sells station space inside a Glam Hub to independent providers. A station is for **makeup artists and hair stylists only** (Kibwe, 24 Aug 2026). Braiders, barbers, body-art and gem artists, lash techs and photographers are NOT offered and must never be reintroduced, softened into "and similar", or kept as examples. Available in every territory with a season still to come, Full Service and Lite.

Second, separate offer on the same page: **vendor and merchandise spaces**. A space inside the Glam Hub to sell products to masqueraders on Carnival morning (Monday wear, costume accessories, merchandise). Never present it as a station. Vendor gets the space plus access to card processing at the hub, nothing else; everything else is confirmed on enquiry. Rates (Kibwe, 24 Aug 2026): US$250 per day, US$400 for both days, FLAT at every hub. Held as `VENDOR_SPACE_PER_DAY` / `VENDOR_SPACE_BOTH_DAYS` constants and deliberately NOT wired to `getHubTier`. The resulting Glam Hub Lite gap (station US$200/day vs vendor US$250/day) is intentional and confirmed.

Rates (Kibwe, never extrapolate) live in `src/data/stationRentals.ts`, derived from `getHubTier`:
- Glam Hub Lite: US$200 per station per day. No confirmed both-days rate; multi-day confirmed on enquiry.
- Full Service (Trinidad, Jamaica, Miami): US$250 per day, US$400 for both days.
- Optional extra: high chair rental US$25 per day (`HIGH_CHAIR_RATE_PER_DAY`).

No component may hardcode a rate. Inclusions derive from `getHubInclusions` / `getCapabilities`.

Station spec, identical at both tiers, exact and never embellished:
- Provided: 6ft truss table, table cloth, access to a plug, 2 regular chairs.
- Renter brings: high chair, ring light, extension cord and multiplug (everyone carries their own, no exceptions).
Never promise mirrors, ring lights, product, assistants or Wi-Fi.

What differs between tiers is the hub around the station, not the station. A renter's clients get all hotel and location amenities available to Glam Hub masqueraders in that territory.

Payment: Zelle, PayPal or a secure online Stripe link. Details sent when the station is confirmed. Never publish a handle, address or URL.

Proof section "See inside a Glam Hub" uses our own Trinidad footage: wide `HWFyXB1tyIU` on desktop, vertical short `dK5HLseeWYw` on mobile, via `YouTubeEmbed`. A `VideoObject` for the wide cut is prerendered on the route.

Enquiries go to the `station_rental_enquiries` table: anonymous insert only, no read from the browser. Every row carries `enquiry_type` ("Station rental" or "Vendor and merchandise space"); `service_type` is only collected for station enquiries.
