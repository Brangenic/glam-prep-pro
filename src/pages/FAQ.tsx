import { BOOKING_URL } from "@/lib/constants";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";

const PAGE_TITLE =
  "Carnival Glam Hub FAQ | Booking, Makeup & Shuttle Answers";
const PAGE_DESCRIPTION =
  "Answers to the most common questions about booking Carnival Glam Hub: makeup, hair, photoshoot, getting-dressed, shuttle, deposits, cancellations and what to bring on Carnival morning.";
const CANONICAL = "https://www.carnivalglamhub.com/faq";

const FAQS: Array<{ q: string; a: string; link?: { href: string; label: string } }> = [
  {
    q: "What is included in a Carnival Glam Hub morning?",
    a: "It depends on the tier. A Full Service Glam Hub morning includes shuttle, wing and bag check while you are with us, space permitting, breakfast and refreshments, alcohol, makeup, hair, seamstress, a changing room, photoshoot, and coffee and tea. Bronzing is available in Trinidad and Jamaica. Reels are a paid add-on in Trinidad and Jamaica, with the price confirmed on booking. Overnight bag check is a paid add-on at US$35 per masquerader in Trinidad, Jamaica and Miami. A Glam Hub Lite morning includes makeup, photoshoot, a changing room, wing and bag check while you are with us space permitting, and coffee, tea and light refreshments. Every package includes a confirmed time slot and on-site styling support until you leave for the road.",
  },
  {
    q: "What is the difference between a Full Service Glam Hub and a Glam Hub Lite?",
    a: "A Full Service Glam Hub includes shuttle, wing and bag check while you are with us, space permitting, breakfast and refreshments, alcohol, makeup, hair, seamstress, a changing room, photoshoot, and coffee and tea. Bronzing is available in Trinidad and Jamaica. Reels are a paid add-on in Trinidad and Jamaica, with the price confirmed on booking. Overnight bag check is a paid add-on at US$35 per masquerader in Trinidad, Jamaica and Miami. Full Service Glam Hubs run in Jamaica, Trinidad and Miami, with one exception: there is no shuttle in Miami this season. Jamaica and Trinidad also offer a barber. A Glam Hub Lite includes makeup, photoshoot, a changing room, wing and bag check while you are with us space permitting, and coffee, tea and light refreshments only. Glam Hub Lite does not offer getting dressed, seamstress, overnight bag check, shuttle, hair, bronzing, reels, alcohol or breakfast. Every other territory we serve is a Glam Hub Lite, including Saint Lucia, Grenada, Antigua, Barbados, Toronto, Guyana, Tobago and Atlanta.",
  },
  {
    q: "How early should I book?",
    a: "Book the moment your costume is collected. Slots typically sell out two to three months before the parade in our busiest territories, Trinidad, Jamaica and Miami. Late bookings, if available, are charged at a premium.",
  },
  {
    q: "Do you travel internationally?",
    a: "Carnival Glam Hub operates on the ground in Trinidad, Jamaica and Miami as Full Service Glam Hubs, and in Saint Lucia, Grenada, Antigua, Barbados, Toronto, Guyana, Tobago and Atlanta as Glam Hub Lite. You travel to the territory; we run the morning. Each territory is only bookable while its Carnival is still ahead of us. Once a season has passed, that territory closes until the next season's dates are confirmed.",
  },
  {
    q: "Why does Carnival makeup need to be sweat-resistant?",
    a: "Caribbean Carnival happens in tropical heat with hours of dancing on the road. Standard wedding or event makeup will not survive. We use a layered, sweat-resistant system built for the road and tested by 15,000+ masqueraders.",
  },
  {
    q: "What hair options do you offer?",
    a: "Sleek pony, voluminous curl set, braided crown, headpiece-ready installs and clean-pulled styles that hold under feathers and wires. Bring your headpiece to the appointment and we will set the style around it. Hair is a Full Service Glam Hub inclusion, available in Jamaica, Trinidad and Miami.",
  },
  {
    q: "Do you take groups?",
    a: "Yes. We host private group bookings for friends travelling together. Group spots are scheduled in sequence so the whole party leaves for the road on time.",
  },
  {
    q: "Do you provide costume getting-dressed help?",
    a: "Yes, at our Full Service Glam Hubs in Jamaica, Trinidad and Miami. Modern Carnival costumes use wire bras, monokini bases, harnesses, backpacks and standing collars, and our team dresses you correctly so nothing shifts on the road.",
  },
  {
    q: "Can I add a photoshoot?",
    a: "Yes. Professional Carnival photoshoot is available as an add-on or as a stand-alone session. Photos are delivered after Carnival in a private gallery.",
  },
  {
    q: "Do you offer a shuttle service?",
    a: "Shuttle is a Full Service Glam Hub inclusion and runs in Jamaica and Trinidad. Miami Carnival has moved to Broward County: as announced by Miami Carnival, the Parade of Bands is at Central Broward Park and Broward County Stadium, 3700 NW 11th Place, Lauderhill, Florida 33311, sometimes listed as the Fort Lauderdale cricket stadium. Our Glam Hub will be at a hotel in Lauderhill, 6 minutes from the Carnival. We are not running a shuttle in Miami this season. At 6 minutes from the Carnival, with ready Uber access at the venue, a shuttle is not needed, so please plan your own ride on Carnival morning. Overnight bag check is a paid add-on at US$35 per masquerader. You can come back to the hotel that night or early the next morning and collect your bag yourself, or opt for delivery the following day at additional cost, confirmed when you book. Lauderhill is about 6 miles from Fort Lauderdale, roughly a 12 minute drive, and about 26 miles from Miami, so Fort Lauderdale is the closer airport and the closer place to stay. Glam Hub Lite territories do not include a shuttle.",
  },
  {
    q: "How do deposits and payments work?",
    a: "A non-refundable deposit of US$50 per masquerader confirms your appointment and is applied to the total price of your booking. No slot is held for you until the deposit is received. The balance is due in full before your service begins. Payment is taken through our booking platform.",
  },
  {
    q: "What is the cancellation policy?",
    a: "A non-refundable deposit of US$50 per masquerader confirms every booking, in every territory. No refund is given if you cancel within 14 days of the event, and bookings made inside that window are non-refundable in full. No shows and same day cancellations forfeit all payments, with no transfer and no credit. A booking may be transferred once, to any Carnival Glam Hub event within 12 months, including to another territory, if requested at least 3 days before the event and subject to availability. Refunds are not permitted on any service or add-on under US$50. The full terms are published at /policies#refunds.",
    link: { href: "/policies#refunds", label: "Read the full refund and cancellation terms" },
  },
  {
    q: "What happens if I am late on Carnival morning?",
    a: "Please register at the hub no later than 30 minutes before your appointment time. A 15 minute grace period applies. After that, your service may be shortened to fit the remaining time, or your appointment may be cancelled with payments forfeited. A shortened service is charged at the full booked price. There is no separate late fee. The full terms are published at /policies#terms.",
    link: { href: "/policies#terms", label: "Read the full booking terms" },
  },
  {
    q: "What should I bring on Carnival day?",
    a: "Your costume, your headpiece, your accessories, your boots or footwear, any personal beauty product you cannot do without, and a packed bag for the road. We provide everything else.",
  },
  {
    q: "How should I prep my skin and hair the night before?",
    a: "Cleanse and moisturise the skin. Avoid heavy actives in the 48 hours before. Wash, deep condition and stretch the hair so it sits well under heat styling. Sleep early. Hydrate.",
  },
  {
    q: "How much does professional Carnival makeup cost?",
    a: "Carnival morning access is US$35. Makeup only is US$170 to US$200 for a single day and US$380 for both Trinidad days. Named and celebrity artists run US$200 to US$580. Photoshoot only is US$140 to US$160, hair is US$120 to US$220 and Full Glam is US$430 to US$680.",
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

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.carnivalglamhub.com/" },
    { "@type": "ListItem", position: 2, name: "Support", item: "https://www.carnivalglamhub.com/faq" },
    { "@type": "ListItem", position: 3, name: "FAQ", item: "https://www.carnivalglamhub.com/faq" },
  ],
};

