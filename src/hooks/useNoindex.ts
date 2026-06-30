import { useEffect } from "react";

/**
 * Inject `<meta name="robots" content="noindex, follow">` into the
 * document head while the calling component is mounted, and remove it
 * on unmount. Use on private/utility pages (auth, admin, post-booking
 * thank-you, soft 404s) that must not be indexed by search engines.
 */
export function useNoindex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "robots");
    meta.setAttribute("content", "noindex, follow");
    document.head.appendChild(meta);
    return () => {
      meta.remove();
    };
  }, []);
}