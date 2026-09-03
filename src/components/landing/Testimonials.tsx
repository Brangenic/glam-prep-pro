import { useScrollReveal } from "@/hooks/useScrollReveal";
import { featuredReviews } from "@/components/landing/reviewsData";

const Testimonials = () => {
  const { ref, isVisible } = useScrollReveal();
  const testimonials = featuredReviews.slice(0, 3);

  return (
    <section id="reviews" className="section-y bg-card/50">
      <div ref={ref} className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <p className={`font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4 transition-all duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}>Testimonials</p>
          <h2
            className={`font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5 sm:mb-6 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            What Masqueraders <span className="italic text-gradient-primary">Are Saying</span>
          </h2>
          <div className={`flex flex-col items-center justify-center gap-4 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}>
            <div className="flex items-center justify-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-body text-xs text-muted-foreground font-medium">
                Real client reviews
              </span>
            </div>
            <a
              href="/reviews"
              className="inline-flex items-center rounded-full border border-border bg-background px-4 py-2 font-body text-xs font-semibold text-foreground transition-colors hover:border-primary/25 hover:text-primary"
            >
              Read more reviews
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {testimonials.map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              className={`relative bg-card border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 hover:border-primary/20 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${300 + i * 150}ms` }}
            >
              <span className="font-display text-5xl sm:text-6xl text-secondary/30 leading-none absolute top-2 left-4 sm:top-3 sm:left-6">
                &ldquo;
              </span>
              <p className="font-body text-foreground/85 leading-relaxed mb-6 sm:mb-8 pt-6 sm:pt-8 text-sm sm:text-[15px]">
                {t.quote}
              </p>
              <div>
                <p className="font-body text-sm font-semibold">{t.name}</p>
                <p className="font-body text-xs text-muted-foreground">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;