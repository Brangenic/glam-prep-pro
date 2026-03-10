import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const faqs = [
  {
    q: "How do I book?",
    a: "Select your destination and choose your glam package. You will receive confirmation after booking.",
  },
  {
    q: "How far in advance should I book?",
    a: "Carnival morning slots fill quickly. We recommend booking as early as possible to secure your preferred time.",
  },
  {
    q: "What is included in my appointment?",
    a: "Services depend on the package selected but typically include makeup, hair styling, and costume dressing assistance.",
  },
  {
    q: "Where does the glam take place?",
    a: "Each destination has a designated glam hub location shared after booking confirmation.",
  },
  {
    q: "Can I book for a group?",
    a: "Yes. Group bookings are available and recommended for friends or band sections.",
  },
  {
    q: "Do slots sell out?",
    a: "Yes. We limit appointments per carnival morning to maintain a premium experience. Early booking is strongly recommended.",
  },
];

const FAQ = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="faq" className="py-24 lg:py-32">
      <div ref={ref} className="container mx-auto px-6 max-w-2xl">
        <h2
          className={`font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className={`border border-border rounded-lg px-6 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${200 + i * 80}ms` }}
            >
              <AccordionTrigger className="font-display text-base font-bold hover:no-underline hover:text-secondary transition-colors">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground text-sm leading-relaxed">
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
