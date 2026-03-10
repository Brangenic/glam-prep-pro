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
    <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
    <div className="relative z-10 container mx-auto px-6 py-32 lg:py-0">
      <div className="max-w-2xl">
        <p className="font-body text-sm uppercase tracking-[0.3em] text-primary mb-6">
          Premium Carnival Preparation
        </p>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6">
          Your Carnival Morning{" "}
          <span className="text-gradient-primary">Starts Here</span>
        </h1>
        <p className="font-body text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg">
          Luxury glam, costume dressing, and concierge-style preparation for
          masqueraders who want to hit the road looking flawless.
        </p>
        <a
          href="#destinations"
          className="inline-flex items-center gap-3 bg-primary text-primary-foreground font-display font-bold text-lg px-8 py-4 rounded-lg hover:opacity-90 transition-opacity"
        >
          Choose Your Destination
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  </section>
);

export default Hero;
