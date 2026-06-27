import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const PAGE_TITLE = "Carnival Glam Quote Calculator | Carnival Glam Hub";
const PAGE_DESCRIPTION =
  "Get a personalised Carnival morning quote in three steps. Sweat-proof makeup, hair, dressing, photoshoot and shuttle, priced for your party size and territory.";
const CANONICAL = "https://www.carnivalglamhub.com/booking-calculator";
const MASOS_URL = "https://carnivalglamhub.masos.app";

type Territory = {
  value: string;
  label: string;
  nextDate?: string; // YYYY-MM-DD
};

const TERRITORIES: Territory[] = [
  { value: "trinidad", label: "Trinidad", nextDate: "2027-02-08" },
  { value: "jamaica", label: "Jamaica", nextDate: "2027-04-11" },
  { value: "saint-lucia", label: "Saint Lucia", nextDate: "2026-07-20" },
  { value: "grenada", label: "Grenada (Spice Mas)", nextDate: "2026-08-10" },
  { value: "antigua", label: "Antigua", nextDate: "2026-08-03" },
  { value: "barbados", label: "Barbados (Crop Over)", nextDate: "2026-08-03" },
  { value: "miami", label: "Miami", nextDate: "2026-10-11" },
  { value: "toronto", label: "Toronto (Caribana)", nextDate: "2026-08-01" },
  { value: "guyana", label: "Guyana", nextDate: "2027-02-22" },
  { value: "epic-cruise", label: "Epic Cruise" },
  { value: "other", label: "Other" },
];

const COUNTRY_CODES = [
  "+1", "+1-868", "+1-876", "+1-246", "+1-473", "+1-758", "+1-268",
  "+44", "+61", "+49", "+33", "+34", "+39", "+31", "+32", "+353",
  "+592", "+597", "+509", "+507", "+52",
];

type ServiceKey =
  | "makeup"
  | "hair"
  | "dressing"
  | "photoshoot"
  | "shuttle"
  | "refreshments";

type Service = {
  key: ServiceKey;
  label: string;
  price: number;
};

const SERVICES: Service[] = [
  { key: "makeup", label: "Carnival makeup (sweat-proof)", price: 280 },
  { key: "hair", label: "Carnival hair styling", price: 180 },
  { key: "dressing", label: "Getting-dressed assistance", price: 80 },
  { key: "photoshoot", label: "Photoshoot add-on", price: 220 },
  { key: "shuttle", label: "Shuttle to your band", price: 60 },
  { key: "refreshments", label: "Refreshments and lounge access", price: 45 },
];

const PARTY_OPTIONS = [1, 2, 3, 4, 5];

