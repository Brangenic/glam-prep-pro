import { trackBookingCtaClick } from "@/lib/tracking";
import {
  JAMAICA_DATE_TEXT,
  JAMAICA_EVENT_NAME,
  JAMAICA_PHOTOS,
  JAMAICA_SECTIONS,
  JAMAICA_VENUE,
  jamaicaBookingHref,
} from "@/data/jamaicaPage";

/**
 * Jamaica Carnival 2027 answer-first block. Every heading is a question
 * and the first sentence under it answers it, so a visitor and an AI
 * assistant can quote it. Content comes from src/data/jamaicaPage.ts, the
 * same source as the prerendered body.
 */
const JamaicaGuide = () => {
  const href = jamaicaBookingHref("jamaica_page");
  const BookButton = ({ className = "" }: { className?: string }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-mcp-action="register-event"
      data-mcp-description={`Book ${JAMAICA_EVENT_NAME} glam on the booking platform.`}
      onClick={() => trackBookingCtaClick()}
      className={`inline-flex min-h-[52px] items-center justify-center bg-primary text-primary-foreground font-body font-semibold text-base px-8 py-3.5 rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all ${className}`}
    >
      Book {JAMAICA_EVENT_NAME}
    </a>
  );

  return (
    <section aria-label={`${JAMAICA_EVENT_NAME} guide`} className="border-t border-border bg-primary/5">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl py-10 sm:py-14">
        <p className="font-body text-xs uppercase tracking-[0.25em] text-secondary font-medium mb-3">
          {JAMAICA_DATE_TEXT} · {JAMAICA_VENUE}
        </p>
        <BookButton className="w-full sm:w-auto mb-10" />
        {JAMAICA_SECTIONS.map((s, i) => (
          <div key={s.q} className="mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight mb-3">{s.q}</h2>
            <p className="font-body text-base text-muted-foreground leading-relaxed">{s.a}</p>
            {s.bullets && s.bullets.length > 0 && (
              <ul className="mt-4 space-y-2">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 font-body text-sm sm:text-base">
                    <span className="mt-2 inline-block h-2 w-2 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {/* Owner supplied Glam Hub Jamaica photos, after the first section */}
            {i === 0 &&
              JAMAICA_PHOTOS.map((p) => (
                <figure key={p.src} className="mt-8">
                  <img
                    src={p.src}
                    srcSet={p.srcSet}
                    sizes="(min-width: 768px) 672px, 100vw"
                    alt={p.alt}
                    width={p.width}
                    height={p.height}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto rounded-2xl object-cover"
                  />
                </figure>
              ))}
          </div>
        ))}
        <BookButton className="w-full sm:w-auto" />
      </div>
    </section>
  );
};

export default JamaicaGuide;
