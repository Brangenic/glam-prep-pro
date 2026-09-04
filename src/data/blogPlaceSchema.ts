// Per-post Place structured data for blog articles that are firmly about a
// real location. Shared by the runtime renderer (src/pages/BlogPost.tsx) and
// the build-time prerender (scripts/prerender-blog-meta.ts) so both surfaces
// emit the same JSON-LD. Node-safe: no imports, no assets.

export const BLOG_PLACE_SCHEMA: Record<string, unknown> = {
  "grenada-jab-jab-spicemas-jouvert-experience": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Place",
        "@id": "https://www.carnivalglamhub.com/grenada#grenada",
        name: "Grenada",
        description:
          "The Caribbean island where Spicemas, and its Jab Jab oil mas, runs every August.",
        address: { "@type": "PostalAddress", addressCountry: "GD" },
      },
      {
        "@type": "Place",
        "@id": "https://www.carnivalglamhub.com/grenada#st-georges",
        name: "St George's, Grenada",
        description:
          "The capital of Grenada, where the Spicemas Jab Jab bands gather before dawn on Carnival Monday.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "St George's",
          addressCountry: "GD",
        },
        containedInPlace: {
          "@id": "https://www.carnivalglamhub.com/grenada#grenada",
        },
      },
      {
        "@type": "Place",
        "@id": "https://www.carnivalglamhub.com/grenada#carenage",
        name: "The Carenage, St George's",
        description:
          "The harbour front in St George's where a conch shell starts Jab Jab around four in the morning.",
        containedInPlace: {
          "@id": "https://www.carnivalglamhub.com/grenada#st-georges",
        },
      },
      {
        "@type": "Place",
        "@id": "https://www.carnivalglamhub.com/grenada#grand-anse",
        name: "Grand Anse, Grenada",
        description:
          "The beach strip where most Spicemas visitors stay, and where the Carnival Glam Hub sits at the Radisson Hotel.",
        containedInPlace: {
          "@id": "https://www.carnivalglamhub.com/grenada#grenada",
        },
      },
    ],
  },

};

export function getBlogPlaceSchema(slug: string | null | undefined) {
  if (!slug) return null;
  return BLOG_PLACE_SCHEMA[slug] ?? null;
}
