import { trackBookingCtaClick } from "@/lib/tracking";
import { BOOK_TERRITORY_ANCHOR, getActiveBookingTerritories } from "@/lib/bookingBar";

type Props = {
  /** Set on the hero copy only, so the page has one scroll target. */
  anchor?: boolean;
  /** UTM campaign, so the hero and closing card are told apart. */
  campaign?: string;
  /** Visual tone for the surface it sits on. */
  tone?: "dark" | "light";
  heading?: string;
};

/**
 * One large button per territory on sale, each going straight to that
 * territory's own MasOS event in a new tab. The list comes from
 * getActiveBookingTerritories, never from a hand kept array.
 */
const TerritoryBookingRow = ({ anchor = false, campaign = "home_booking_bar", tone = "dark", heading = "Book now" }: Props) => {
  const territories = getActiveBookingTerritories(new Date(), campaign);
  if (territories.length === 0) return null;
  const label = tone === "dark" ? "text-white/80" : "text-muted-foreground";
  return (
    <nav
      id={anchor ? BOOK_TERRITORY_ANCHOR : undefined}
      aria-label="Book by territory"
      className="w-full scroll-mt-28"
      data-booking-row="true"
    >
      <p className={`font-body text-xs uppercase tracking-[0.2em] font-semibold mb-3 ${label}`}>{heading}</p>
      <ul
        className="grid gap-2 sm:gap-3 w-full"
        style={{ gridTemplateColumns: `repeat(${territories.length}, minmax(0, 1fr))` }}
      >
        {territories.map((t) => (
          <li key={t.slug}>
            <a
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              data-territory={t.slug}
              data-mcp-action="register-event"
              data-mcp-description={`Book Carnival Glam Hub for ${t.shortName} on the booking platform.`}
              onClick={() => trackBookingCtaClick()}
              className="flex min-h-[56px] h-full flex-col items-center justify-center rounded-2xl bg-primary px-2 py-3 text-center text-primary-foreground font-body font-semibold text-sm sm:text-base leading-tight hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              <span>{t.shortName}</span>
              {t.preRegister && (
                <span className="mt-0.5 text-[11px] sm:text-xs font-medium opacity-85">(pre-register)</span>
              )}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TerritoryBookingRow;
