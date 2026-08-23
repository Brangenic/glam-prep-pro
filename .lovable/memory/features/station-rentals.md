---
name: Station Rentals
description: B2B /station-rentals page selling Glam Hub station space to independent artists, with tier-derived rates, station spec and payment methods
type: feature
---
Page `/station-rentals` sells station space inside a Glam Hub to independent providers (MUAs, hair stylists, barbers, braiders, body-art and gem artists, lash techs, photographers). Available in every territory with a season still to come, Full Service and Lite.

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

Enquiries go to the `station_rental_enquiries` table: anonymous insert only, no read from the browser.
