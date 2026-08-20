// Single source of truth for press coverage.
// Used by /press (src/pages/Press.tsx), the homepage press strip
// (src/components/landing/PressBar.tsx) and the llms.txt press block.

export type PressTier = "hero" | "feature" | "caribbean" | "mention";

export type PressStory = {
  id: string;
  outlet: string;
  outletDomain: string;
  headline: string;
  url: string;
  /** ISO date, YYYY-MM-DD. */
  publishedDate: string;
  author?: string;
  summary: string;
  pullQuote?: string;
  pullQuoteAttribution?: string;
  /** Absolute URL to publisher-hosted imagery. Never copied into the repo. */
  image?: string;
  note?: string;
  tier: PressTier;
};

/** Verified coverage only. Nothing here is invented. */
export const PRESS_STORIES: PressStory[] = [
  {
    id: "teen-vogue-spicemas-2024",
    outlet: "Teen Vogue",
    outletDomain: "teenvogue.com",
    headline:
      "Inside the Carnival Glam Machine at Grenada's Spicemas 2024: What It Takes to Play Pretty Mas",
    url: "https://www.teenvogue.com/story/grenada-spicemas-2024-pretty-mas-glam-machine",
    publishedDate: "2024-10-08",
    summary:
      "Teen Vogue goes inside the Carnival beauty ecosystem at Grenada's Spicemas, and names Carnival Glam Hub among the international teams servicing multiple Carnivals across the region.",
    tier: "hero",
  },
  {
    id: "thegrio-jamaica-carnival-2024",
    outlet: "theGrio",
    outletDomain: "thegrio.com",
    headline: "Heading to Jamaica Carnival 2024? Here's your go-to guide",
    url: "https://thegrio.com/2024/03/29/heading-to-jamaica-carnival-2024-heres-your-go-to-guide/",
    publishedDate: "2024-03-29",
    author: "Noel Cymone Walker",
    pullQuote:
      "Swing by early Sunday morning to experience Carnival Glam Hub with a reservation and indulge in hairstyling, sweat-proof makeup application, breakfast, drinks, professional photography, assistance with your carnival costume, and shuttle service, all under one roof.",
    pullQuoteAttribution: "theGrio, March 2024",
    summary:
      "theGrio's Jamaica Carnival guide sends readers to Carnival Glam Hub for Carnival Sunday, listing hair, sweat-proof makeup, breakfast, drinks, photography, costume assistance and shuttle under one roof.",
    tier: "feature",
  },
  {
    id: "caribvoxx-nine-years",
    outlet: "CaribVoxx",
    outletDomain: "caribvoxx.com",
    headline: "Nine Years Later, Carnival Glam Hub Is Still Setting the Standard",
    url: "https://caribvoxx.com/nine-years-later-carnival-glam-hub-is-still-setting-the-standard/",
    publishedDate: "2026-04-04",
    author: "Lushane Salmon",
    image:
      "https://caribvoxx.com/wp-content/uploads/2026/04/Nine-Years-Later-Carnival-Glam-Hub-Is-Still-Setting-the-Standard-Carib-Voxx.jpg",
    pullQuote:
      "Glam Hub was never just about makeup. It started with vision, and that vision was rooted in faith.",
    pullQuoteAttribution: "Gabrielle Waite, speaking to CaribVoxx",
    summary:
      "A ninth-year retrospective tracing Carnival Glam Hub from Gabrielle Waite, her mother and seventeen masqueraders to a regional Carnival-day platform serving more than 15,000 clients and employing hundreds of Caribbean beauty professionals.",
    tier: "feature",
  },
  {
    id: "our-today-five-carnivals",
    outlet: "Our Today",
    outletDomain: "our.today",
    headline: "Five Carnivals. Three Weekends. One Standard.",
    url: "https://our.today/five-carnivals-three-weekends-one-standard/",
    publishedDate: "2026-08-12",
    summary:
      "Glam Hub covered Saint Lucia, Antigua, Barbados, Toronto and Grenada across three consecutive weekends, serving more than 300 masqueraders and creating paid work for over 60 women.",
    tier: "caribbean",
  },
  {
    id: "observer-carnival-glam-2025",
    outlet: "Jamaica Observer",
    outletDomain: "jamaicaobserver.com",
    headline: "Carnival GLAM",
    url: "https://www.jamaicaobserver.com/2025/04/22/carnival-glam-20250422-0333-122380/",
    publishedDate: "2025-04-22",
    image:
      "https://www.jamaicaobserver.com/jamaicaobserver/news/wp-content/uploads/sites/4/2025/04/d59a42fe114fda5e9fce208844ea2653.jpg",
    summary:
      "Tuesday Style Dryer features a sunset-eye road look executed at Carnival Glam Hub in Trinidad, ahead of the artist's return to Carnival Glam Hub at the Jamaica Pegasus.",
    tier: "caribbean",
  },
  {
    id: "observer-art-deco-waves-2024",
    outlet: "Jamaica Observer",
    outletDomain: "jamaicaobserver.com",
    headline: "Art Deco Waves",
    url: "https://www.jamaicaobserver.com/2024/04/09/art-deco-waves/",
    publishedDate: "2024-04-09",
    image:
      "https://www.jamaicaobserver.com/jamaicaobserver/news/wp-content/uploads/sites/4/2024/04/jo-2024-04-08T232024.009.jpg",
    pullQuote:
      "For Carnival 2024, Miss Universe Jamaica 2023 Dr Jordanne Levy, like hundreds of other revellers, bet on the team at the Carnival GLAM Hub, Jamaica Pegasus, for hair and make-up.",
    pullQuoteAttribution: "Jamaica Observer, April 2024",
    summary:
      "Miss Universe Jamaica 2023 Dr Jordanne Levy prepared for Carnival at Carnival Glam Hub at the Jamaica Pegasus, with makeup by Brittany Miller and soft barrel curls by Lisa McIntosh.",
    tier: "caribbean",
  },
  {
    id: "our-today-elevating-2024",
    outlet: "Our Today",
    outletDomain: "our.today",
    headline: "Carnival Glam Hub Jamaica: Elevating the carnival experience",
    url: "https://our.today/carnival-glam-hub-jamaica-elevating-the-carnival-experience/",
    publishedDate: "2024-04-02",
    image:
      "https://app.our.today/wp-content/uploads/2024/04/432916914_18258572215243169_2105243967964292509_n-1024x1024.jpg",
    summary:
      "Our Today charts Glam Hub from a 2017 team of five into a regional operation, describing how the founders set out to streamline Carnival morning for masqueraders across the Caribbean.",
    tier: "caribbean",
  },
  {
    id: "observer-carnival-glam-2023",
    outlet: "Jamaica Observer",
    outletDomain: "jamaicaobserver.com",
    headline: "Carnival Glam",
    url: "https://www.jamaicaobserver.com/2023/04/04/carnival-glam/",
    publishedDate: "2023-04-04",
    image:
      "https://www.jamaicaobserver.com/jamaicaobserver/news/wp-content/uploads/sites/4/2023/04/15c173147abe1c94616a20e03bd166d0.jpg",
    pullQuote:
      "Carnival GLAMHub director Gabrielle Waite and her team have been creating some of the most awe-inspiring make-up looks at Miami, St Lucia, Barbados, Trinidad, and Jamaica Carnival since 2018.",
    pullQuoteAttribution: "Jamaica Observer, April 2023",
    summary:
      "Tuesday Style Dryer profiles Gabrielle Waite and the Glam Hub team's Carnival makeup work across Miami, Saint Lucia, Barbados, Trinidad and Jamaica.",
    tier: "caribbean",
  },
  {
    id: "gleaner-distinguished-2023",
    outlet: "Jamaica Gleaner",
    outletDomain: "jamaica-gleaner.com",
    headline: "Leading women in business, media and beauty honoured",
    url: "https://past.jamaica-gleaner.com/article/lifestyle/20230428/leading-women-business-media-and-beauty-honoured",
    publishedDate: "2023-04-28",
    author: "Aaliyah Cunningham",
    pullQuote:
      "Waite, chief executive officer of GabbyGlam Co and Carnival Glam Hub, shared that for her, the moment provided a chance to pause and acknowledge how far she had come.",
    pullQuoteAttribution: "Jamaica Gleaner, April 2023",
    summary:
      "Flair's Distinguished Awards honoured Gabrielle Waite for her contribution to beauty, naming her chief executive of GabbyGlam Co and Carnival Glam Hub.",
    tier: "caribbean",
  },
  {
    id: "our-today-prepares-2023",
    outlet: "Our Today",
    outletDomain: "our.today",
    headline: "Carnival Glam Hub prepares for Carnival in Jamaica",
    url: "https://our.today/carnival-glam-hub-prepares-for-carnival-in-jamaica/",
    publishedDate: "2023-03-08",
    image: "https://app.our.today/wp-content/uploads/2023/03/Glam-hub.jpg",
    pullQuote:
      "Carnival in Jamaica 2023 will be our 10th staging of Glam Hub. Our service has been trusted by more than 6,000 women to do their faces.",
    pullQuoteAttribution: "Gabrielle Waite, speaking to Our Today",
    summary:
      "A dedicated brand feature on the tenth staging of Glam Hub, covering the 2017 founding by Gabrielle Waite and Kibwe McGann and the full service line from hair and makeup to barber, henna, spray tan, photography, breakfast, shuttle, changing rooms, wing check and an air-conditioned lounge.",
    tier: "caribbean",
  },
  {
    id: "observer-very-glam-2022",
    outlet: "Jamaica Observer",
    outletDomain: "jamaicaobserver.com",
    headline: "A very GLAM Carnival",
    url: "https://www.jamaicaobserver.com/2022/07/15/a-very-glam-carnival/",
    publishedDate: "2022-07-15",
    image:
      "https://www.jamaicaobserver.com/jamaicaobserver/news/wp-content/uploads/sites/4/2022/07/7acdab4a18334685e34f319b7f7ef0c4.jpg",
    pullQuote:
      "The excitement at the Carnival GLAMHub was palpable when almost 200 Bacchanal Jamaica and Xodus revellers flocked the Jamaica Pegasus ballroom to get primped and polished for Sunday's Jamaica Carnival Road March.",
    pullQuoteAttribution: "Jamaica Observer, July 2022",
    summary:
      "Almost 200 Bacchanal Jamaica and Xodus revellers passed through the Glam Hub at the Jamaica Pegasus ballroom, the hub's home since its launch, for the return of Jamaica Carnival after a two-year hiatus.",
    tier: "caribbean",
  },
  {
    id: "observer-road-march-page-2022",
    outlet: "Jamaica Observer",
    outletDomain: "jamaicaobserver.com",
    headline: "Jamaica Carnival Road March, in pictures",
    url: "https://www.jamaicaobserver.com/2022/07/10/monday-july-11-2022-20231022-1412-188247/",
    publishedDate: "2022-07-10",
    image:
      "https://www.jamaicaobserver.com/jamaicaobserver/news/wp-content/uploads/sites/4/2022/07/444fc2b273e2829050a6a7a726afae8b-958x1024.jpg",
    note: "Photo feature",
    summary:
      "The Observer's Road March photo coverage opens at Carnival Glam Hub inside the Jamaica Pegasus before following revellers onto the Kingston streets.",
    tier: "caribbean",
  },
  {
    id: "haute-people-miami-2021",
    outlet: "Haute People",
    outletDomain: "thehautepeople.com",
    headline: "Miami Carnival in Glam: The Glam Hub Takes Miami",
    url: "https://www.thehautepeople.com/2021/10/miami-carnival-in-glam-the-glam-hub-takes-miami.html",
    publishedDate: "2021-10-01",
    note: "Date shown as published month",
    pullQuote:
      "Carnival Glam Hub will continue chasing carnivals and provide value-added services for masqueraders.",
    pullQuoteAttribution: "Kibwe McGann, speaking to Haute People",
    summary:
      "Haute People covers the Glam Hub's Miami Carnival debut and the single-location model behind it.",
    tier: "caribbean",
  },
  {
    id: "haute-people-trinidad-2020",
    outlet: "Haute People",
    outletDomain: "thehautepeople.com",
    headline: "Carnival Glam Hub Goes to Trinidad Carnival",
    url: "https://www.thehautepeople.com/2020/03/carnival-glam-hub-goes-to-trinidad.html",
    publishedDate: "2020-03-01",
    note: "Date shown as published month",
    summary:
      "Haute People covers the full service Carnival glam experience arriving in Trinidad, and its origins in 2018.",
    tier: "caribbean",
  },
  {
    id: "observer-trinidad-centrestage-2020",
    outlet: "Jamaica Observer",
    outletDomain: "jamaicaobserver.com",
    headline: "Carnival Glam Hub takes centrestage on Trinidad's beauty scene",
    url: "https://www.jamaicaobserver.com/2020/03/02/carnival-glam-hub-takes-centrestage-on-trinidads-beauty-scene/",
    publishedDate: "2020-03-02",
    author: "Tenille Clarke",
    image:
      "https://www.jamaicaobserver.com/jamaicaobserver/news/wp-content/uploads/sites/4/2020/03/6639eac18ff57f67c2d5cef1942c70a0.jpg",
    pullQuote:
      "After successfully executing the Glam Hub experience in Jamaica, it was time to move into the mecca of Carnival, Trinidad.",
    pullQuoteAttribution: "Kibwe McGann, speaking to the Jamaica Observer",
    summary:
      "The Trinidad expansion documented at the Hilton Trinidad, with roughly 150 clients on Carnival Monday and more than 400 people on Carnival Tuesday.",
    tier: "caribbean",
  },
  {
    id: "gleaner-glamtrepreneur-2019",
    outlet: "Jamaica Gleaner",
    outletDomain: "jamaica-gleaner.com",
    headline: "Gabrielle Waite: a young glamtrepreneur's story",
    url: "https://past.jamaica-gleaner.com/article/flair/20190902/gabrielle-waite-young-glamtrepreneurs-story",
    publishedDate: "2019-09-02",
    summary:
      "Flair's early profile of Gabrielle Waite covers the creation of Carnival Glam Hub and its growth from about ten makeup artists and three hairstylists to a far larger operation.",
    tier: "caribbean",
  },
  {
    id: "observer-buzz-recap-2020",
    outlet: "Jamaica Observer",
    outletDomain: "jamaicaobserver.com",
    headline: "It's a wrap! BUZZ recap of Trinidad Carnival's top events",
    url: "https://www.jamaicaobserver.com/2020/03/01/its-a-wrap-buzz-recap-of-trinidad-carnivals-top-events/",
    publishedDate: "2020-03-01",
    summary:
      "Named among the publication's favourite features of Trinidad Carnival 2020.",
    tier: "mention",
  },
  {
    id: "observer-xodus-xperience-2024",
    outlet: "Jamaica Observer",
    outletDomain: "jamaicaobserver.com",
    headline: "Lucky reveller wins 'Xodus Xperience'",
    url: "https://www.jamaicaobserver.com/2024/01/04/lucky-reveller-wins-xodus-xperience/",
    publishedDate: "2024-01-04",
    summary:
      "A Carnival Glam Hub makeup and photography package formed part of the Xodus Xperience prize, with Gabrielle Waite at the handover.",
    tier: "mention",
  },
  {
    id: "gleaner-xodus-xperience-2024",
    outlet: "Jamaica Gleaner",
    outletDomain: "jamaica-gleaner.com",
    headline: "Lucky reveller thrilled to win 'Xodus Xperience'",
    url: "https://past.jamaica-gleaner.com/article/entertainment/20240108/lucky-reveller-thrilled-win-xodus-xperience",
    publishedDate: "2024-01-08",
    summary: "Gleaner coverage of the same Xodus Xperience handover.",
    tier: "mention",
  },
  {
    id: "observer-carnival-come-back-home-2023",
    outlet: "Jamaica Observer",
    outletDomain: "jamaicaobserver.com",
    headline: "Carnival Come Back Home",
    url: "https://www.jamaicaobserver.com/2023/04/01/carnival-come-back-home/",
    publishedDate: "2023-04-01",
    summary:
      "Makeup credited to Carnival Glam Hub in the Observer's Carnival photo feature.",
    tier: "mention",
  },
  {
    id: "our-today-genxs-2022",
    outlet: "Our Today",
    outletDomain: "our.today",
    headline: "GenXS announces new carnival band for Carnival in Jamaica 2023",
    url: "https://our.today/genxs-announces-new-carnival-band-for-carnival-in-jamaica-2023/",
    publishedDate: "2022-11-15",
    summary:
      "Co-founder Kibwe McGann named as a Glam Hub principal operating across five Carnival markets.",
    tier: "mention",
  },
  {
    id: "haute-people-lipsticks-2021",
    outlet: "Haute People",
    outletDomain: "thehautepeople.com",
    headline: "Jamaican Beauty Mogul Gabrielle Waite Launches New Line of Lipsticks",
    url: "https://www.thehautepeople.com/2021/12/jamaican-beauty-mogul-gabrielle-waite-launches-new-line-of-lipsticks.html",
    publishedDate: "2021-12-01",
    summary:
      "Founder coverage describing Carnival Glam Hub as the Caribbean's premier Carnival makeup and hair concierge.",
    tier: "mention",
  },
];

