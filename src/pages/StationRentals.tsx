import { useEffect, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import RelatedLinks from "@/components/RelatedLinks";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TIER_LABEL } from "@/data/hubTiers";
import {
  CLOSED_STATION_NAMES,
  CLIENT_AMENITIES_NOTE,
  FULL_SERVICE_STATION_TERRITORIES,
  HIGH_CHAIR_RATE_LABEL,
  LITE_STATION_TERRITORIES,
  STATION_BRING,
  STATION_FAQS,
  STATION_PAYMENT_NOTE,
  STATION_PROVIDED,
  STATION_SERVICE_TYPES,
  STATION_TERRITORIES,
  STATION_TERRITORY_NOTES,
  CLOSED_STATION_TERRITORIES,
  ENQUIRY_TYPES,
  VENDOR_SPACE_BOTH_DAYS,
  VENDOR_SPACE_INCLUDES,
  VENDOR_SPACE_INTRO,
  VENDOR_SPACE_NOTE,
  VENDOR_SPACE_PER_DAY,
  formatStationRate,
  getStationInclusions,
  getTierRate,
} from "@/data/stationRentals";


const PAGE_TITLE = "Carnival Station Rental for Makeup Artists | Glam Hub";
const PAGE_DESCRIPTION =
  "Rent a station inside a Carnival Glam Hub. Makeup artist and hair stylist stations from US$200 per day, plus vendor and merchandise spaces, in every Glam Hub territory.";
const CANONICAL = "https://www.carnivalglamhub.com/station-rentals";
const HERO_IMAGE = "/images/station-rentals/station-rentals-hero.webp";

/** Real Carnival Glam Hub footage from Trinidad. Wide cut and vertical short. */
const HUB_VIDEO_WIDE = "HWFyXB1tyIU";
const HUB_VIDEO_VERTICAL = "dK5HLseeWYw";

const DAYS_OPTIONS = ["One day", "Both days", "Not sure yet"];

const STEPS = [
  {
    title: "Enquire",
    body: "Send the form below with your service, your territory and the days you want. It takes a minute.",
  },
  {
    title: "We confirm",
    body: "Your territory, your dates and how many stations are still free are confirmed by our team.",
  },
  {
    title: "Pay and get allocated",
    body: "You settle the station rate and we allocate your station in the lounge for Carnival morning.",
  },
  {
    title: "Show up and work",
    body: "Arrive with your kit and your clients. Reception checks them in and points them to you.",
  },
];

