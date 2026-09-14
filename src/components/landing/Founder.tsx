import founderImg from "@/assets/gabby-founder.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Founder = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="about" className="section-y">
      <div ref={ref} className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div
            className={`order-2 lg:order-1 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4">
              About Gabby
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-6 sm:mb-8">
              Co-founded by <span className="italic text-gradient-primary">Gabby Glam</span>
            </h2>
            <p className="font-body text-muted-foreground text-base sm:text-lg leading-relaxed mb-5 sm:mb-6">
              Carnival Glam Hub was co-founded by Kibwe McGann and Gabby Glam to make carnival mornings easier, more organised, and more enjoyable.
            </p>
            <p className="font-body text-muted-foreground text-base sm:text-lg leading-relaxed mb-5 sm:mb-6">
              Gabrielle is a Jamaican makeup artist and entrepreneur. She was named a Distinguished Awardee in Beauty at the Jamaica Gleaner&apos;s Flair Distinguished Awards in 2023, and she founded{" "}
              <a
                href="https://gabbyglamcosmetics.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Gabby Glam Cosmetics
              </a>{" "}
              and{" "}
              <a
                href="https://www.visitglamhaus.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Glam Haus by Gabby Glam
              </a>{" "}
              in Kingston. That experience behind the chair sets the standard for every Carnival morning we run.
            </p>
            <p className="font-body text-muted-foreground text-base sm:text-lg leading-relaxed mb-5 sm:mb-6">
              As the founder of her own glam line, she brings real beauty-industry credibility to the brand, combining artistry, product expertise, and a deep understanding of what lasts on the road.
            </p>
            <div className="border-l-2 border-primary pl-5 sm:pl-6 mt-6 sm:mt-8">
              <p className="font-display text-base sm:text-lg text-foreground/90 italic leading-relaxed">
                Our mission is simple: make sure every masquerader steps onto the road looking and feeling their best.
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
                alt="Gabrielle Waite, co-founder of Carnival Glam Hub"
                width={800}
                height={800}
                className="w-full h-full object-cover object-top"
                loading="lazy"
                decoding="async"
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