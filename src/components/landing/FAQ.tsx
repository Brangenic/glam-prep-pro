import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { HOME_FAQS } from "@/data/homeFaqs";

// Questions and answers live in src/data/homeFaqs.ts, shared with the
// FAQPage JSON-LD on the home page. Never re-type one here.
const faqs = HOME_FAQS;

const FAQ = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="faq" className="section-y bg-card/50">
      <div ref={ref} className="container mx-auto px-4 sm:px-6 max-w-2xl">
        <div className="text-center mb-10 sm:mb-16">
          <p className={`font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4 transition-all duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}>Support</p>
          <h2
            className={`font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Frequently Asked <span className="italic text-gradient-primary">Questions</span>
          </h2>
        </div>
        <Accordion type="single" collapsible className="space-y-2 sm:space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className={`bg-card border border-border rounded-xl sm:rounded-2xl px-4 sm:px-6 transition-all duration-500 hover:border-primary/20 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${200 + i * 80}ms` }}
            >
              <AccordionTrigger className="font-display text-sm sm:text-base font-bold hover:no-underline hover:text-primary transition-colors py-4 sm:py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground text-xs sm:text-sm leading-relaxed pb-4 sm:pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;