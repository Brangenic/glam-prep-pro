// Per-post Place structured data for blog articles that are firmly about a
// real location. Shared by the runtime renderer (src/pages/BlogPost.tsx) and
// the build-time prerender (scripts/prerender-blog-meta.ts) so both surfaces
// emit the same JSON-LD. Node-safe: no imports, no assets.

export const BLOG_PLACE_SCHEMA: Record<string, unknown> = {
  "grenada-jab-jab-spicemas-jouvert-experience": {
    "@context": "https://schema.org",
    "@type": "Place",
    name: "St George's, Grenada",
    description:
      "The Carenage in St George's, Grenada, where Spicemas Jab Jab begins before dawn on Carnival Monday.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "St George's",
      addressCountry: "GD",
    },
    containedInPlace: {
      "@type": "Country",
      name: "Grenada",
    },
  },
};

export function getBlogPlaceSchema(slug: string | null | undefined) {
  if (!slug) return null;
  return BLOG_PLACE_SCHEMA[slug] ?? null;
}
