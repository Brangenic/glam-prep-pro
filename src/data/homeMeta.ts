import { SEASON_END_DATES, hasSeasonPassed } from "@/data/seasons";
import { TRINIDAD_BOOK_CATALOGUE as C } from "@/data/trinidadBookPage";

/** Dates come from the season calendar and the existing two-day catalogue. */
export function homeMetaDescription(now = new Date()) {
  const format = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const bookable = [
    !hasSeasonPassed("trinidad", now) ? `Trinidad, ${new Date(`${C.dates[0].date}T00:00:00Z`).getUTCDate()} and ${format(SEASON_END_DATES.trinidad)}` : "",
    !hasSeasonPassed("jamaica", now) ? `Jamaica, ${format(SEASON_END_DATES.jamaica)}` : "",
  ].filter(Boolean);
  return bookable.length ? `Book Carnival makeup and photos: ${bookable.join("; ")}. Choose your Carnival morning appointment.` : "Carnival makeup, hair and photos across the Caribbean. Explore Carnival Glam Hub and enquire about the next season.";
}