const FAQ = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    const setMeta = (selector: string, attr: string, name: string, content: string) => {
      let tag = document.head.querySelector<HTMLMetaElement>(selector);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      const prev = tag.getAttribute("content");
      tag.setAttribute("content", content);
      return () => {
        if (prev === null) tag?.remove();
        else tag?.setAttribute("content", prev);
      };
    };

    const restorers: Array<() => void> = [];
    restorers.push(setMeta('meta[name="description"]', "name", "description", PAGE_DESCRIPTION));
    restorers.push(setMeta('meta[property="og:title"]', "property", "og:title", PAGE_TITLE));
    restorers.push(setMeta('meta[property="og:description"]', "property", "og:description", PAGE_DESCRIPTION));
    restorers.push(setMeta('meta[property="og:url"]', "property", "og:url", CANONICAL));
    restorers.push(setMeta('meta[property="og:type"]', "property", "og:type", "website"));

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previousCanonical = canonical?.getAttribute("href") ?? null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", CANONICAL);

    return () => {
      document.title = previousTitle;
      restorers.forEach((r) => r());
      if (previousCanonical !== null) canonical?.setAttribute("href", previousCanonical);
      else canonical?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />
      <main className="pt-28 sm:pt-32 pb-16 sm:pb-24">
        <article className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <header className="mb-10 sm:mb-14 text-center">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4">
              Support
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Frequently asked{" "}
              <span className="italic text-gradient-primary">questions</span>
            </h1>
            <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
              The Carnival Glam Hub FAQ answers the most common questions about
              booking sweat-resistant Carnival makeup, hair styling,
              getting-dressed assistance, photoshoot and shuttle for masqueraders
              across the Caribbean and the diaspora. Below are the questions we
              are asked most often. If yours is not here, message us directly.
            </p>
          </header>

          <section aria-label="Frequently asked questions" className="space-y-3">
            {FAQS.map(({ q, a, link }, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-border bg-card p-5 sm:p-6 open:shadow-lg open:shadow-primary/5 transition-all"
              >
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                  <h3 className="font-display text-lg sm:text-xl font-semibold leading-snug pr-2">
                    {q}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-primary transition-transform group-open:rotate-45"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </summary>
                <p className="font-body text-base text-muted-foreground leading-relaxed mt-4">
                  {a}
                </p>
                {link && (
                  <p className="font-body text-base mt-3">
                    <Link to={link.href} className="text-primary underline underline-offset-2">
                      {link.label}
                    </Link>
                  </p>
                )}
              </details>
            ))}
          </section>
        </article>

        <section className="container mx-auto px-4 sm:px-6 max-w-3xl mt-12 sm:mt-16">
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-8 sm:p-12 text-center gold-glow">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Still have{" "}
              <span className="italic text-gradient-primary">questions?</span>
            </h2>
            <p className="font-body text-base sm:text-lg text-muted-foreground mb-7">
              Book your call or secure your slot before your territory sells out.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={BOOKING_URL} target="_blank" rel="noopener"
                className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3 rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all"
              >
                Book now
              </a>
              <a
                href="/about"
                className="inline-block border border-border text-foreground font-body font-semibold text-sm px-7 py-3 rounded-full hover:border-primary hover:text-primary transition-all"
              >
                Read about us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default FAQ;