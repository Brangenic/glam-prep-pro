import { hasSeasonPassed } from "@/data/seasons";
import { OVERNIGHT_BAG_CHECK_PRICE } from "@/data/territoryPricing";

/**
 * Miami copy that depends on the season calendar. Shared by the React
 * pages and the prerender scripts so both surfaces always agree.
 *
 * Miami 2026 wrapped on 11 October 2026. The 2026 venue, hotel and
 * shuttle constants in hubTiers.ts stay as the historical record, but
 * nothing renders them as current once the season has passed. The 2027
 * date and the 2027 shuttle decision are not confirmed, so nothing here
 * states one.
 */

export const MIAMI_NEXT_SEASON_NOTE =
  "Miami details for the next season will be confirmed when dates are announced.";

/** True while the Miami 2026 logistics may still be shown as current. */
export function isMiamiSeasonLive(today: Date = new Date()): boolean {
  return !hasSeasonPassed("miami", today);
}

export const OVERNIGHT_BAG_CHECK_SENTENCE = `Overnight bag check is a paid add-on at US$${OVERNIGHT_BAG_CHECK_PRICE} per masquerader. You can come back to the hotel that night or early the next morning and collect your bag yourself, or opt for delivery the following day at additional cost, confirmed when you book.`;

/** FAQ answer for "Do you offer a shuttle service?". */
export const SHUTTLE_FAQ_ANSWER = `Shuttle is a Full Service Glam Hub inclusion and runs in Jamaica and Trinidad. ${MIAMI_NEXT_SEASON_NOTE} Glam Hub Lite territories do not include a shuttle. ${OVERNIGHT_BAG_CHECK_SENTENCE}`;

/** Best carnival makeup Miami page, location answer. */
export function miamiBestLocationAnswer(today: Date = new Date()): string {
  return isMiamiSeasonLive(today)
    ? "A dedicated Miami Carnival lounge covering Columbus Day weekend, with makeup, hair, dressing and photoshoot in one location so you arrive at the band on time."
    : `Miami Carnival 2026 has wrapped. ${MIAMI_NEXT_SEASON_NOTE}`;
}

/** Best carnival makeup Miami page, booking answer. */
export function miamiBestBookingAnswer(today: Date = new Date()): string {
  return isMiamiSeasonLive(today)
    ? "Choose your Miami slot at carnivalglamhub.masos.app/events and your booking team will confirm your appointment. Appointments are booked by time slot and the popular times go first."
    : "Miami Carnival 2026 has wrapped and bookings are closed. Miami bookings reopen when the next season's dates are confirmed. Until then you can see the 2026 looks in our Gallery.";
}
