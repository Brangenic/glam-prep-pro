import { BOOKING_URL } from "@/lib/constants";

const PromoBookingCard = () => {
  return (
    <aside
      className="not-prose my-10 rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:p-7 shadow-sm"
      aria-label="Promotion from Carnival Glam Hub"
    >
      <p className="font-body text-[11px] uppercase tracking-[0.18em] text-primary/80 mb-4">
        From Carnival Glam Hub
      </p>
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
        <img
          src="/blog-images/yuma-ferocious-2027/chloe-1.jpg"
          alt="Carnival makeup by Carnival Glam Hub"
          width={320}
          height={400}
          loading="lazy"
          decoding="async"
          className="w-full sm:w-40 md:w-48 aspect-[4/5] object-cover rounded-xl shrink-0"
        />
        <div className="flex-1">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground leading-snug mb-2">
            Reserve Your Trinidad Carnival 2027 Makeup and Hair Bookings
          </h3>
          <p className="font-body text-foreground/80 leading-relaxed mb-5">
            Lock in your Carnival morning now for only US$50. Early-morning slots go first.
          </p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-mcp-action="register-event"
            className="inline-block rounded-full bg-primary px-7 py-3 text-sm sm:text-base font-bold text-white shadow-md transition-transform hover:scale-[1.02] hover:bg-primary/90 no-underline"
          >
            Reserve My Spot
          </a>
        </div>
      </div>
    </aside>
  );
};

export default PromoBookingCard;