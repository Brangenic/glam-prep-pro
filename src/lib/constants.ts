// Single source of truth for the external booking destination.
// Use this everywhere the user is sent to "Book now". The URL is
// external (MasOS), so always render with <a href={BOOKING_URL}
// target="_blank" rel="noopener">…</a>.
export const BOOKING_URL = "https://carnivalglamhub.masos.app/events";