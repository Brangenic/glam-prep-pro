import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { getFreeInclusions, getHubTier, TIER_LABEL, MIAMI_SHUTTLE_NOTE, getCapabilities } from "@/data/hubTiers";
import {
  BARBER_PRICE,
  GETTING_DRESSED_PRICE,
  OVERNIGHT_BAG_CHECK_PRICE,
  TERRITORY_PRICING,
  getTerritoryPricing,
  lowestPremiumPrice,
  standardProducts,
  type DayKey,
  type QuoteProduct,
  type ServiceTag,
} from "@/data/territoryPricing";
import { hasSeasonPassed } from "@/data/seasons";

const PAGE_TITLE = "Carnival Glam Quote Calculator | Carnival Glam Hub";
const PAGE_DESCRIPTION =
  "Get a personalised Carnival morning quote in three steps. Real Carnival Glam Hub pricing for makeup, hair, photoshoot and Carnival morning access, by territory.";
const CANONICAL = "https://www.carnivalglamhub.com/booking-calculator";
const WHATSAPP_URL = "https://wa.me/18765090997";
const DISCLAIMER =
  "Estimated based on current Carnival Glam Hub pricing. Your booking team will confirm availability and final pricing.";

const COUNTRY_CODES = [
  "+1", "+1-868", "+1-876", "+1-246", "+1-473", "+1-758", "+1-268",
  "+44", "+61", "+49", "+33", "+34", "+39", "+31", "+32", "+353",
  "+592", "+597", "+509", "+507", "+52",
];

const PARTY_OPTIONS = [1, 2, 3, 4, 5];

type IntentKey =
  | "makeup"
  | "makeup-photoshoot"
  | "photoshoot"
  | "hair"
  | "full-glam"
  | "road-ready"
  | "group";

const INTENT_LABELS: Record<IntentKey, string> = {
  makeup: "Makeup",
  "makeup-photoshoot": "Makeup and photoshoot",
  photoshoot: "Photoshoot only",
  hair: "Hair",
  "full-glam": "Full Glam",
  "road-ready": "I already have glam, I just need Carnival morning access",
  group: "Group booking",
};

const sameTags = (p: QuoteProduct, tags: ServiceTag[]) =>
  p.tags.length === tags.length && tags.every((t) => p.tags.includes(t));

const hasAll = (p: QuoteProduct, tags: ServiceTag[]) => tags.every((t) => p.tags.includes(t));

/**
 * Only territories whose Carnival is still ahead of us can be quoted.
 * Derived from the season calendar, so a passed Carnival drops out of
 * the calculator on its own.
 */
const BOOKABLE_TERRITORIES = TERRITORY_PRICING.filter((t) => !hasSeasonPassed(t.slug));

/** Real products that satisfy a given intent, for a territory and day. */
function productsForIntent(products: QuoteProduct[], intent: IntentKey): QuoteProduct[] {
  switch (intent) {
    case "makeup":
      return products.filter((p) => sameTags(p, ["makeup"]));
    case "makeup-photoshoot":
      return products.filter((p) => sameTags(p, ["makeup", "photoshoot"]));
    case "photoshoot":
      return products.filter((p) => sameTags(p, ["photoshoot"]));
    case "hair":
      return products.filter((p) => sameTags(p, ["hair"]));
    case "full-glam":
      return products.filter((p) => hasAll(p, ["makeup", "hair", "photoshoot"]));
    default:
      return [];
  }
}

