import { useState } from "react";

export const PRESS_OUTLETS = [
  { name: "Teen Vogue", url: "https://www.teenvogue.com", domain: "teenvogue.com" },
  { name: "Jamaica Observer", url: "https://jamaicaobserver.com", domain: "jamaicaobserver.com" },
  { name: "Jamaica Gleaner", url: "https://jamaica-gleaner.com", domain: "jamaica-gleaner.com" },
  { name: "Haute People", url: "https://hautepeople.com", domain: "hautepeople.com" },
  { name: "Our Today", url: "https://our.today", domain: "our.today" },
  { name: "CaribVoxx", url: "https://caribvoxx.com", domain: "caribvoxx.com" },
] as const;

const PublicationLink = ({
  name,
  url,
  domain,
  compact = false,
}: {
  name: string;
  url: string;
  domain: string;
  compact?: boolean;
}) => {
  const [showFallback, setShowFallback] = useState(false);
  const logoSrc = `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Read coverage on ${name}`}
      className="group flex items-center justify-center gap-2 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 ease-out"
    >
      {!showFallback ? (
        <>
          <img
            src={logoSrc}
            alt={`${name} logo`}
            loading="lazy"
            onError={() => setShowFallback(true)}
            className={compact ? "h-5 w-5 object-contain" : "h-6 w-6 sm:h-7 sm:w-7 object-contain"}
          />
          <span
            className={`font-display tracking-wide text-foreground/80 group-hover:text-primary transition-colors ${
              compact ? "text-sm" : "text-base sm:text-lg"
            }`}
          >
            {name}
          </span>
        </>
      ) : (
        <span
          className={`font-display tracking-wide text-foreground/80 group-hover:text-primary transition-colors ${
            compact ? "text-sm" : "text-base sm:text-lg"
          }`}
        >
          {name}
        </span>
      )}
    </a>
  );
};

interface PressBarProps {
  /** Hide the heading and tighten spacing (used on inner pages). */
  compact?: boolean;
}

const PressBar = ({ compact = false }: PressBarProps) => (
  <section
    aria-label="Featured in"
    className={`border-y border-primary/10 bg-primary/[0.02] ${compact ? "py-6 sm:py-8" : "py-12 sm:py-16"}`}
  >
    <div className="container mx-auto px-4 sm:px-6">
      {!compact && (
        <div className="text-center mb-8 sm:mb-10">
          <p className="font-body text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-primary/70 font-semibold mb-2">
            As Featured In
          </p>
          <p className="font-display italic text-lg sm:text-xl text-foreground/70">
            Trusted by the Caribbean&rsquo;s leading press &amp; culture publications
          </p>
        </div>
      )}
      {compact && (
        <p className="text-center font-body text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-primary/70 font-semibold mb-4">
          As Featured In
        </p>
      )}
      <div
        className={`flex flex-wrap items-center justify-center ${
          compact ? "gap-x-8 gap-y-4" : "gap-x-10 sm:gap-x-14 gap-y-6"
        }`}
      >
        {PRESS_OUTLETS.map((o) => (
          <PublicationLink key={o.name} {...o} compact={compact} />
        ))}
      </div>
    </div>
  </section>
);

export default PressBar;
