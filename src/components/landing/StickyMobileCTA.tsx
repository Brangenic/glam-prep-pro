const BOOKING_URL = "https://carnivalglamhub.masos.app/events";

const StickyMobileCTA = () => (
  <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-md border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-mcp-action="register-event"
      data-mcp-description="Register and pay a deposit for a Carnival Glam Hub event, by territory and date."
      onClick={() => {
        if (typeof window !== "undefined" && typeof window.gtag !== "undefined") {
          window.gtag("event", "conversion", {
            send_to: "AW-10894663311/zIoVCMj-iLAcEI-9_coo",
            value: 1.0,
            currency: "USD",
          });
        }
      }}
      className="flex items-center justify-center w-full bg-primary text-primary-foreground font-body font-semibold text-base py-3.5 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
    >
      Book Your Glam
    </a>
  </div>
);

export default StickyMobileCTA;