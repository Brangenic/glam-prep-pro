const outlets = [
  "Loop Caribbean",
  "Carnival Hub",
  "Soca News",
  "Island Origins",
  "We Are Carnival",
  "Caribbean Beat",
];

const PressBar = () => (
  <section
    aria-label="As featured in"
    className="border-y border-primary/10 bg-background"
  >
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <p className="text-center font-body text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6 sm:mb-8">
        <span className="inline-block px-3">As Featured In</span>
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-5 items-center">
        {outlets.map((name) => (
          <div
            key={name}
            className="text-center font-display italic text-base sm:text-lg text-foreground/55 hover:text-primary transition-colors duration-300 tracking-wide"
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PressBar;