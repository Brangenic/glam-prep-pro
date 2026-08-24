import { useEffect, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  TERMS_BLOCKS,
  PRIVACY_BLOCKS,
  PRIVACY_TAILS,
  TERMS_INTRO,
  PRIVACY_INTRO,
  STATION_CLAUSE_TEXT,
  CONTENTS,
  anchorFor,
  EFFECTIVE_DATE,
  CONTACT_EMAIL,
  type Block,
} from "@/data/policies";


const PAGE_TITLE = "Terms, Refund Policy and Privacy Policy | Carnival Glam Hub";
const PAGE_DESCRIPTION =
  "Carnival Glam Hub booking terms, deposit and refund policy, cancellation and transfer rules, referral programme terms and privacy policy. Effective 24 August 2026.";
const CANONICAL = "https://www.carnivalglamhub.com/policies";

const REFUND_IMAGE = "/images/policies/refund-policy.webp";
const REFUND_ALT =
  "Illustration of two Glam Hub team members reviewing a refund request form";
const PRIVACY_IMAGE = "/images/policies/privacy-policy.webp";
const PRIVACY_ALT =
  "Illustration of two Glam Hub team members securing a customer data record";

const ClauseBlock = ({ block }: { block: Block }) => (
  <div id={block.id ?? anchorFor(block.heading)} className="scroll-mt-28 mb-10">
    <h3 className="font-display text-xl sm:text-2xl font-bold mb-4 leading-snug">
      {block.heading}
    </h3>
    {block.paragraphs?.map((p) => (
      <p key={p} className="font-body text-base text-muted-foreground leading-[1.8] mb-3">
        {p}
      </p>
    ))}
    {block.clauses && (
      <ol className="space-y-3">
        {block.clauses.map((c) => (
          <li key={c.n} className="flex gap-3 font-body text-base leading-[1.8]">
            <span className="shrink-0 font-semibold text-primary tabular-nums">{c.n}</span>
            <span className="text-muted-foreground">
              {c.body === "__STATION__" ? (
                <>
                  <a
                    href="/station-rentals"
                    className="text-primary underline underline-offset-4 hover:text-secondary transition-colors"
                  >
                    Station rental
                  </a>
                  s for independent service providers are a separate commercial
                  arrangement and are governed by the station rental terms issued
                  with the rental confirmation, not by this booking policy.
                </>
              ) : (
                c.body
              )}
            </span>
          </li>
        ))}
      </ol>
    )}
    {block.bullets && (
      <ul className="mt-3 space-y-2 pl-5 list-disc marker:text-primary">
        {block.bullets.map((b) => (
          <li key={b} className="font-body text-base text-muted-foreground leading-[1.8]">
            {b}
          </li>
        ))}
      </ul>
    )}
    {PRIVACY_TAILS[block.heading] && (
      <p className="font-body text-base text-muted-foreground leading-[1.8] mt-3">
        {PRIVACY_TAILS[block.heading]}
      </p>
    )}
  </div>
);

const Policies = () => {
  const [navOpen, setNavOpen] = useState(false);

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
      restorers.forEach((restore) => restore());
      if (previousCanonical) canonical?.setAttribute("href", previousCanonical);
    };
  }, []);

  return (
    <div className="min-h-dvh bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        {/* Page header */}
        <header className="container mx-auto px-4 sm:px-6 max-w-4xl text-center mb-12">
          <span className="font-body text-[11px] uppercase tracking-[0.3em] text-primary font-semibold">
            Carnival Glam Hub
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-4 leading-tight">
            Terms and <span className="italic text-gradient-primary">Policies</span>
          </h1>
          <p className="font-body text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our booking terms, refund and cancellation policy, and privacy policy.
          </p>
          <p className="font-body text-sm text-muted-foreground/80 mt-3">{EFFECTIVE_DATE}</p>
        </header>

        <div className="container mx-auto px-4 sm:px-6 max-w-6xl lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
          {/* Contents nav */}
          <nav aria-label="Contents" className="mb-10 lg:mb-0">
            <div className="lg:sticky lg:top-28 rounded-2xl border border-border bg-card/60 p-5">
              <button
                type="button"
                onClick={() => setNavOpen((o) => !o)}
                aria-expanded={navOpen}
                aria-controls="policies-contents"
                className="lg:hidden w-full flex items-center justify-between font-body text-xs uppercase tracking-[0.2em] font-semibold text-foreground/70"
              >
                Contents
                <span aria-hidden="true">{navOpen ? "−" : "+"}</span>
              </button>
              <p className="hidden lg:block font-body text-xs uppercase tracking-[0.2em] font-semibold text-foreground/60 mb-4">
                Contents
              </p>
              <ul
                id="policies-contents"
                className={`${navOpen ? "block" : "hidden"} lg:block mt-4 lg:mt-0 space-y-2.5`}
              >
                {CONTENTS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setNavOpen(false)}
                      className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Body */}
          <div className="max-w-[70ch]">
            {/* Section A: Terms */}
            <section id="terms" className="scroll-mt-28 mb-16">
              <div className="rounded-2xl bg-secondary/5 border border-border p-6 sm:p-8 mb-8 sm:flex sm:items-center sm:gap-8">
                <img
                  src={REFUND_IMAGE}
                  alt={REFUND_ALT}
                  width={842}
                  height={1110}
                  loading="lazy"
                  decoding="async"
                  className="w-full max-w-[280px] sm:max-w-[320px] h-auto mx-auto sm:mx-0 mb-6 sm:mb-0 rounded-xl"
                />
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4 leading-tight">
                    Terms of Service and Booking Policy
                  </h2>
                  {TERMS_INTRO.map((p) => (
                    <p key={p} className="font-body text-base text-muted-foreground leading-[1.8] mb-3">
                      {p}
                    </p>
                  ))}

                </div>
              </div>

              {TERMS_BLOCKS.map((block) => (
                <ClauseBlock key={block.heading} block={block} />
              ))}
            </section>

            {/* Section C: Privacy */}
            <section id="privacy" className="scroll-mt-28">
              <div className="rounded-2xl bg-primary/5 border border-border p-6 sm:p-8 mb-8 sm:flex sm:items-center sm:gap-8">
                <img
                  src={PRIVACY_IMAGE}
                  alt={PRIVACY_ALT}
                  width={828}
                  height={1104}
                  loading="lazy"
                  decoding="async"
                  className="w-full max-w-[280px] sm:max-w-[320px] h-auto mx-auto sm:mx-0 mb-6 sm:mb-0 rounded-xl"
                />
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2 leading-tight">
                    Privacy Policy
                  </h2>
                  <p className="font-body text-sm text-muted-foreground/80 mb-4">
                    {EFFECTIVE_DATE}
                  </p>
                  {PRIVACY_INTRO.map((p) => (
                    <p key={p} className="font-body text-base text-muted-foreground leading-[1.8] mb-3">
                      {p}
                    </p>
                  ))}

                </div>
              </div>

              {PRIVACY_BLOCKS.map((block) => (
                <ClauseBlock key={block.heading} block={block} />
              ))}
            </section>

            {/* Closing contact block */}
            <section
              id="contact-policies"
              className="scroll-mt-28 mt-4 rounded-2xl border border-border bg-card/60 p-6 sm:p-8 text-center"
            >
              <h2 className="font-display text-xl sm:text-2xl font-bold mb-3">
                Still have a question?
              </h2>
              <p className="font-body text-base text-muted-foreground leading-relaxed mb-4">
                Write to us about a booking, these Terms or your privacy and we
                will come back to you.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-block bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3.5 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                {CONTACT_EMAIL}
              </a>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Policies;
