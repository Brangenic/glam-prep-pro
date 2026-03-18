import founderImg from "@/assets/gabby-founder.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Founder = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="about" className="py-16 sm:py-24 lg:py-32">
      <div ref={ref} className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div
            className={`order-2 lg:order-1 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4">
              Our Story
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-6 sm:mb-8">
              Founded by <span className="italic text-gradient-primary">Carnival Lovers</span>
            </h2>
            <p className="font-body text-muted-foreground text-base sm:text-lg leading-relaxed mb-5 sm:mb-6">
              Carnival Glam Hub was created by Gabby Glam and Kibwe McGann to
              make carnival mornings easier, more organized, and more enjoyable.
            </p>
            <p className="font-body text-muted-foreground text-base sm:text-lg leading-relaxed mb-5 sm:mb-6">
              Since 2017, the brand has helped thousands of masqueraders start
              their carnival day feeling confident and fully prepared.
            </p>
            <div className="border-l-2 border-primary pl-5 sm:pl-6 mt-6 sm:mt-8">
              <p className="font-display text-base sm:text-lg text-foreground/90 italic leading-relaxed">
                Our mission is simple: make sure every masquerader steps onto the
                road looking and feeling their best.
              </p>
            </div>
          </div>
          <div
            className={`order-1 lg:order-2 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-square max-w-sm sm:max-w-md mx-auto gold-glow">
              <img
                src={founderImg}
                alt="Carnival Glam Hub founder"
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;