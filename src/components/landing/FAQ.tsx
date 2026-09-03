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
    a: "A Full Service Glam Hub appointment (Jamaica, Trinidad, Miami) includes shuttle, wing and bag check while you are with us, space permitting, breakfast and refreshments, alcohol, makeup, hair, seamstress, a changing room, photoshoot, and coffee and tea. Bronzing is available in Trinidad and Jamaica. Reels are a paid add-on in Trinidad and Jamaica at US$80 per masquerader. Overnight bag check is a paid add-on at US$35 per masquerader in Trinidad, Jamaica and Miami. We are not running a shuttle in Miami this season. At 6 minutes from the Carnival, with ready Uber access at the venue, a shuttle is not needed, so please plan your own ride on Carnival morning. Overnight bag check is a paid add-on at US$35 per masquerader. You can come back to the hotel that night or early the next morning and collect your bag yourself, or opt for delivery the following day at additional cost, confirmed when you book. A Glam Hub Lite appointment, offered in all other territories, includes makeup, photoshoot, a changing room, wing and bag check while you are with us space permitting, and coffee, tea and light refreshments.",
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
  {
    q: "How much does professional Carnival makeup cost?",
    a: "Carnival morning access is US$35, makeup only is US$170 to US$200 for a single day and US$380 for both Trinidad days, named and celebrity artists run US$200 to US$580, and Full Glam is US$430 to US$680. This is not everyday makeup. The look is built to last a full day on the road and to complement your costume, so it usually involves dramatic eye work, gems, specialist skin prep and setting techniques that hold up in heat and sweat. At Carnival Glam Hub, pricing depends on your chosen look and territory, and every package is designed for long wear and photography.",
  },
  {
    q: "Can I do my own Carnival makeup without experience?",
    a: "You can, but there is a real risk. Without sweat-proof technique, even beautiful makeup can slide by midday once the sun is high and you start to sweat heavily. Carnival makeup is a different discipline from everyday makeup. Our MUAs are sweat-proof trained, so your look holds from the morning through the last lap. If you are experienced, go ahead and do your own. If you want it to last all day without worry, leave it to a trained Carnival artist.",
  },
  {
    q: "What is the difference between regular makeup and Carnival makeup?",
    a: "The technique. Carnival makeup is built to survive heavy sweat and an eight-hour day on the road. It puts far more focus on the eyes and lips, using methods such as cut crease and sweat-proof application, and adds drama through the application of gems. Regular makeup is made for a few hours in controlled conditions. Carnival makeup is made for the road.",
  },
];

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