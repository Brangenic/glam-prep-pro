import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import heroCover from "@/assets/trinidad-2027-hero.webp";
import { hasSeasonPassed } from "@/data/seasons";
import {
  TRINIDAD_BOOK_CATALOGUE as C,
  TRINIDAD_BOOK_DESCRIPTION,
  TRINIDAD_BOOK_FAQ,
  TRINIDAD_BOOK_H1,
  TRINIDAD_BOOK_PAYMENT_SENTENCE,
  TRINIDAD_BOOK_PRODUCTS,
  TRINIDAD_BOOK_SLOTS_SENTENCE,
  TRINIDAD_BOOK_TITLE,
  TRINIDAD_BOOK_URL,
  DAY_LABEL,
} from "@/data/trinidadBookPage";

type Avail = Record<string, { time: string; spots_left: number }[]>;
type DayKey = "monday" | "tuesday" | "both";
const API = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/glam-hub-mcp/web`;
const HEADERS = { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string };

function useMeta() {
  useEffect(() => {
    const prev = document.title;
    document.title = TRINIDAD_BOOK_TITLE;
    const d = document.querySelector('meta[name="description"]');
    const prevD = d?.getAttribute("content");
    d?.setAttribute("content", TRINIDAD_BOOK_DESCRIPTION);
    let c = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const prevC = c?.href;
    if (!c) { c = document.createElement("link"); c.rel = "canonical"; document.head.appendChild(c); }
    c.href = TRINIDAD_BOOK_URL;
    return () => {
      document.title = prev;
      if (prevD != null) d?.setAttribute("content", prevD);
      if (prevC && c) c.href = prevC;
    };
  }, []);
}

const TrinidadBook = () => {
  useMeta();
  const closed = hasSeasonPassed("trinidad");
  const [day, setDay] = useState<DayKey>("monday");
  const products = TRINIDAD_BOOK_PRODUCTS.filter((p) => p.day === day);
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [avail, setAvail] = useState<Avail | null>(null);
  const [availError, setAvailError] = useState(false);
  const [slots, setSlots] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "" });
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const product = TRINIDAD_BOOK_PRODUCTS.find((p) => p.id === productId);
  const days: ("monday" | "tuesday")[] = day === "both" ? ["monday", "tuesday"] : [day];

  const load = () =>
    fetch(`${API}/options`, { headers: HEADERS })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => { setAvail(j.availability); setAvailError(false); })
      .catch(() => setAvailError(true));

  useEffect(() => { if (!closed) load(); }, [closed]);
  useEffect(() => {
    const first = TRINIDAD_BOOK_PRODUCTS.find((p) => p.day === day);
    if (first) setProductId(first.id);
    setSlots({});
  }, [day]);

  const ready = useMemo(
    () => !!product && days.every((d) => slots[d]) && form.first_name.trim() && form.last_name.trim() && form.email.trim() && form.phone.trim() && terms,
    [product, days, slots, form, terms],
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready || !product) return;
    setBusy(true); setError(null);
    const body: Record<string, unknown> = { product_id: product.id, ...form, accepted_terms: true };
    for (const d of days) body[`${d}_slot`] = slots[d];
    try {
      const r = await fetch(`${API}/book`, { method: "POST", headers: { ...HEADERS, "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await r.json();
      if (j.checkout_url) { window.location.href = j.checkout_url; return; }
      setError(j.error ?? "We could not start your booking. Please try again.");
      if (j.availability) setAvail(j.availability);
      else load();
    } catch {
      setError("We could not start your booking. Please try again.");
    }
    setBusy(false);
  };

  const input = "w-full rounded-xl border border-primary/30 bg-background/5 px-4 py-3 font-body text-background placeholder:text-background/40 focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <>
      <Navbar />
      <main className="bg-foreground text-background">
        <section className="relative">
          <img src={heroCover} alt="Masquerader in Trinidad Carnival costume glammed by Carnival Glam Hub" className="absolute inset-0 w-full h-full object-cover object-top opacity-40" />
          <div className="relative container mx-auto px-4 sm:px-6 max-w-3xl pt-32 pb-14 text-center">
            <p className="font-body text-xs uppercase tracking-[0.25em] text-primary mb-3">{C.event}</p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight">{TRINIDAD_BOOK_H1}</h1>
            <p className="font-body text-sm sm:text-base text-background/80 mt-4 capitalize-first">
              {C.dates.map((d) => d.display).join(" and ")}, at {C.venue}.
            </p>
          </div>
        </section>

        {closed ? (
          <section className="container mx-auto px-4 sm:px-6 max-w-2xl py-16 text-center">
            <h2 className="font-display text-2xl font-bold text-primary mb-4">Trinidad Carnival 2027 bookings are closed</h2>
            <p className="font-body text-background/80 mb-6">The 2027 season has wrapped. Thank you to every masquerader who glammed with us.</p>
            <Link to="/trinidad" className="inline-block bg-primary text-primary-foreground font-body font-semibold px-8 py-3.5 rounded-full">Visit our Trinidad page</Link>
          </section>
        ) : (
          <form onSubmit={submit} className="container mx-auto px-4 sm:px-6 max-w-2xl py-10 space-y-10">
            <section>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-primary mb-4">1. Choose your day</h2>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Day">
                {(["monday", "tuesday", "both"] as DayKey[]).map((d) => (
                  <button type="button" key={d} role="radio" aria-checked={day === d} onClick={() => setDay(d)}
                    className={`rounded-xl border px-3 py-3 font-body text-sm font-semibold transition-colors ${day === d ? "bg-primary text-primary-foreground border-primary" : "border-primary/40 text-background hover:border-primary"}`}>
                    {DAY_LABEL[d]}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-primary mb-4">2. Choose your service</h2>
              <div className="space-y-2" role="radiogroup" aria-label="Service">
                {products.map((p) => (
                  <button type="button" key={p.id} role="radio" aria-checked={productId === p.id} onClick={() => setProductId(p.id)}
                    className={`w-full flex items-center justify-between rounded-xl border px-4 py-4 font-body text-left transition-colors ${productId === p.id ? "border-primary bg-primary/15" : "border-primary/30 hover:border-primary"}`}>
                    <span className="font-semibold">{p.label}</span>
                    <span className="text-primary font-bold">US${p.price}</span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-primary mb-2">3. Choose your time</h2>
              <p className="font-body text-sm text-background/70 mb-4">{TRINIDAD_BOOK_SLOTS_SENTENCE}</p>
              {availError && <p className="font-body text-sm text-destructive mb-3">Live times could not load. Please refresh the page.</p>}
              {days.map((d) => (
                <div key={d} className="mb-5">
                  <p className="font-body text-sm font-semibold mb-2">{DAY_LABEL[d]}</p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {C.slot_times.map((t) => {
                      const left = avail?.[d]?.find((s) => s.time === t)?.spots_left;
                      const full = left === 0;
                      const sel = slots[d] === t;
                      return (
                        <button type="button" key={t} disabled={full || left === undefined} aria-pressed={sel}
                          onClick={() => setSlots((s) => ({ ...s, [d]: t }))}
                          className={`rounded-xl border px-2 py-3 font-body text-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${sel ? "bg-primary text-primary-foreground border-primary" : "border-primary/30 hover:border-primary"}`}>
                          <span className="block font-semibold">{t}</span>
                          <span className="block text-xs mt-0.5">{left === undefined ? "Loading" : full ? "Full" : `${left} left`}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>

            <section className="rounded-2xl border border-primary/30 p-5">
              <h2 className="font-display text-lg font-bold text-primary mb-3">Included with every booking</h2>
              <ul className="grid sm:grid-cols-2 gap-2 font-body text-sm">
                {C.inclusions.map((i) => (
                  <li key={i} className="flex items-center gap-2"><Check className="w-4 h-4 text-primary shrink-0" aria-hidden />{i}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-primary mb-4">4. Your details</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="font-body text-sm">First name<input className={`${input} mt-1`} required maxLength={80} autoComplete="given-name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} /></label>
                <label className="font-body text-sm">Last name<input className={`${input} mt-1`} required maxLength={80} autoComplete="family-name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} /></label>
                <label className="font-body text-sm">Email<input type="email" className={`${input} mt-1`} required maxLength={254} autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
                <label className="font-body text-sm">Cell, with country code<input type="tel" className={`${input} mt-1`} required maxLength={25} autoComplete="tel" placeholder="+1 868 555 0100" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
              </div>
              <label className="flex items-start gap-3 mt-5 font-body text-sm">
                <input type="checkbox" className="mt-1 accent-primary" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
                <span>I agree to the <Link to="/policies" target="_blank" className="text-primary underline">Terms and refund policy</Link>.</span>
              </label>
            </section>

            {error && <p role="alert" className="font-body text-sm text-destructive">{error}</p>}
            <div>
              <button type="submit" disabled={!ready || busy}
                className="w-full bg-primary text-primary-foreground font-body font-bold tracking-wide text-base px-8 py-4 rounded-full disabled:opacity-50 hover:shadow-lg hover:shadow-primary/30 transition-all">
                {busy ? "Opening secure checkout" : `Pay US$${product?.price ?? ""} securely`}
              </button>
              <p className="font-body text-xs text-background/60 mt-3 text-center">{TRINIDAD_BOOK_PAYMENT_SENTENCE}</p>
            </div>
          </form>
        )}

        <section className="container mx-auto px-4 sm:px-6 max-w-2xl pb-16">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-primary mb-4">Questions</h2>
          <div className="space-y-4">
            {TRINIDAD_BOOK_FAQ.map((f) => (
              <details key={f.q} className="rounded-xl border border-primary/20 p-4">
                <summary className="font-body font-semibold cursor-pointer">{f.q}</summary>
                <p className="font-body text-sm text-background/80 mt-2">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default TrinidadBook;