const BookingCalculator = () => {
  const [territory, setTerritory] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [selectedServices, setSelectedServices] = useState<Record<ServiceKey, boolean>>({
    makeup: true,
    hair: true,
    dressing: false,
    photoshoot: false,
    shuttle: false,
    refreshments: false,
  });
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Default event date when territory changes
  useEffect(() => {
    const t = TERRITORIES.find((x) => x.value === territory);
    if (t?.nextDate && !eventDate) setEventDate(t.nextDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [territory]);

  const { subtotal, low, high, mid, included, discountPct } = useMemo(() => {
    let raw = 0;
    const inc: { label: string; subtotal: number }[] = [];
    SERVICES.forEach((s) => {
      if (!selectedServices[s.key]) return;
      const line = s.price * partySize;
      raw += line;
      inc.push({ label: s.label, subtotal: line });
    });
    const discount = partySize >= 4 ? 0.1 : 0;
    const sub = Math.round(raw * (1 - discount));
    return {
      subtotal: sub,
      low: sub,
      high: Math.round(sub * 1.15),
      mid: Math.round(sub * 1.075),
      included: inc,
      discountPct: discount * 100,
    };
  }, [selectedServices, partySize]);

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

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const prevCanonical = canonical?.getAttribute("href") ?? null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", CANONICAL);

    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Carnival morning concierge",
      areaServed: "Caribbean",
      provider: {
        "@type": "Organization",
        name: "Carnival Glam Hub",
        url: "https://www.carnivalglamhub.com",
      },
      url: CANONICAL,
    });
    document.head.appendChild(ld);

    return () => {
      document.title = previousTitle;
      restorers.forEach((r) => r());
      if (prevCanonical !== null) canonical?.setAttribute("href", prevCanonical);
      else canonical?.remove();
      ld.remove();
    };
  }, []);

  const toggleService = (key: ServiceKey) =>
    setSelectedServices((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !whatsapp.trim()) {
      toast({
        title: "A few details missing",
        description: "Please add your email and WhatsApp so we can confirm your slot.",
      });
      return;
    }
    if (subtotal === 0) {
      toast({
        title: "Choose at least one service",
        description: "Tick the services you would like included in your morning.",
      });
      return;
    }
    setSubmitting(true);

    const services = SERVICES.filter((s) => selectedServices[s.key]).map((s) => s.label);

    const w = window as unknown as {
      dataLayer?: Array<Record<string, unknown>>;
      gtag?: (...args: unknown[]) => void;
    };
    w.dataLayer = w.dataLayer || [];
    if (typeof w.gtag === "function") {
      w.gtag("event", "conversion", {
        send_to: "AW-10894663311/7s1DCKX357McEI-9_coo",
        value: mid,
        currency: "USD",
      });
      w.gtag("event", "generate_lead", {
        territory,
        services_count: services.length,
        party_size: partySize,
        estimated_total: mid,
        currency: "USD",
      });
    }

    const params = new URLSearchParams();
    if (territory) params.set("territory", territory);
    if (eventDate) params.set("date", eventDate);
    params.set("party_size", String(partySize));
    params.set("email", email);
    params.set("whatsapp", `${countryCode}${whatsapp}`);
    const target = `${MASOS_URL}/events?${params.toString()}`;

    setTimeout(() => {
      setSubmitting(false);
      window.location.href = target;
    }, 250);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-28 sm:pt-32 pb-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <header className="text-center mb-10 sm:mb-14">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4">
              Quote calculator
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
              Carnival Glam Quote Calculator
            </h1>
            <p className="font-body text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Three quick questions. Your personalised Carnival morning quote.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10"
            data-mcp-action="get-quote"
            data-mcp-description="Get a price quote for Carnival Glam Hub services for a chosen Carnival territory, party size and add-ons."
            data-mcp-params='{"required":["destination","people","email"],"optional":["addons","date","phone","country_code"]}'
          >
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="territory">Territory</Label>
                  <Select value={territory} onValueChange={setTerritory} name="destination">
                    <SelectTrigger
                      id="territory"
                      aria-label="Carnival destination"
                      data-mcp-param="destination"
                    >
                      <SelectValue placeholder="Choose your Carnival" />
                    </SelectTrigger>
                    <SelectContent>
                      {TERRITORIES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-date">Carnival event date</Label>
                  <Input
                    id="event-date"
                    type="date"
                    name="date"
                    aria-label="Carnival event date"
                    data-mcp-param="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Number of masqueraders</Label>
                  <div
                    className="flex flex-wrap gap-2"
                    role="radiogroup"
                    aria-label="Number of masqueraders"
                    data-mcp-param="people"
                  >
                    {PARTY_OPTIONS.map((n) => {
                      const active = partySize === n;
                      const label = n === 5 ? "5+" : String(n);
                      return (
                        <button
                          key={n}
                          type="button"
                          role="radio"
                          name="people"
                          value={n}
                          aria-label={`${label} masquerader${n === 1 ? "" : "s"}`}
                          aria-checked={active}
                          onClick={() => setPartySize(n)}
                          className={`min-w-[3rem] h-11 px-4 rounded-full border font-body text-sm font-medium transition-all ${
                            active
                              ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                              : "bg-background border-border text-foreground hover:border-primary/60"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  {partySize >= 5 && (
                    <p className="font-body text-xs text-muted-foreground mt-2">
                      For groups of 5 or more, we will confirm pricing on a call.
                    </p>
                  )}
                </div>

                <fieldset className="space-y-3">
                  <legend className="font-body text-sm font-medium mb-2">Services</legend>
                  {SERVICES.map((s) => (
                    <label
                      key={s.key}
                      htmlFor={`svc-${s.key}`}
                      className="flex items-start gap-3 cursor-pointer"
                    >
                      <Checkbox
                        id={`svc-${s.key}`}
                        name={`addon_${s.key}`}
                        value={s.key}
                        aria-label={`Add ${s.label}`}
                        data-mcp-param={`addon_${s.key}`}
                        checked={selectedServices[s.key]}
                        onCheckedChange={() => toggleService(s.key)}
                        className="mt-1"
                      />
                      <span className="font-body text-sm leading-snug">
                        {s.label}
                        <span className="block text-muted-foreground text-xs mt-0.5">
                          From ${s.price} per masquerader
                        </span>
                      </span>
                    </label>
                  ))}
                </fieldset>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4">
                <h2 className="font-display text-xl font-bold">Your details</h2>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    aria-label="Email address"
                    data-mcp-param="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    maxLength={255}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp number</Label>
                  <div className="flex gap-2">
                    <Select value={countryCode} onValueChange={setCountryCode} name="country_code">
                      <SelectTrigger
                        className="w-[110px]"
                        aria-label="Country dialling code"
                        data-mcp-param="country_code"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRY_CODES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="whatsapp"
                      type="tel"
                      name="phone"
                      aria-label="WhatsApp phone number"
                      data-mcp-param="phone"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value.replace(/[^\d\s-]/g, ""))}
                      autoComplete="tel"
                      maxLength={20}
                      placeholder="868 555 0100"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 self-start space-y-4">
              <div
                aria-live="polite"
                aria-atomic="true"
                className="rounded-2xl border border-border bg-card p-6 sm:p-8 gold-glow"
              >
                <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-3">
                  Your quote range
                </p>
                {subtotal === 0 ? (
                  <p className="font-display text-2xl sm:text-3xl font-bold mb-4">
                    Choose services to see your quote
                  </p>
                ) : (
                  <>
                    <p className="font-display text-3xl sm:text-4xl font-bold mb-2">
                      ${low.toLocaleString()} <span className="text-muted-foreground font-normal text-xl">to</span> ${high.toLocaleString()}{" "}
                      <span className="text-muted-foreground font-normal text-base">USD</span>
                    </p>
                    <p className="font-body text-sm text-muted-foreground mb-4">
                      Estimated time at the lounge: 3 to 4 hours
                      {discountPct > 0 && (
                        <span className="block text-primary mt-1">Group discount applied: {discountPct}% off</span>
                      )}
                    </p>
                  </>
                )}
                <p className="font-body text-sm text-muted-foreground mb-5">
                  Estimate for {TERRITORIES.find((t) => t.value === territory)?.label || "your territory"}, party of {partySize === 5 ? "5+" : partySize}. Final price confirmed by our team within 48 hours.
                </p>

                {included.length > 0 && (
                  <div className="border-t border-border pt-4 mb-5">
                    <p className="font-body text-sm font-semibold mb-3">What is included</p>
                    <ul className="space-y-2">
                      {included.map((i) => (
                        <li key={i.label} className="flex justify-between font-body text-sm">
                          <span className="text-muted-foreground">{i.label}</span>
                          <span>${i.subtotal.toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
                  size="lg"
                >
                  {submitting ? "Sending..." : "Reserve Your Carnival Morning"}
                </Button>
                <a
                  href="https://wa.me/18765090997"
                  className="block text-center mt-4 font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Speak to our team →
                </a>
              </div>

              <p className="font-body text-xs text-muted-foreground text-center px-2">
                Prices are indicative. Carnival Glam Hub will confirm a firm total in writing before any payment.
              </p>
            </aside>
          </form>
        </div>
      </main>

      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-card border-t border-border p-3 z-40">
        <Button
          type="button"
          onClick={() => {
            const form = document.querySelector("form");
            form?.requestSubmit();
          }}
          className="w-full rounded-full bg-primary text-primary-foreground"
          size="lg"
        >
          {subtotal > 0 ? `Reserve from $${low.toLocaleString()}` : "Reserve Your Carnival Morning"}
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default BookingCalculator;