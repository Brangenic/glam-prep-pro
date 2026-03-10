import jamaicaImg from "@/assets/dest-jamaica.jpg";
import stluciaImg from "@/assets/dest-stlucia.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const destinations = [
  {
    name: "Jamaica Carnival",
    description: "Kingston glam hub services for Jamaica Carnival.",
    image: jamaicaImg,
    cta: "Book Jamaica Carnival",
  },
  {
    name: "Saint Lucia Carnival",
    description: "Premium glam services for Saint Lucia Carnival.",
    image: stluciaImg,
    cta: "Book Saint Lucia",
  },
];

const Destinations = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="destinations" className="py-24 lg:py-32 bg-card/50">
      <div ref={ref} className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className={`font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4 transition-all duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}>Where We Glam</p>
          <h2
            className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Choose Your{" "}
            <span className="text-gradient-primary italic">Destination</span>
          </h2>
          <p
            className={`font-body text-base text-muted-foreground max-w-lg mx-auto transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            Choose your location to view availability and book your glam package.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {destinations.map((d, i) => (
            <div
              key={d.name}
              className={`group relative rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${300 + i * 200}ms` }}
            >
              <img
                src={d.image}
                alt={d.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="font-display text-2xl lg:text-3xl font-bold mb-2 italic">
                  {d.name}
                </h3>
                <p className="font-body text-sm text-foreground/60 mb-6">
                  {d.description}
                </p>
                <a
                  href="#book"
                  className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-6 py-3 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                  {d.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
        <div
          className={`text-center mt-10 transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="font-body text-muted-foreground text-sm">
            Additional destinations coming soon.{" "}
            <a href="#contact" className="text-secondary hover:underline font-medium">
              Get notified →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Destinations;