import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  AI_APP_DESCRIPTION,
  AI_APP_H1,
  AI_APP_SECTIONS,
  AI_APP_TITLE,
  AI_APP_URL,
} from "@/data/aiBookingAppPage";

function useMeta() {
  useEffect(() => {
    const prev = document.title;
    document.title = AI_APP_TITLE;
    const d = document.querySelector('meta[name="description"]');
    const prevD = d?.getAttribute("content");
    d?.setAttribute("content", AI_APP_DESCRIPTION);
    let c = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const prevC = c?.href;
    if (!c) { c = document.createElement("link"); c.rel = "canonical"; document.head.appendChild(c); }
    c.href = AI_APP_URL;
    return () => {
      document.title = prev;
      if (prevD != null) d?.setAttribute("content", prevD);
      if (prevC && c) c.href = prevC;
    };
  }, []);
}

const AiBookingApp = () => {
  useMeta();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20 px-5">
        <article className="max-w-3xl mx-auto">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">AI booking app</p>
          <h1 className="font-display text-3xl md:text-5xl text-foreground leading-tight mb-10">{AI_APP_H1}</h1>
          {AI_APP_SECTIONS.map((s) => (
            <section key={s.heading} className="mb-10 border-t border-border pt-8">
              <h2 className="font-display text-2xl text-foreground mb-4">{s.heading}</h2>
              {s.paras.map((p) => (
                <p key={p} className="font-body text-muted-foreground leading-relaxed mb-3 break-words">{p}</p>
              ))}
              {s.items && (
                <ul className="list-disc pl-5 space-y-2 font-body text-muted-foreground mb-3">
                  {s.items.map((i) => <li key={i} className="break-words">{i}</li>)}
                </ul>
              )}
              {s.links && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {s.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="inline-block border-2 border-primary text-foreground font-body font-bold tracking-wider text-sm px-6 py-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </section>
          ))}
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default AiBookingApp;
