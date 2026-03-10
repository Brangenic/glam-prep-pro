import { useScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  {
    quote: "This was the best decision I made for Carnival morning. Everything was organized and the glam was flawless.",
    name: "Alicia M.",
    detail: "Jamaica Carnival 2024",
  },
  {
    quote: "No stress, no rushing. I showed up and they handled everything. I felt like a queen before I even reached the band.",
    name: "Keisha T.",
    detail: "Saint Lucia Carnival 2023",
  },
  {
    quote: "The team made my carnival morning feel like a luxury experience. The photos alone were worth it.",
    name: "Danielle R.",
    detail: "Jamaica Carnival 2024",
  },
];

const Testimonials = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="reviews" className="py-24 lg:py-32 bg-card/50">
      <div ref={ref} className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className={`font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4 transition-all duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}>Testimonials</p>
          <h2
            className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            What Masqueraders <span className="italic text-gradient-primary">Are Saying</span>
          </h2>
          <div className={`flex items-center justify-center gap-3 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="font-body text-xs text-muted-foreground font-medium">
              5.0 · Google Reviews
            </span>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`relative bg-card border border-border rounded-2xl p-8 lg:p-10 hover:border-primary/20 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${300 + i * 150}ms` }}
            >
              <span className="font-display text-6xl text-secondary/30 leading-none absolute top-3 left-6">
                &ldquo;
              </span>
              <p className="font-body text-foreground/85 leading-relaxed mb-8 pt-8 text-[15px]">
                {t.quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-display text-xs text-primary font-bold">{t.name[0]}</span>
                </div>
                <div>
                  <p className="font-body text-sm font-semibold">{t.name}</p>
                  <p className="font-body text-xs text-muted-foreground">{t.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;