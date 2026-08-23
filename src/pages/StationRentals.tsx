import { useEffect, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import RelatedLinks from "@/components/RelatedLinks";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  FULL_SERVICE_STATION_TERRITORIES,
  LITE_STATION_TERRITORIES,
  STATION_FAQS,
  STATION_SERVICE_TYPES,
  STATION_TERRITORIES,
  STATION_TERRITORY_NOTES,
  formatStationRate,
  getStationInclusions,
  getTierRate,
} from "@/data/stationRentals";

const PAGE_TITLE = "Carnival Station Rental for Makeup Artists | Glam Hub";
const PAGE_DESCRIPTION =
  "Rent a station inside a Carnival Glam Hub. MUA, hair stylist, barber, braider and body-art station rental from US$200 per day in Trinidad, Jamaica, Miami, Barbados, Grenada and Saint Lucia.";
const CANONICAL = "https://www.carnivalglamhub.com/station-rentals";
const HERO_IMAGE = "/images/services/makeup-hero.jpg";

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
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Rent a station inside the{" "}
              <span className="italic text-gradient-primary">Carnival Glam Hub</span>
            </h1>
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
          <figure className="mb-14 -mx-4 sm:mx-0">
            <img
              src={HERO_IMAGE}
              alt="Artist working at a station inside the air-conditioned Carnival Glam Hub lounge"
              loading="eager"
              decoding="async"
              className="w-full h-[240px] sm:h-[380px] lg:h-[440px] sm:rounded-2xl object-cover object-center shadow-lg"
            />
          </figure>
        </section>

        {/* Who it is for */}
        <section className="container mx-auto px-4 sm:px-6 max-w-5xl mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 text-center">
            Who station rental is <span className="italic text-gradient-primary">for</span>
          </h2>
          <p className="font-body text-base text-muted-foreground text-center max-w-2xl mx-auto mb-8 leading-relaxed">
            Any independent Carnival service provider who wants a professional
            room to work from on Carnival morning without renting and staffing
            a venue of their own.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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

        {/* What you get */}
        <section className="container mx-auto px-4 sm:px-6 max-w-5xl mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 text-center">
            What a station <span className="italic text-gradient-primary">includes</span>
          </h2>
          <p className="font-body text-base text-muted-foreground text-center max-w-2xl mx-auto mb-8 leading-relaxed">
            The station is a table and a chair. Everything around it is the hub
            itself, and that changes by tier. Bring your own products, tools and
            consumables.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {(["full", "lite"] as const).map((tier) => {
              const sample = tier === "full" ? "trinidad" : "barbados";
              const territories =
                tier === "full"
                  ? FULL_SERVICE_STATION_TERRITORIES
                  : LITE_STATION_TERRITORIES;
              return (
                <div
                  key={tier}
                  className="rounded-2xl border border-border bg-card/50 p-6 sm:p-8"
                >
                  <span className="inline-block rounded-full bg-secondary/15 text-secondary font-body text-[11px] uppercase tracking-[0.15em] font-semibold px-3 py-1 mb-4">
                    {territories[0].tierLabel}
                  </span>
                  <p className="font-body text-sm text-muted-foreground mb-5">
                    {territories.map((t) => t.name).join(", ")}
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
            Enquire about a <span className="italic text-gradient-primary">station</span>
          </h2>
          <p className="font-body text-base text-muted-foreground text-center mb-8 leading-relaxed">
            Tell us what you do and where you want to work. We will come back to
            you with availability and the rate for your territory.
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

  const validate = () => {
    const next: Record<string, string> = {};
    if (form.full_name.trim().length < 2) next.full_name = "Please enter your full name.";
    if (!form.service_type) next.service_type = "Please choose your service.";
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
      service_type: form.service_type,
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
          station rate for your territory. If it is urgent, email{" "}
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
      aria-label="Station rental enquiry"
    >
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
            <option value="Other">Other</option>
          </select>
          {err("service_type")}
        </div>
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
