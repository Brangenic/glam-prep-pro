---
name: Station Rentals
description: B2B /station-rentals page selling Glam Hub station space to independent artists, with tier-derived rates
type: feature
---
Page `/station-rentals` sells station space inside a Glam Hub to independent providers (MUAs, hair stylists, barbers, braiders, body-art and gem artists, lash techs, photographers). Available in every territory, Full Service and Lite.

Rates (Kibwe, never extrapolate) live in `src/data/stationRentals.ts`, derived from `getHubTier`:
- Glam Hub Lite: US$200 per station per day. No confirmed both-days rate; multi-day confirmed on enquiry.
- Full Service (Trinidad, Jamaica, Miami): US$250 per day, US$400 for both days.

No component may hardcode a rate. Inclusions derive from `getHubInclusions` / `getCapabilities`.

The station is a table and a chair only. Never promise mirrors, ring lights, power outlets, product, assistants or Wi-Fi.

Enquiries go to the `station_rental_enquiries` table: anonymous insert only, no read from the browser.
