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

const PreferredSourcesButton = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const node = containerRef.current;
      // If Google's script never arrived, or left the container empty,
      // fall back to the documented deeplink.
      if (!node || node.childElementCount === 0) setShowFallback(true);
    }, FALLBACK_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-full">
      <p className="font-body text-xs text-muted-foreground leading-relaxed mb-2">
        Prefer our Carnival coverage? Set Carnival Glam Hub as a preferred source on Google.
      </p>
      <div
        ref={containerRef}
        google-add-preferred-source-btn=""
        data-theme="light"
        data-lang="en"
        className="max-w-full overflow-hidden"
      />
      {showFallback ? (
        <a
          href={DEEPLINK}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-xs text-muted-foreground hover:text-primary transition-colors underline break-words"
        >
          Add Carnival Glam Hub as a preferred source on Google
        </a>
      ) : (
        <noscript>
          <a
            href={DEEPLINK}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs text-muted-foreground hover:text-primary transition-colors underline break-words"
          >
            Add Carnival Glam Hub as a preferred source on Google
          </a>
        </noscript>
      )}
    </div>
  );
};

export default PreferredSourcesButton;
