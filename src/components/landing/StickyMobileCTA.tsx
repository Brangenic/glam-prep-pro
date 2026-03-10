const BOOKING_URL = "https://carnivalglamhub.masos.app/events";

const StickyMobileCTA = () => (
  <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-md border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-full bg-primary text-primary-foreground font-body font-semibold text-base py-3.5 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
    >
      Book Your Glam
    </a>
  </div>
);

export default StickyMobileCTA;