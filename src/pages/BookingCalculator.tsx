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
import { useNavigate } from "react-router-dom";

const PAGE_TITLE = "Carnival Glam Quote Calculator | Carnival Glam Hub";
const PAGE_DESCRIPTION =
  "Get an instant Carnival glam quote for Trinidad, Jamaica, Miami, Toronto, Crop Over, Spice Mas, Saint Lucia, and Antigua. Sweat-proof makeup, hair, photoshoot, shuttle. Plan your Carnival morning.";
const CANONICAL = "https://www.carnivalglamhub.com/booking-calculator";

const TERRITORIES = [
  "Trinidad",
  "Jamaica",
  "Miami",
  "Toronto (Caribana)",
  "Grenada (Spice Mas)",
  "Barbados (Crop Over)",
  "Saint Lucia",
  "Antigua",
  "Other",
];

type ServiceKey =
  | "makeup"
  | "hair"
  | "dressing"
  | "photoshoot"
  | "shuttle"
  | "photoAddon";

type Service = {
  key: ServiceKey;
  label: string;
  price: number;
  perPerson: boolean;
};

const SERVICES: Service[] = [
  { key: "makeup", label: "Sweat-proof Carnival makeup", price: 200, perPerson: true },
  { key: "hair", label: "Carnival hair styling", price: 150, perPerson: true },
  { key: "dressing", label: "Getting-dressed assistance", price: 75, perPerson: true },
  { key: "photoshoot", label: "Professional Carnival photoshoot", price: 350, perPerson: true },
  { key: "shuttle", label: "Shuttle to band meeting point", price: 100, perPerson: false },
  { key: "photoAddon", label: "Additional photography add-on", price: 200, perPerson: true },
];

const PARTY_SIZES = ["1", "2", "3", "4", "5 or more"];

const BookingCalculator = () => {
  const navigate = useNavigate();
  const [territory, setTerritory] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [partySize, setPartySize] = useState("1");
  const [selectedServices, setSelectedServices] = useState<Record<ServiceKey, boolean>>({
    makeup: true,
    hair: false,
    dressing: false,
    photoshoot: false,
    shuttle: false,
    photoAddon: false,
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const partyCount = useMemo(() => {
    if (partySize === "5 or more") return 5;
    return Number.parseInt(partySize, 10) || 1;
  }, [partySize]);

  const { base, low, high, mid, included } = useMemo(() => {
    let total = 0;
    const inc: { label: string; subtotal: number }[] = [];
    SERVICES.forEach((s) => {
      if (!selectedServices[s.key]) return;
      const subtotal = s.perPerson ? s.price * partyCount : s.price;
      total += subtotal;
      inc.push({ label: s.label, subtotal });
    });
    return {
      base: total,
      low: Math.round(total * 0.85),
      high: Math.round(total * 1.15),
      mid: Math.round(total),
      included: inc,
    };
  }, [selectedServices, partyCount]);

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

    return () => {
      document.title = previousTitle;
      restorers.forEach((r) => r());
      if (prevCanonical !== null) canonical?.setAttribute("href", prevCanonical);
      else canonical?.remove();
    };
  }, []);

  const toggleService = (key: ServiceKey) =>
    setSelectedServices((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !whatsapp.trim()) {
      toast({
        title: "A few details missing",
        description: "Please add your name, email and WhatsApp so we can confirm your slot.",
      });
      return;
    }
    if (base === 0) {
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
    w.dataLayer.push({
      event: "booking_calculator_submit",
      territory,
      party_size: partyCount,
      services,
      quote_midpoint: mid,
    });

    if (typeof w.gtag === "function") {
      w.gtag("event", "conversion", {
        send_to: "AW-10894663311/7s1DCKX357McEI-9_coo",
        value: mid,
        currency: "USD",
      });
    }

    setTimeout(() => {
      setSubmitting(false);
      navigate("/thank-you");
    }, 350);
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
              Carnival Glam{" "}
              <span className="italic text-gradient-primary">Quote Calculator</span>
            </h1>
            <p className="font-body text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Pick your territory, party size and services. Your quote range updates as you build your Carnival morning.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10"
          >
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="territory">Territory</Label>
                  <Select value={territory} onValueChange={setTerritory}>
                    <SelectTrigger id="territory">
                      <SelectValue placeholder="Choose your Carnival" />
                    </SelectTrigger>
                    <SelectContent>
                      {TERRITORIES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-date">Carnival event date</Label>
                  <Input
                    id="event-date"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="party-size">Party size</Label>
                  <Select value={partySize} onValueChange={setPartySize}>
                    <SelectTrigger id="party-size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PARTY_SIZES.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                        checked={selectedServices[s.key]}
                        onCheckedChange={() => toggleService(s.key)}
                        className="mt-1"
                      />
                      <span className="font-body text-sm leading-snug">
                        {s.label}
                        <span className="block text-muted-foreground text-xs mt-0.5">
                          From ${s.price}{s.perPerson ? " per person" : " per booking"}
                        </span>
                      </span>
                    </label>
                  ))}
                </fieldset>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4">
                <h2 className="font-display text-xl font-bold">Your details</h2>
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    maxLength={255}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp number</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    autoComplete="tel"
                    maxLength={32}
                    placeholder="+1 868 ..."
                  />
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
                {base === 0 ? (
                  <p className="font-display text-2xl sm:text-3xl font-bold mb-4">
                    Choose services to see your quote
                  </p>
                ) : (
                  <p className="font-display text-3xl sm:text-4xl font-bold mb-4">
                    ${low.toLocaleString()} <span className="text-muted-foreground font-normal text-xl">to</span> ${high.toLocaleString()}{" "}
                    <span className="text-muted-foreground font-normal text-base">USD</span>
                  </p>
                )}
                <p className="font-body text-sm text-muted-foreground mb-5">
                  Estimate for {territory || "your territory"}, party of {partyCount}. Final price confirmed by our team within 48 hours.
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
          {base > 0 ? `Reserve from $${low.toLocaleString()}` : "Reserve Your Carnival Morning"}
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default BookingCalculator;