const StickyMobileCTA = () => (
  <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-sm border-t border-border p-4">
    <a
      href="#destinations"
      className="flex items-center justify-center w-full bg-primary text-primary-foreground font-display font-bold text-base py-3.5 rounded-lg hover:opacity-90 transition-opacity"
    >
      Book Your Glam
    </a>
  </div>
);

export default StickyMobileCTA;
