// Single source of truth for press coverage and outlet mentions.
// Used by /press (src/pages/Press.tsx) and the homepage press strip
// (src/components/landing/PressBar.tsx).

export type PressStory = {
  id: string;
  outlet: string;
  outletDomain: string;
  headline: string;
  url: string;
  /** ISO date, YYYY-MM-DD. */
  publishedDate: string;
  excerpt: string;
  note?: string;
};

/** Verified press articles, newest first. */
export const PRESS_STORIES: PressStory[] = [
  {
    id: "our-today-five-carnivals",
    outlet: "Our Today",
    outletDomain: "our.today",
    headline: "Five Carnivals. Three Weekends. One Standard.",
    url: "https://our.today/five-carnivals-three-weekends-one-standard/",
    publishedDate: "2026-08-12",
    excerpt:
      "Carnival Glam Hub delivered makeup, hair, photoshoots and morning services across Saint Lucia, Antigua, Barbados, Toronto and Grenada over three consecutive weekends, serving more than 300 masqueraders and creating paid work for over 60 women.",
  },
  {
    id: "observer-trinidad-centrestage",
    outlet: "Jamaica Observer",
    outletDomain: "jamaicaobserver.com",
    headline: "Carnival Glam Hub takes centrestage on Trinidad's beauty scene",
    url: "https://www.jamaicaobserver.com/2020/03/02/carnival-glam-hub-takes-centrestage-on-trinidads-beauty-scene/",
    publishedDate: "2020-03-02",
    excerpt:
      "Tenille Clarke on how Carnival Glam Hub arrived in Trinidad with a one-stop Carnival morning service, and the response it drew in its first season.",
  },
  {
    id: "gleaner-glamtrepreneur",
    outlet: "Jamaica Gleaner",
    outletDomain: "jamaica-gleaner.com",
    headline: "Gabrielle Waite: a young glamtrepreneur's story",
    url: "https://jamaica-gleaner.com/article/flair/20190902/gabrielle-waite-young-glamtrepreneurs-story",
    publishedDate: "2019-09-02",
    excerpt:
      "Flair profiles co-founder Gabrielle Waite on building a Caribbean beauty business from the chair up.",
    note: "Founder profile",
  },
];

export type PressOutlet = {
  name: string;
  url: string;
  domain: string;
};

/**
 * Outlet-level mentions shown in the press strip. Teen Vogue, Haute People
 * and CaribVoxx stay here as mentions until we have article URLs for them.
 */
export const PRESS_OUTLETS: readonly PressOutlet[] = [
  { name: "Teen Vogue", url: "https://www.teenvogue.com", domain: "teenvogue.com" },
  { name: "Jamaica Observer", url: "https://jamaicaobserver.com", domain: "jamaicaobserver.com" },
  { name: "Jamaica Gleaner", url: "https://jamaica-gleaner.com", domain: "jamaica-gleaner.com" },
  { name: "Haute People", url: "https://hautepeople.com", domain: "hautepeople.com" },
  { name: "Our Today", url: "https://our.today", domain: "our.today" },
  { name: "CaribVoxx", url: "https://caribvoxx.com", domain: "caribvoxx.com" },
] as const;
