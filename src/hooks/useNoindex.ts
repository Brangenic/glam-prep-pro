import { useEffect } from "react";

/**
 * Inject `<meta name="robots" content="noindex, follow">` into the
 * document head while the calling component is mounted, and remove it
 * on unmount. Use on private/utility pages (auth, admin, post-booking
 * thank-you, soft 404s) that must not be indexed by search engines.
 * Pass a different content value (for example "noindex, nofollow" for
 * the AI-discovery-only pages) where the page needs it.
 */
export function useNoindex(content: string = "noindex, follow") {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "robots");
    meta.setAttribute("content", content);
    document.head.appendChild(meta);
    return () => {
      meta.remove();
    };
  }, [content]);
}
