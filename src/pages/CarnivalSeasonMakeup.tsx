import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { hasSeasonPassed } from "@/data/seasons";
import { seasonPageJsonLd, type SeasonMakeupPage } from "@/data/carnivalMakeupPages";
import { SITE_URL } from "@/lib/constants";
import TrinidadDirectPackages from "@/components/TrinidadDirectPackages";

export default function CarnivalSeasonMakeup({ page: p }: { page: SeasonMakeupPage }) {
  const closed = hasSeasonPassed(p.slug);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = p.title;
    const restorers: (() => void)[] = [];
    const set = (selector: string, attrs: Record<string, string>) => {
      let tag = document.head.querySelector(selector);
      const old = tag?.outerHTML;
      if (!tag) { tag = document.createElement(selector.startsWith("link") ? "link" : "meta"); document.head.appendChild(tag); }
      for (const [k, v] of Object.entries(attrs)) tag.setAttribute(k, v);
      const changed = tag;
      restorers.push(() => { if (old) changed.outerHTML = old; else changed.remove(); });
    };
    const url = SITE_URL + p.path;
    set('link[rel="canonical"]', { rel: "canonical", href: url });
    set('meta[name="description"]', { name: "description", content: p.description });
    set('meta[name="robots"]', { name: "robots", content: "index, follow" });
    for (const [key, value] of Object.entries({ title: p.title, description: p.description, url, type: "website", image: p.ogImage, "image:width": "1200", "image:height": "630", "image:alt": p.imageAlt })) set(`meta[property="og:${key}"]`, { property: `og:${key}`, content: value });
    for (const [key, value] of Object.entries({ title: p.title, description: p.description, url, image: p.ogImage, card: "summary_large_image" })) set(`meta[name="twitter:${key}"]`, { name: `twitter:${key}`, content: value });
    // Replace route blocks, but leave the site-wide Organization intact.
    const prerender = [...document.head.querySelectorAll('script[type="application/ld+json"][data-prerender]')];
    prerender.forEach((s) => s.remove());
    const scripts = seasonPageJsonLd(p).map((block) => { const s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(block); document.head.appendChild(s); return s; });
    return () => { document.title = previousTitle; restorers.reverse().forEach((r) => r()); scripts.forEach((s) => s.remove()); prerender.forEach((s) => document.head.appendChild(s)); };
  }, [p]);
  const track = () => window.gtag?.("event", "booking_click", { event_category: "booking", event_label: p.slug, destination: p.slug });
  return <div className="min-h-screen bg-background text-foreground font-body">
    <Navbar />
    <main className="pt-24 sm:pt-28 pb-16">
      <article className="mx-auto max-w-4xl px-4 sm:px-6">
        <header className="max-w-3xl" aria-label="Carnival booking facts">
          <h1 className="font-display text-2xl sm:text-4xl font-bold leading-tight mb-3">{p.h1}</h1>
          <p className="text-sm sm:text-lg leading-relaxed mb-3">{p.intro}</p>
          <h2 className="font-display text-lg sm:text-2xl font-bold mb-2">What every booking includes</h2>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-1 list-disc pl-5 text-xs sm:text-base mb-3">{p.inclusions.map((i) => <li key={i}>{i}</li>)}</ul>
          {closed ? <p>Bookings for this season are closed.</p> : <>
            <Button asChild size="lg" className="w-full sm:w-auto whitespace-normal text-center h-auto min-h-11 py-3"><a href={p.bookingUrl} onClick={track} {...(p.slug === "trinidad" ? {} : { target: "_blank", rel: "noopener noreferrer" })}>{p.bookingLabel}</a></Button>
            <p className="mt-3 text-sm"><a href={p.eventUrl} target="_blank" rel="noopener noreferrer" onClick={track} className="text-primary underline">{p.bookingLabel} on our booking platform</a></p>
          </>}
        </header>
        {!closed && p.slug === "trinidad" && <TrinidadDirectPackages />}
        <figure className="mt-8 mb-12"><img src={p.image} alt={p.imageAlt} loading="lazy" className="w-full max-h-96 object-cover object-top" width="1280" height="720" /></figure>
        {p.timeline.length > 0 && <section className="border-t border-border py-8"><h2 className="font-display text-2xl font-bold mb-6">How the morning works</h2><div className="grid sm:grid-cols-2 gap-6">{p.timeline.map((s) => <div key={s.q}><h3 className="font-display text-xl font-semibold mb-2">{s.q}</h3><p className="text-sm text-muted-foreground leading-relaxed">{s.a}</p></div>)}</div></section>}
        {p.proof.length > 0 && <section className="border-t border-border py-8"><h2 className="font-display text-2xl font-bold mb-6">Past seasons and independent reviews</h2>{p.proof.map((r) => <p key={r.text} className="text-sm leading-relaxed mb-5">{r.text}{r.url && <> <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{r.label ?? r.text}</a></>}</p>)}</section>}
        <section className="border-t border-border py-8"><h2 className="font-display text-2xl font-bold mb-6">Booking questions</h2><div className="space-y-6">{p.faq.map((f) => <div key={f.q}><h3 className="font-display text-xl font-semibold mb-2">{f.q}</h3><p className="text-sm leading-relaxed text-muted-foreground">{f.a}</p></div>)}</div></section>
        <nav className="border-t border-border pt-6 flex flex-wrap gap-6 text-sm" aria-label="Related pages"><Link to={`/${p.slug}`} className="text-primary underline">Explore the {p.slug} hub</Link><Link to="/policies" className="text-primary underline">Terms and policies</Link></nav>
      </article>
    </main><Footer />
  </div>;
}