import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => (
  <section
    id="hero"
    className="relative min-h-screen flex items-center justify-center overflow-hidden"
  >
    <img
      src={heroBg}
      alt="Carnival masquerader in full glam"
      className="absolute inset-0 w-full h-full object-cover object-top"
      loading="eager"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/20" />
    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />
    <div className="relative z-10 container mx-auto px-6 py-32 lg:py-0">
      <div className="max-w-2xl">
        <p className="font-body text-sm uppercase tracking-[0.3em] text-primary mb-6 animate-fade-in">
          Premium Carnival Preparation
        </p>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6 animate-fade-up">
          Your Carnival Morning{" "}
          <span className="text-gradient-primary">Starts Here</span>
        </h1>
        <p className="font-body text-lg sm:text-xl text-foreground/70 leading-relaxed mb-4 max-w-lg animate-fade-up" style={{ animationDelay: "0.15s" }}>
          Luxury glam, costume dressing, and concierge-style preparation for
          masqueraders who want to hit the road looking flawless.
        </p>
        <p className="font-body text-base text-muted-foreground leading-relaxed mb-10 max-w-lg animate-fade-up" style={{ animationDelay: "0.25s" }}>
          From makeup to final touches — we handle everything so you can focus on the experience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.35s" }}>
          <a
            href="#book"
            className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground font-display font-bold text-base px-8 py-4 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            Book Your Carnival Glam
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a
            href="#destinations"
            className="inline-flex items-center justify-center gap-2 border border-foreground/20 text-foreground font-display font-bold text-sm px-8 py-4 rounded-lg hover:border-secondary hover:text-secondary transition-colors"
          >
            Choose Your Destination
          </a>
        </div>
      </div>
    </div>
    {/* Scroll indicator */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden lg:block">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
        <path d="M12 5v14m0 0l-6-6m6 6l6-6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  </section>
);

export default Hero;
