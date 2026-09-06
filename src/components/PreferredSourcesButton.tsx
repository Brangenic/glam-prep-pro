import { useEffect, useRef, useState } from "react";

const DEEPLINK = "https://www.google.com/preferences/source?q=carnivalglamhub.com";
const FALLBACK_DELAY_MS = 2000;

// Google's publisher.js upgrades this container into its own button. The
// attribute is not part of React's HTML typings, so declare it properly
// rather than casting to any.
declare module "react" {
  interface HTMLAttributes<T> {
    "google-add-preferred-source-btn"?: string | boolean;
  }
}

const PreferredSourcesButton = ({ compact = false }: { compact?: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // The anchor is the working path today, so it renders by default and only
  // hides once Google's library has actually populated the container.
  const [buttonRendered, setButtonRendered] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const node = containerRef.current;
      setButtonRendered(!!node && node.childElementCount > 0);
    }, FALLBACK_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={compact ? "inline-flex items-center gap-2 max-w-full" : "max-w-full"}>
      {!compact && (
        <p className="font-body text-sm text-muted-foreground leading-relaxed mb-2">
          Prefer our Carnival coverage? Set Carnival Glam Hub as a preferred source on Google.
        </p>
      )}
      {/*
        Google's publisher.js fills this container with its own Preferred
        Sources button, but only once Google marks the domain eligible.
        Until then it stays empty by design and the anchor below is what
        visitors use. Do not delete this container: when eligibility lands,
        the real button appears here automatically and the anchor hides.
      */}
      <div
        ref={containerRef}
        google-add-preferred-source-btn=""
        data-theme="light"
        data-lang="en"
        className="max-w-full overflow-hidden"
      />
      {!buttonRendered && (
        <a
          href={DEEPLINK}
          target="_blank"
          rel="noopener noreferrer"
          className={
            compact
              ? "font-body text-sm text-muted-foreground hover:text-primary transition-colors py-2"
              : "block font-body text-sm text-muted-foreground hover:text-primary transition-colors break-words"
          }
        >
          {compact
            ? "Preferred Source on Google"
            : "Add Carnival Glam Hub as a preferred source on Google"}
        </a>
      )}
    </div>
  );
};


export default PreferredSourcesButton;