export const storiesByTier = (tier: PressTier) =>
  PRESS_STORIES.filter((s) => s.tier === tier);

export type PressOutlet = {
  name: string;
  domain: string;
  /** id of that outlet's newest story on the press page. */
  anchorId: string;
};

const newestIdFor = (domain: string) =>
  PRESS_STORIES.filter((s) => s.outletDomain === domain).sort((a, b) =>
    b.publishedDate.localeCompare(a.publishedDate),
  )[0]?.id ?? "";

export const PRESS_OUTLETS: readonly PressOutlet[] = [
  { name: "Teen Vogue", domain: "teenvogue.com", anchorId: newestIdFor("teenvogue.com") },
  { name: "theGrio", domain: "thegrio.com", anchorId: newestIdFor("thegrio.com") },
  {
    name: "Jamaica Observer",
    domain: "jamaicaobserver.com",
    anchorId: newestIdFor("jamaicaobserver.com"),
  },
  {
    name: "Jamaica Gleaner",
    domain: "jamaica-gleaner.com",
    anchorId: newestIdFor("jamaica-gleaner.com"),
  },
  { name: "Our Today", domain: "our.today", anchorId: newestIdFor("our.today") },
  { name: "CaribVoxx", domain: "caribvoxx.com", anchorId: newestIdFor("caribvoxx.com") },
  { name: "Haute People", domain: "thehautepeople.com", anchorId: newestIdFor("thehautepeople.com") },
] as const;

/** Year markers for the coverage timeline. */
export const PRESS_TIMELINE: { year: string; outlets: string[] }[] = (() => {
  const map = new Map<string, Set<string>>();
  for (const s of PRESS_STORIES) {
    const year = s.publishedDate.slice(0, 4);
    if (!map.has(year)) map.set(year, new Set());
    map.get(year)!.add(s.outlet);
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([year, outlets]) => ({ year, outlets: [...outlets] }));
})();