const BookingCalculator = () => {
  const [territory, setTerritory] = useState("");
  const [day, setDay] = useState<DayKey>("single");
  const [intent, setIntent] = useState<IntentKey | "">("");
  const [productId, setProductId] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [addBarber, setAddBarber] = useState(false);
  const [addOvernightBag, setAddOvernightBag] = useState(false);
  const [addReels, setAddReels] = useState(false);
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const config = useMemo(() => getTerritoryPricing(territory), [territory]);
  const tier = getHubTier(territory);
  const caps = getCapabilities(territory);

  // Reset downstream answers whenever the territory changes.
  useEffect(() => {
    setDay(config?.askDay ? config.days[0].key : (config?.days[0].key ?? "single"));
    setIntent("");
    setProductId("");
    setAddBarber(false);
    setAddOvernightBag(false);
    setAddReels(false);
  }, [config]);

  const dayProducts = useMemo(
    () => (config ? standardProducts(config, day) : []),
    [config, day],
  );

  const intents = useMemo<IntentKey[]>(() => {
    if (!config || !config.quotable) return [];
    const list: IntentKey[] = [];
    (["makeup", "makeup-photoshoot", "photoshoot", "hair", "full-glam"] as IntentKey[]).forEach(
      (k) => {
        if (productsForIntent(dayProducts, k).length > 0) list.push(k);
      },
    );
    if (config.roadReady) list.push("road-ready");
    list.push("group");
    return list;
  }, [config, dayProducts]);

  const intentProducts = useMemo(
    () => (intent && intent !== "road-ready" && intent !== "group"
      ? productsForIntent(dayProducts, intent)
      : []),
    [dayProducts, intent],
  );

  // Auto-resolve when an intent maps to exactly one real product.
  useEffect(() => {
    if (intentProducts.length === 1) setProductId(intentProducts[0].id);
    else setProductId("");
  }, [intentProducts]);

  const selectedProduct = useMemo(
    () => intentProducts.find((p) => p.id === productId) ?? null,
    [intentProducts, productId],
  );

  const lines = useMemo(() => {
    const out: { label: string; amount: number }[] = [];
    if (intent === "road-ready") {
      out.push({
        label: "Carnival morning access",
        amount: GETTING_DRESSED_PRICE * partySize,
      });
    } else if (selectedProduct) {
      out.push({ label: selectedProduct.label, amount: selectedProduct.price * partySize });
    }
    if (addBarber && config?.barber) {
      out.push({ label: "Barber", amount: BARBER_PRICE * partySize });
    }
    if (addOvernightBag && caps.overnightBagCheck) {
      out.push({
        label: "Overnight bag check",
        amount: OVERNIGHT_BAG_CHECK_PRICE * partySize,
      });
    }
    return out;
  }, [intent, selectedProduct, partySize, addBarber, addOvernightBag, caps, config]);

  const total = lines.reduce((s, l) => s + l.amount, 0);
  const isGroup = partySize >= 5 || intent === "group";
  const quotable = Boolean(config?.quotable) && intent !== "group";

  const inclusions = useMemo(() => {
    const free = getFreeInclusions(territory);
    // On the road ready path, getting dressed is the thing being paid for.
    if (intent === "road-ready") {
      return free.filter((i) => i !== "Getting-dressed assistance");
    }
    return free;
  }, [territory, intent]);

  const premiumFrom = useMemo(
    () => (config && config.quotable ? lowestPremiumPrice(config, day) : null),
    [config, day],
  );

  const dayLabel = config?.days.find((d) => d.key === day)?.label ?? "";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) {
      toast({
        title: "Choose your territory",
        description: "Tell us where you are playing Carnival so we can price your morning.",
      });
      return;
    }
    if (!email.trim() || !whatsapp.trim()) {
      toast({
        title: "A few details missing",
        description: "Please add your email and WhatsApp so we can confirm your slot.",
      });
      return;
    }

    // Enquiry path: group bookings and territories we cannot yet price.
    if (isGroup || !quotable) {
      window.location.href = WHATSAPP_URL;
      return;
    }

    if (total === 0) {
      toast({
        title: "Choose what you need",
        description: "Pick what you need for Carnival morning to see your quote.",
      });
      return;
    }

    setSubmitting(true);

    const w = window as unknown as {
      dataLayer?: Array<Record<string, unknown>>;
      gtag?: (...args: unknown[]) => void;
    };
    w.dataLayer = w.dataLayer || [];
    if (typeof w.gtag === "function") {
      w.gtag("event", "conversion", {
        send_to: "AW-10894663311/7s1DCKX357McEI-9_coo",
        value: total,
        currency: "USD",
      });
      w.gtag("event", "generate_lead", {
        territory,
        carnival_day: day,
        party_size: partySize,
        estimated_total: total,
        currency: "USD",
      });
    }

    const params = new URLSearchParams();
    params.set("territory", territory);
    params.set("day", day);
    params.set("party_size", String(partySize));
    params.set("email", email);
    params.set("whatsapp", `${countryCode}${whatsapp}`);
    const target = `${config.bookingUrl}?${params.toString()}`;

    setTimeout(() => {
      setSubmitting(false);
      window.location.href = target;
    }, 250);
  };

  const primaryCtaLabel = isGroup
    ? "Request Group Quote"
    : quotable
      ? "Reserve Your Carnival Morning"
      : "Speak to Our Team";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-28 sm:pt-32 pb-28">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <header className="text-center mb-10 sm:mb-14">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-4">
              Quote calculator
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
              Carnival Glam Quote Calculator
            </h1>
            <p className="font-body text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A few quick questions. Real Carnival Glam Hub pricing for your morning.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10"
            data-mcp-action="get-quote"
            data-mcp-description="Get a price quote for Carnival Glam Hub services for a chosen Carnival territory, Carnival day, service intent and party size."
            data-mcp-params='{"required":["destination","people","email"],"optional":["carnival_day","intent","product","barber","overnight_bag_check","reels","phone","country_code"]}'
          >
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-7">
                {/* 1. Territory */}
                <div className="space-y-2">
                  <Label htmlFor="territory" className="font-body text-sm font-semibold">
                    Where are you playing Carnival?
                  </Label>
                  <Select value={territory} onValueChange={setTerritory} name="destination">
                    <SelectTrigger
                      id="territory"
                      aria-label="Carnival destination"
                      data-mcp-param="destination"
                    >
                      <SelectValue placeholder="Choose your Carnival" />
                    </SelectTrigger>
                    <SelectContent>
                      {BOOKABLE_TERRITORIES.map((t) => (
                        <SelectItem key={t.slug} value={t.slug}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {config && tier && (
                    <p className="font-body text-xs text-muted-foreground">
                      {TIER_LABEL[tier]}
                      {territory === "miami" ? `. ${MIAMI_SHUTTLE_NOTE}` : ""}
                    </p>
                  )}
                </div>

                {/* 2. Carnival day */}
                {config?.askDay && (
                  <div className="space-y-2">
                    <Label className="font-body text-sm font-semibold">Carnival day</Label>
                    <div
                      className="flex flex-wrap gap-2"
                      role="radiogroup"
                      aria-label="Carnival day"
                      data-mcp-param="carnival_day"
                    >
                      {config.days.map((d) => {
                        const active = day === d.key;
                        return (
                          <button
                            key={d.key}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            aria-label={d.label}
                            onClick={() => { setDay(d.key); setIntent(""); }}
                            className={`h-11 px-5 rounded-full border font-body text-sm font-medium transition-all ${
                              active
                                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                                : "bg-background border-border text-foreground hover:border-primary/60"
                            }`}
                          >
                            {d.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {config?.eventDate && (
                  <p className="font-body text-xs text-muted-foreground -mt-3">
                    {config.label}, {config.eventDate}
                  </p>
                )}

                {/* 3. Intent */}
                {config && config.quotable && (
                  <div className="space-y-2">
                    <Label className="font-body text-sm font-semibold">
                      What do you need for Carnival morning?
                    </Label>
                    <div
                      className="flex flex-col gap-2"
                      role="radiogroup"
                      aria-label="What you need for Carnival morning"
                      data-mcp-param="intent"
                    >
                      {intents.map((k) => {
                        const active = intent === k;
                        return (
                          <button
                            key={k}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            aria-label={INTENT_LABELS[k]}
                            onClick={() => setIntent(k)}
                            className={`text-left px-5 py-3 rounded-2xl border font-body text-sm font-medium transition-all ${
                              active
                                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                                : "bg-background border-border text-foreground hover:border-primary/60"
                            }`}
                          >
                            {INTENT_LABELS[k]}
                            {k === "road-ready" && (
                              <span className={`block text-xs mt-0.5 ${active ? "opacity-80" : "text-muted-foreground"}`}>
                                US${GETTING_DRESSED_PRICE} per masquerader
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Secondary chooser where a tag has several real options */}
                    {intentProducts.length > 1 && (
                      <div className="pt-3 space-y-2" role="radiogroup" aria-label="Choose your option" data-mcp-param="product">
                        <p className="font-body text-sm font-medium">Choose your option</p>
                        {intentProducts.map((p) => {
                          const active = productId === p.id;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              role="radio"
                              aria-checked={active}
                              aria-label={`${p.label}, US$${p.price}`}
                              onClick={() => setProductId(p.id)}
                              className={`w-full flex items-center justify-between gap-4 px-5 py-3 rounded-2xl border font-body text-sm transition-all ${
                                active
                                  ? "border-primary bg-primary/10"
                                  : "border-border bg-background hover:border-primary/60"
                              }`}
                            >
                              <span>{p.label}</span>
                              <span className="font-semibold whitespace-nowrap">US${p.price}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {intent === "group" && (
                      <p className="font-body text-xs text-muted-foreground pt-2">
                        Group bookings are quoted by our team so we can match artists to your party.
                      </p>
                    )}
                  </div>
                )}

                {config && !config.quotable && (
                  <p className="font-body text-sm text-muted-foreground">
                    Pricing for {config.label} is confirmed on enquiry. Tell us what you need and our
                    team will come back to you.
                  </p>
                )}

                {/* 4. Party size */}
                <div className="space-y-2">
                  <Label className="font-body text-sm font-semibold">Number of masqueraders</Label>
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
                      For parties of five or more, our team confirms your quote directly.
                    </p>
                  )}
                </div>

                {/* Optional extra */}
                {config?.barber && (
                  <label htmlFor="barber" className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      id="barber"
                      name="barber"
                      aria-label={`Add barber, US$${BARBER_PRICE} per masquerader`}
                      data-mcp-param="barber"
                      checked={addBarber}
                      onCheckedChange={() => setAddBarber((v) => !v)}
                      className="mt-1"
                    />
                    <span className="font-body text-sm leading-snug">
                      Barber
                      <span className="block text-muted-foreground text-xs mt-0.5">
                        US${BARBER_PRICE} per masquerader
                      </span>
                    </span>
                  </label>
                )}

                {caps.overnightBagCheck && (
                  <label htmlFor="overnight-bag" className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      id="overnight-bag"
                      name="overnight_bag_check"
                      aria-label={`Add overnight bag check, US$${OVERNIGHT_BAG_CHECK_PRICE} per masquerader`}
                      data-mcp-param="overnight_bag_check"
                      checked={addOvernightBag}
                      onCheckedChange={() => setAddOvernightBag((v) => !v)}
                      className="mt-1"
                    />
                    <span className="font-body text-sm leading-snug">
                      Overnight bag check
                      <span className="block text-muted-foreground text-xs mt-0.5">
                        US${OVERNIGHT_BAG_CHECK_PRICE} per masquerader. Collect that night or the next day.
                      </span>
                    </span>
                  </label>
                )}

                {caps.reels && (
                  <label htmlFor="reels" className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      id="reels"
                      name="reels"
                      aria-label="Add reels, price confirmed on booking"
                      data-mcp-param="reels"
                      checked={addReels}
                      onCheckedChange={() => setAddReels((v) => !v)}
                      className="mt-1"
                    />
                    <span className="font-body text-sm leading-snug">
                      Reels
                      <span className="block text-muted-foreground text-xs mt-0.5">
                        Price confirmed on booking.
                      </span>
                    </span>
                  </label>
                )}
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

            {/* Quote card */}
            <aside className="lg:sticky lg:top-28 self-start space-y-4">
              <div
                aria-live="polite"
                aria-atomic="true"
                className="rounded-2xl border border-border bg-card p-6 sm:p-8 gold-glow"
              >
                <p className="font-body text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-3">
                  Your Carnival morning
                </p>

                {!config ? (
                  <p className="font-display text-2xl sm:text-3xl font-bold mb-4">
                    Choose your territory to begin
                  </p>
                ) : (
                  <>
                    <p className="font-display text-xl sm:text-2xl font-bold leading-snug">
                      {config.label}
                    </p>
                    {config.askDay && dayLabel && (
                      <p className="font-body text-sm text-muted-foreground mt-1">{dayLabel}</p>
                    )}
                    <p className="font-body text-sm text-muted-foreground">
                      {partySize === 5 ? "5 or more" : partySize} masquerader{partySize === 1 ? "" : "s"}
                    </p>

                    {quotable ? (
                      <>
                        {lines.length > 0 ? (
                          <div className="border-t border-border mt-5 pt-4 space-y-2">
                            {lines.map((l) => (
                              <div key={l.label} className="flex justify-between gap-4 font-body text-sm">
                                <span className="text-muted-foreground">{l.label}</span>
                                <span className="whitespace-nowrap">US${l.amount.toLocaleString()}</span>
                              </div>
                            ))}
                            <div className="flex justify-between gap-4 items-baseline border-t border-border pt-3 mt-3">
                              <span className="font-body text-xs uppercase tracking-[0.16em] font-semibold">
                                Estimated total
                              </span>
                              <span className="font-display text-2xl font-bold whitespace-nowrap">
                                US${total.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="font-body text-sm text-muted-foreground border-t border-border mt-5 pt-4">
                            Choose what you need for Carnival morning to see your total.
                          </p>
                        )}

                        {addReels && caps.reels && (
                          <p className="font-body text-xs text-muted-foreground mt-3">
                            Reels are not included in this total. Your booking team will confirm the
                            reels price when they confirm your appointment.
                          </p>
                        )}

                        {premiumFrom !== null && (
                          <p className="font-body text-xs text-muted-foreground mt-3">
                            Celebrity and Gabby Glam Team artists are available from US${premiumFrom}.
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="font-body text-sm text-muted-foreground border-t border-border mt-5 pt-4">
                        {intent === "group"
                          ? "Group pricing is confirmed on enquiry."
                          : `Pricing for ${config.label} is confirmed on enquiry.`}
                      </p>
                    )}

                    {inclusions.length > 0 && (
                      <div className="border-t border-border mt-5 pt-4">
                        <p className="font-body text-xs uppercase tracking-[0.16em] font-semibold mb-3">
                          Included with your booking
                        </p>
                        <ul className="space-y-1.5">
                          {inclusions.map((i) => (
                            <li key={i} className="flex items-start gap-2 font-body text-sm text-muted-foreground">
                              <Check className="h-4 w-4 mt-0.5 shrink-0 text-secondary" aria-hidden="true" />
                              <span>{i}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {config.provisionalNote && (
                      <p className="font-body text-xs text-muted-foreground mt-4">
                        {config.provisionalNote}
                      </p>
                    )}
                    {config.deposit && (
                      <p className="font-body text-xs text-muted-foreground mt-2">
                        {config.deposit.note}
                      </p>
                    )}
                  </>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 mt-6"
                  size="lg"
                >
                  {submitting ? "Sending..." : primaryCtaLabel}
                </Button>
                <a
                  href={WHATSAPP_URL}
                  rel="nofollow noopener"
                  className="block text-center mt-4 font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Speak to Our Team →
                </a>
              </div>

              <p className="font-body text-xs text-muted-foreground text-center px-2">
                {DISCLAIMER}
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
          {quotable && total > 0 && !isGroup
            ? `${primaryCtaLabel} · US$${total.toLocaleString()}`
            : primaryCtaLabel}
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default BookingCalculator;