const StationRentals = () => {
  const isMobile = useIsMobile();

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
    restorers.push(
      setMeta('meta[property="og:description"]', "property", "og:description", PAGE_DESCRIPTION),
    );
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

  const fullRate = getTierRate("full");
  const liteRate = getTierRate("lite");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-28 sm:pt-32 pb-16 sm:pb-24">
        {/* Hero */}
        <section className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center mb-10">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4">
              For service providers
            </p>
            <h1 className="sr-only">
              Makeup station rentals with Carnival Glam Hub. Wherever Carnival
              takes you, you can rent a station too.
            </h1>
            <figure className="mb-8 -mx-4 sm:mx-0">
              <img
                src={HERO_IMAGE}
                alt="Carnival Glam Hub makeup station rentals, a gold branded director's chair beside a lit vanity of professional makeup products"
                width={1774}
                height={887}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-auto aspect-[2/1] object-contain bg-black sm:rounded-2xl shadow-lg"
              />
            </figure>
            <p className="font-body text-lg sm:text-xl text-foreground/90 leading-relaxed max-w-3xl mx-auto font-medium">
              You bring your kit and your clients. We bring the location, the
              air-conditioned lounge, reception and the crowd. Stations are
              available in every Glam Hub territory, from US${liteRate.perDay} per day.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <a
                href="#enquiry"
                className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3.5 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Enquire about a station
              </a>
              <a
                href="#rates"
                className="inline-block border border-border font-body font-semibold text-sm px-7 py-3.5 rounded-full hover:border-primary hover:text-primary transition-all"
              >
                See the rate card
              </a>
            </div>
          </div>
        </section>


        {/* See inside a Glam Hub */}
        <section id="inside" className="container mx-auto px-4 sm:px-6 max-w-4xl mb-16 scroll-mt-28">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 text-center">
            See inside a <span className="italic text-gradient-primary">Glam Hub</span>
          </h2>
          <p className="font-body text-base text-muted-foreground text-center max-w-2xl mx-auto mb-8 leading-relaxed">
            Filmed inside our Trinidad hub on Carnival morning. This is the room
            you would be working in.
          </p>
          {isMobile ? (
            <YouTubeEmbed
              videoId={HUB_VIDEO_VERTICAL}
              title="Inside the Carnival Glam Hub in Trinidad, vertical tour"
              vertical
            />
          ) : (
            <YouTubeEmbed
              videoId={HUB_VIDEO_WIDE}
              title="Inside the Carnival Glam Hub in Trinidad, full tour"
            />
          )}
        </section>



        {/* Who it is for */}
        <section className="container mx-auto px-4 sm:px-6 max-w-5xl mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 text-center">
            Who station rental is <span className="italic text-gradient-primary">for</span>
          </h2>
          <p className="font-body text-base text-muted-foreground text-center max-w-2xl mx-auto mb-8 leading-relaxed">
            A station is a working chair for a makeup artist or a hair
            stylist who wants a professional room to work from on Carnival
            morning without renting and staffing a venue of their own.
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto">
            {STATION_SERVICE_TYPES.map((s) => (
              <div
                key={s}
                className="rounded-2xl border border-border bg-card/50 px-4 py-4 font-body text-sm font-medium text-center"
              >
                {s}
              </div>
            ))}
          </div>
        </section>

        {/* What a station actually is */}
        <section id="station-spec" className="container mx-auto px-4 sm:px-6 max-w-5xl mb-16 scroll-mt-28">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 text-center">
            What a station <span className="italic text-gradient-primary">actually is</span>
          </h2>
          <p className="font-body text-base text-muted-foreground text-center max-w-2xl mx-auto mb-8 leading-relaxed">
            The station spec is identical in every territory, Full Service and
            Lite alike. Here is exactly what you turn up to and exactly what you
            need to carry.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card/50 p-6 sm:p-7">
              <h3 className="font-display text-lg font-bold mb-4">What we provide</h3>
              <ul className="space-y-2 font-body text-sm">
                {STATION_PROVIDED.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span aria-hidden="true" className="text-primary">•</span>
                    <span className="text-muted-foreground">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-primary/60 bg-primary/5 p-6 sm:p-7">
              <h3 className="font-display text-lg font-bold mb-4">What you bring</h3>
              <ul className="space-y-2 font-body text-sm">
                {STATION_BRING.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span aria-hidden="true" className="text-primary">•</span>
                    <span className="text-muted-foreground">{line}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-xl bg-primary text-primary-foreground font-body text-sm font-semibold px-4 py-3 leading-relaxed">
                Bring your own extension cord and multiplug. Everyone must carry
                their own, no exceptions.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card/50 p-6 sm:p-7">
              <h3 className="font-display text-lg font-bold mb-4">What you can rent</h3>
              <ul className="space-y-2 font-body text-sm">
                <li className="flex gap-2">
                  <span aria-hidden="true" className="text-primary">•</span>
                  <span className="text-muted-foreground">{HIGH_CHAIR_RATE_LABEL}</span>
                </li>
              </ul>
              <p className="font-body text-xs text-muted-foreground mt-4 leading-relaxed">
                Charged per day, like the station itself. Ask for it when you
                enquire so we can set one aside.
              </p>
            </div>
          </div>
          <p className="font-body text-sm text-muted-foreground mt-6 text-center max-w-3xl mx-auto leading-relaxed">
            You bring your full kit, your products, your tools and your
            consumables. We do not supply product or equipment.
          </p>
        </section>

        {/* Lite versus Full Service */}
        <section className="container mx-auto px-4 sm:px-6 max-w-5xl mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 text-center">
            Glam Hub Lite versus{" "}
            <span className="italic text-gradient-primary">Full Service</span>
          </h2>
          <p className="font-body text-base text-muted-foreground text-center max-w-2xl mx-auto mb-4 leading-relaxed">
            The station spec is the same at both tiers. What differs is the hub
            around it, and what your clients can use while they are there.
          </p>
          <p className="font-body text-base text-foreground/90 font-medium text-center max-w-3xl mx-auto mb-8 leading-relaxed">
            {CLIENT_AMENITIES_NOTE}
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {(["full", "lite"] as const).map((tier) => {
              const sample = tier === "full" ? "trinidad" : "barbados";
              const territories =
                tier === "full"
                  ? FULL_SERVICE_STATION_TERRITORIES
                  : LITE_STATION_TERRITORIES;
              const rate = getTierRate(tier);
              return (
                <div
                  key={tier}
                  className="rounded-2xl border border-border bg-card/50 p-6 sm:p-8"
                >
                  <span className="inline-block rounded-full bg-secondary/15 text-secondary font-body text-[11px] uppercase tracking-[0.15em] font-semibold px-3 py-1 mb-4">
                    {TIER_LABEL[tier]}
                  </span>
                  <p className="font-body text-sm text-muted-foreground mb-2">
                    {territories.map((t) => t.name).join(", ")}
                  </p>
                  <p className="font-body text-sm font-semibold mb-5">
                    US${rate.perDay} per station per day
                    {rate.bothDays !== null
                      ? `, US$${rate.bothDays} for both days`
                      : ", multi-day confirmed on enquiry"}
                  </p>
                  <p className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-3">
                    You and your clients get
                  </p>
                  <ul className="space-y-2 font-body text-sm">
                    {getStationInclusions(sample).map((line) => (
                      <li key={line} className="flex gap-2">
                        <span aria-hidden="true" className="text-primary">
                          •
                        </span>
                        <span className="text-muted-foreground">{line}</span>
                      </li>
                    ))}
                  </ul>
                  {tier === "full" && (
                    <p className="font-body text-xs text-muted-foreground mt-5 leading-relaxed">
                      The shuttle runs in Jamaica and Trinidad. Trinidad and
                      Jamaica also run bronzing, a barber and reels.{" "}
                      {STATION_TERRITORY_NOTES.miami}
                    </p>
                  )}
                  {tier === "lite" && (
                    <p className="font-body text-xs text-muted-foreground mt-5 leading-relaxed">
                      A Glam Hub Lite does not run a shuttle, hair, a
                      seamstress, getting-dressed assistance, bronzing, reels,
                      alcohol or breakfast.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>


        {/* Rate card */}
        <section id="rates" className="container mx-auto px-4 sm:px-6 max-w-5xl mb-16 scroll-mt-28">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 text-center">
            Station <span className="italic text-gradient-primary">rates</span>
          </h2>
          <p className="font-body text-base text-muted-foreground text-center max-w-2xl mx-auto mb-8 leading-relaxed">
            Per station, per provider. Full Service hubs are US${fullRate.perDay} a
            day or US${fullRate.bothDays} for both days. Glam Hub Lite is US$
            {liteRate.perDay} a day, with multi-day confirmed on enquiry.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { label: "Full Service Glam Hub", list: FULL_SERVICE_STATION_TERRITORIES },
              { label: "Glam Hub Lite", list: LITE_STATION_TERRITORIES },
            ].map((group) => (
              <div
                key={group.label}
                className="rounded-2xl border border-border bg-card/50 p-6 sm:p-8"
              >
                <h3 className="font-display text-xl font-bold mb-5">{group.label}</h3>
                <ul className="divide-y divide-border">
                  {group.list.map((t) => (
                    <li key={t.slug} className="py-3">
                      <div className="font-body text-sm font-semibold">
                        {t.path ? (
                          <a href={t.path} className="hover:text-primary transition-colors">
                            {t.name}
                          </a>
                        ) : (
                          t.name
                        )}
                      </div>
                      <div className="font-body text-sm text-muted-foreground">
                        {formatStationRate(t.slug)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {CLOSED_STATION_TERRITORIES.length > 0 && (
            <p className="font-body text-sm text-muted-foreground text-center mt-6">
              {CLOSED_STATION_NAMES} have finished for this season, so stations
              are not on sale there. They return with next season's dates at the
              same tier rates.
            </p>
          )}
          <div className="rounded-2xl border border-border bg-card/50 p-6 sm:p-7 mt-8">
            <h3 className="font-display text-lg font-bold mb-2">Optional extras and payment</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-2">
              {HIGH_CHAIR_RATE_LABEL}, charged per day like the station.
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              {STATION_PAYMENT_NOTE}
            </p>
          </div>
        </section>



        {/* Vendor and merchandise spaces. A separate offer, never a station. */}
        <section
          id="vendor-spaces"
          className="container mx-auto px-4 sm:px-6 max-w-5xl mb-16 scroll-mt-28"
        >
          <div className="rounded-3xl border border-secondary/30 bg-secondary/5 p-6 sm:p-10">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-3 text-center">
              A separate offer
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 text-center">
              Vendor and merchandise{" "}
              <span className="italic text-gradient-primary">spaces</span>
            </h2>
            <p className="font-body text-base text-muted-foreground text-center max-w-2xl mx-auto mb-8 leading-relaxed">
              {VENDOR_SPACE_INTRO}
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8">
                <h3 className="font-display text-xl font-bold mb-5">What you get</h3>
                <ul className="space-y-2 font-body text-sm">
                  {VENDOR_SPACE_INCLUDES.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span aria-hidden="true" className="text-primary">
                        •
                      </span>
                      <span className="text-muted-foreground">{line}</span>
                    </li>
                  ))}
                </ul>
                <p className="font-body text-xs text-muted-foreground mt-5 leading-relaxed">
                  {VENDOR_SPACE_NOTE}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8">
                <h3 className="font-display text-xl font-bold mb-5">Vendor space rates</h3>
                <ul className="divide-y divide-border">
                  <li className="py-3">
                    <div className="font-body text-sm font-semibold">One day</div>
                    <div className="font-body text-sm text-muted-foreground">
                      US${VENDOR_SPACE_PER_DAY} per day
                    </div>
                  </li>
                  <li className="py-3">
                    <div className="font-body text-sm font-semibold">Both days</div>
                    <div className="font-body text-sm text-muted-foreground">
                      US${VENDOR_SPACE_BOTH_DAYS} for both days
                    </div>
                  </li>
                </ul>
                <p className="font-body text-sm text-muted-foreground mt-5 leading-relaxed">
                  The same flat rate at every Glam Hub, Full Service and Glam
                  Hub Lite alike. A vendor space is not a station and is not
                  priced from the hub tier.
                </p>
                <a
                  href="#enquiry"
                  className="inline-block mt-6 bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3.5 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                  Enquire about a vendor space
                </a>
              </div>
            </div>
          </div>
        </section>


        {/* How it works */}
        <section className="container mx-auto px-4 sm:px-6 max-w-5xl mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-8 text-center">
            How it <span className="italic text-gradient-primary">works</span>
          </h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                className="rounded-2xl border border-border bg-card/50 p-6"
              >
                <span className="font-display text-2xl font-bold text-primary">
                  {i + 1}
                </span>
                <h3 className="font-display text-lg font-bold mt-2 mb-2">{s.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Why a hub station */}
        <section className="container mx-auto px-4 sm:px-6 max-w-3xl mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-5">
            Why a Glam Hub station beats setting up alone
          </h2>
          <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed mb-4">
            Working Carnival morning on your own means finding a venue, paying
            for it, staffing it and hoping people can reach you. Renting a
            station skips all of that. The venue is already booked and staffed,
            the lounge is air-conditioned, and masqueraders are already coming
            through the door for the hub's own services.
          </p>
          <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
            There is a receptionist, so you are not managing check-in from your
            chair. Your clients arrive somewhere that already looks and runs
            like a professional operation, and you keep your own bookings and
            your own prices.
          </p>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 sm:px-6 max-w-3xl mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-8 text-center">
            Station rental <span className="italic text-gradient-primary">questions</span>
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {STATION_FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-body font-semibold text-base">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Enquiry form */}
        <section id="enquiry" className="container mx-auto px-4 sm:px-6 max-w-2xl mb-16 scroll-mt-28">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 text-center">
            Enquire about a station or a{" "}
            <span className="italic text-gradient-primary">vendor space</span>
          </h2>
          <p className="font-body text-base text-muted-foreground text-center mb-8 leading-relaxed">
            Tell us which one you want, what you do and where. We will come back
            to you with availability and the rate.
          </p>
          <EnquiryForm />
        </section>

        {/* Closing CTA */}
        <section className="container mx-auto px-4 sm:px-6 max-w-3xl text-center mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
            Stations are capped by the floor space of each venue
          </h2>
          <p className="font-body text-base text-muted-foreground mb-6 leading-relaxed">
            Carnival morning sells out well ahead of the season. Get your
            territory and your days confirmed early.
          </p>
          <a
            href="#enquiry"
            className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3.5 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
          >
            Enquire about a station
          </a>
        </section>

        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <RelatedLinks
            services={[
              { to: "/services/carnival-makeup", label: "Sweat-resistant Carnival makeup" },
              { to: "/services/carnival-hair", label: "Carnival hair and hairstyles" },
              { to: "/services/carnival-photoshoot", label: "Carnival photoshoot" },
            ]}
            destinations={[
              { to: "/trinidad", label: "Trinidad Carnival hub" },
              { to: "/jamaica", label: "Jamaica Carnival hub" },
              { to: "/barbados", label: "Barbados Crop Over hub" },
            ]}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

const FIELD_CLASS =
  "w-full rounded-xl border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
const LABEL_CLASS = "block font-body text-sm font-medium mb-2";

const EnquiryForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    enquiry_type: ENQUIRY_TYPES[0] as string,
    full_name: "",
    business_name: "",
    service_type: "",
    territory: "",
    days_needed: "",
    email: "",
    whatsapp: "",
    instagram: "",
    message: "",
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const isStation = form.enquiry_type === "Station rental";

  const validate = () => {
    const next: Record<string, string> = {};
    if (form.full_name.trim().length < 2) next.full_name = "Please enter your full name.";
    if (isStation && !form.service_type) next.service_type = "Please choose your service.";
    if (!form.territory) next.territory = "Please choose a territory.";
    if (!form.days_needed) next.days_needed = "Please choose the days you need.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      next.email = "Please enter a valid email address.";
    if (form.whatsapp.replace(/\D/g, "").length < 8)
      next.whatsapp = "Please include your country code and number.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const { error } = await supabase.from("station_rental_enquiries").insert({
      full_name: form.full_name.trim(),
      business_name: form.business_name.trim() || null,
      enquiry_type: form.enquiry_type,
      service_type: isStation ? form.service_type : null,
      territory: form.territory,
      days_needed: form.days_needed,
      email: form.email.trim(),
      whatsapp: form.whatsapp.trim(),
      instagram: form.instagram.trim() || null,
      message: form.message.trim() || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Something went wrong. Please try again or email Bookings@carnivalglamhub.com.");
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-card/50 p-8 text-center">
        <h3 className="font-display text-xl font-bold mb-3">Enquiry received</h3>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          Thank you. Our team will come back to you with availability and the
          rate for your territory. If it is urgent, email{" "}
          <a href="mailto:Bookings@carnivalglamhub.com" className="text-primary hover:underline">
            Bookings@carnivalglamhub.com
          </a>
          .
        </p>
      </div>
    );
  }

  const err = (k: string) =>
    errors[k] ? (
      <p role="alert" className="font-body text-xs text-destructive mt-1">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-border bg-card/50 p-6 sm:p-8 space-y-5"
      aria-label="Station rental and vendor space enquiry"
    >
      <fieldset>
        <legend className={LABEL_CLASS}>What are you enquiring about?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {ENQUIRY_TYPES.map((t) => (
            <label
              key={t}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 font-body text-sm cursor-pointer transition-colors ${
                form.enquiry_type === t
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input
                type="radio"
                name="enquiry_type"
                value={t}
                checked={form.enquiry_type === t}
                onChange={(e) => set("enquiry_type")(e.target.value)}
                className="accent-current text-primary"
              />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="sr-name" className={LABEL_CLASS}>
          Full name
        </label>
        <input
          id="sr-name"
          name="full_name"
          autoComplete="name"
          className={FIELD_CLASS}
          value={form.full_name}
          onChange={(e) => set("full_name")(e.target.value)}
        />
        {err("full_name")}
      </div>

      <div>
        <label htmlFor="sr-business" className={LABEL_CLASS}>
          Business or brand name (optional)
        </label>
        <input
          id="sr-business"
          name="business_name"
          autoComplete="organization"
          className={FIELD_CLASS}
          value={form.business_name}
          onChange={(e) => set("business_name")(e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {isStation && (
        <div>
          <label htmlFor="sr-service" className={LABEL_CLASS}>
            Service type
          </label>
          <select
            id="sr-service"
            name="service_type"
            className={FIELD_CLASS}
            value={form.service_type}
            onChange={(e) => set("service_type")(e.target.value)}
          >
            <option value="">Choose your service</option>
            {STATION_SERVICE_TYPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {err("service_type")}
        </div>
        )}
        <div>
          <label htmlFor="sr-territory" className={LABEL_CLASS}>
            Territory
          </label>
          <select
            id="sr-territory"
            name="territory"
            className={FIELD_CLASS}
            value={form.territory}
            onChange={(e) => set("territory")(e.target.value)}
          >
            <option value="">Choose a territory</option>
            {STATION_TERRITORIES.map((t) => (
              <option key={t.slug} value={t.name}>
                {t.name} ({t.tierLabel})
              </option>
            ))}
          </select>
          {err("territory")}
        </div>
      </div>

      <div>
        <label htmlFor="sr-days" className={LABEL_CLASS}>
          Days needed
        </label>
        <select
          id="sr-days"
          name="days_needed"
          className={FIELD_CLASS}
          value={form.days_needed}
          onChange={(e) => set("days_needed")(e.target.value)}
        >
          <option value="">Choose the days you need</option>
          {DAYS_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {err("days_needed")}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="sr-email" className={LABEL_CLASS}>
            Email
          </label>
          <input
            id="sr-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className={FIELD_CLASS}
            value={form.email}
            onChange={(e) => set("email")(e.target.value)}
          />
          {err("email")}
        </div>
        <div>
          <label htmlFor="sr-whatsapp" className={LABEL_CLASS}>
            WhatsApp, with country code
          </label>
          <input
            id="sr-whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+1 876 000 0000"
            className={FIELD_CLASS}
            value={form.whatsapp}
            onChange={(e) => set("whatsapp")(e.target.value)}
          />
          {err("whatsapp")}
        </div>
      </div>

      <div>
        <label htmlFor="sr-instagram" className={LABEL_CLASS}>
          Instagram handle (optional)
        </label>
        <input
          id="sr-instagram"
          name="instagram"
          placeholder="@yourhandle"
          className={FIELD_CLASS}
          value={form.instagram}
          onChange={(e) => set("instagram")(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="sr-message" className={LABEL_CLASS}>
          Anything else (optional)
        </label>
        <textarea
          id="sr-message"
          name="message"
          rows={4}
          className={FIELD_CLASS}
          value={form.message}
          onChange={(e) => set("message")(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3.5 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Send enquiry"}
      </button>
    </form>
  );
};

export default StationRentals;
