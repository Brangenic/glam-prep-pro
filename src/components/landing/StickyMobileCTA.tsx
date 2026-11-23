import { trackBookingCtaClick } from "@/lib/tracking";
import { useBookNowLink } from "@/hooks/useBookNowLink";
import { hideUnderLightbox } from "@/lib/lightboxLayer";

/**
 * Mobile booking bar. On a territory page it books that territory's own
 * MasOS event; everywhere else it goes to the homepage territory row, so
 * the visitor picks a territory rather than landing on the bare events list.
 */
const StickyMobileCTA = () => {
  const bookNow = useBookNowLink("sticky_mobile_cta");
  return (
    <div {...hideUnderLightbox} data-testid="sticky-mobile-cta" className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-md border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <a
        href={bookNow.href}
        {...(bookNow.external
          ? {
              target: "_blank",
              rel: "noopener noreferrer",
              "data-mcp-action": "register-event",
              "data-mcp-description": "Register and pay a deposit for a Carnival Glam Hub event, by territory and date.",
            }
          : {})}
        onClick={() => {
          if (bookNow.external) trackBookingCtaClick();
        }}
        className="flex items-center justify-center w-full min-h-[52px] bg-primary text-primary-foreground font-body font-semibold text-base py-3.5 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
      >
        Book Your Glam
      </a>
    </div>
  );
};

export default StickyMobileCTA;
