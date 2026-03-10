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
    <section id="reviews" className="py-24 lg:py-32">
      <div ref={ref} className="container mx-auto px-6">
        <h2
          className={`font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          What Masqueraders Are Saying
        </h2>
        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="font-body text-sm text-muted-foreground">
            5.0 · Google Reviews
          </span>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`border border-border rounded-xl p-8 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${300 + i * 150}ms` }}
            >
              <span className="font-display text-5xl text-secondary leading-none">
                "
              </span>
              <p className="font-body text-foreground/90 leading-relaxed mb-6 -mt-4">
                {t.quote}
              </p>
              <div>
                <p className="font-display text-sm font-bold">{t.name}</p>
                <p className="font-body text-xs text-muted-foreground">
                  {t.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
