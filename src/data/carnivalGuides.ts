// The Carnival guides registry.
//
// EDITORIAL, NOT AN OFFER. Every entry here is a pointer at a journal
// article. Guides are never season filtered. The ONWARD DESTINATION RULE
// hides a wrapped Carnival from destination lists because you cannot sell
// a Carnival that has happened, but a Saint Lucia or Antigua guide is still
// useful reading and still ranks after the season passes. Do not run this
// module through getUpcomingDestinations.
//
// J'ouvert and Jab guides belong here for the same reason. J'ouvert as
// editorial is fine, J'ouvert as an offer is false.
//
// Every slug must exist in src/data/blogCatalogue.ts, which
// src/test/carnivalGuides.test.ts enforces, so a deleted post can never
// leave a dead card on the site.

export type CarnivalGuide = {
  /** Blog slug, must resolve to a real post. */
  slug: string;
  /** Descriptive anchor text, never "read more". */
  anchor: string;
  /** One line of context under the anchor. */
  blurb: string;
  /** Destination slugs this guide is relevant to, for filtered blocks. */
  territories?: string[];
};

export type CarnivalGuideGroup = {
  id: string;
  title: string;
  blurb: string;
  guides: CarnivalGuide[];
};

export const CARNIVAL_GUIDE_GROUPS: CarnivalGuideGroup[] = [
  {
    id: "trinidad",
    title: "Trinidad Carnival",
    blurb: "Dates, bands, budgets and the road itself.",
    guides: [
      {
        slug: "ultimate-guide-to-trinidad-carnival-2026-mas-bands-dates-insider-tips",
        anchor: "Trinidad Carnival 2027 guide: dates, bands and costumes",
        blurb: "The full planning guide, from band launches to Carnival Tuesday.",
        territories: ["trinidad", "trinidad-carnival-2027"],
      },
      {
        slug: "trinidad-carnival-2027-first-time-masquerader-guide",
        anchor: "Trinidad Carnival first-time masquerader guide",
        blurb: "Hotels, budgets and Carnival-morning planning for a first road.",
        territories: ["trinidad", "trinidad-carnival-2027"],
      },
      {
        slug: "dont-make-these-5-rookie-mistakes-trinidad-carnival-2027",
        anchor: "Five rookie mistakes to avoid at Trinidad Carnival",
        blurb: "The errors first-timers make, and what they cost you.",
        territories: ["trinidad", "trinidad-carnival-2027"],
      },
      {
        slug: "is-trinidad-carnival-safe",
        anchor: "Is Trinidad Carnival safe? The honest answer",
        blurb: "Real talk on safety, taxis and where to stay.",
        territories: ["trinidad", "trinidad-carnival-2027"],
      },
      {
        slug: "what-shoes-to-wear-for-trinidad-carnival-monday-tuesday-no-not-heels",
        anchor: "What shoes to wear for Trinidad Carnival Monday and Tuesday",
        blurb: "Two days on the road, and why heels are not the answer.",
        territories: ["trinidad", "trinidad-carnival-2027"],
      },
      {
        slug: "tribe-carnival-2027-elysia-band-launch",
        anchor: "TRIBE Carnival 2027 Elysia band launch",
        blurb: "Inside the launch and the sections worth watching.",
        territories: ["trinidad", "trinidad-carnival-2027"],
      },
      {
        slug: "yuma-ferocious-trinidad-carnival-2027-band-launch",
        anchor: "YUMA Ferocious band launch for Trinidad Carnival 2027",
        blurb: "Fierce by Nature, section by section.",
        territories: ["trinidad", "trinidad-carnival-2027"],
      },
    ],
  },
  {
    id: "jouvert-and-jab",
    title: "J'ouvert and Jab",
    blurb: "The pre-dawn morning, the oil, and how to get it back off.",
    guides: [
      {
        slug: "what-is-jouvert-and-why-should-you-do-it-at-least-once",
        anchor: "What is J'ouvert? The pre-dawn Carnival ritual explained",
        blurb: "Where it comes from and why you should do it at least once.",
      },
      {
        slug: "10-tips-for-trinidad-carnival-jouvert",
        anchor: "Ten tips for Trinidad Carnival J'ouvert",
        blurb: "What to wear, what to carry and how to survive the morning.",
        territories: ["trinidad", "trinidad-carnival-2027"],
      },
      {
        slug: "top-5-caribbean-carnival-jouvert-bands-experiences",
        anchor: "The five best Caribbean J'ouvert bands and experiences",
        blurb: "Which morning band to pick, island by island.",
      },
      {
        slug: "jouvert-amazon-finds-i-swear-by-for-carnival-season",
        anchor: "J'ouvert Amazon finds worth packing",
        blurb: "The small things that save the morning.",
      },
      {
        slug: "youre-outside-for-trinidad-jouvert-but-your-hair-whats-she-doing",
        anchor: "Trinidad J'ouvert hair: what to do before you go out",
        blurb: "Protecting your hair before the paint starts.",
        territories: ["trinidad", "trinidad-carnival-2027"],
      },
      {
        slug: "how-to-protect-your-hair-at-jouvert-without-looking-crazy",
        anchor: "How to protect your hair at J'ouvert",
        blurb: "Cover-ups that work and still look like something.",
      },
      {
        slug: "dont-skip-jouvert-because-of-your-hair-tips-to-keep-it-fabulous",
        anchor: "Do not skip J'ouvert because of your hair",
        blurb: "Keeping it fabulous through paint, powder and mud.",
      },
      {
        slug: "grenada-jab-jab-spicemas-jouvert-experience",
        anchor: "Grenada Jab Jab: the Spicemas J'ouvert experience",
        blurb: "Oil, horns and chains on the Carenage at four in the morning.",
        territories: ["grenada"],
      },
      {
        slug: "jab-jab-101-what-you-really-need-to-know-about-grenada-carnival",
        anchor: "Jab Jab 101: what to know about Grenada Spicemas",
        blurb: "The history behind the oil, explained simply.",
        territories: ["grenada"],
      },
      {
        slug: "jab-jab-grenada-2026-guide",
        anchor: "Jab Jab Grenada guide: what to wear and bring",
        blurb: "Kit list, clothing you can throw away, and oil removal.",
        territories: ["grenada"],
      },
      {
        slug: "your-no-nonsense-jab-jab-survival-kit-straight-from-someone-whos-been-baptized-in-oil",
        anchor: "The no-nonsense Jab Jab survival kit",
        blurb: "Written by someone who has been baptised in oil.",
        territories: ["grenada"],
      },
    ],
  },
  {
    id: "first-timers",
    title: "First Carnival, and choosing one",
    blurb: "Where to start, and how the islands actually compare.",
    guides: [
      {
        slug: "trinidad-carnival-vs-jamaica-carnival",
        anchor: "Trinidad Carnival vs Jamaica Carnival",
        blurb: "The honest guide to choosing between the two.",
        territories: ["trinidad", "trinidad-carnival-2027", "jamaica"],
      },
      {
        slug: "trinidad-carnival-vs-grenada-carnival",
        anchor: "Trinidad Carnival vs Grenada Carnival",
        blurb: "Two very different roads, side by side.",
        territories: ["trinidad", "trinidad-carnival-2027", "grenada"],
      },
      {
        slug: "de-fete-need-rules-fete-etiquette",
        anchor: "Fete etiquette: the rules nobody writes down",
        blurb: "How to move in a fete without embarrassing yourself.",
      },
      {
        slug: "is-professional-carnival-makeup-worth-it",
        anchor: "Is professional Carnival makeup worth it?",
        blurb: "What you are really paying for, and when it pays off.",
      },
      {
        slug: "how-far-in-advance-to-book-carnival-makeup",
        anchor: "How far in advance to book Carnival makeup",
        blurb: "When the good slots go, territory by territory.",
      },
    ],
  },
  {
    id: "packing",
    title: "Packing and road essentials",
    blurb: "Everything that goes in the bag before Carnival Monday.",
    guides: [
      {
        slug: "what-to-bring-for-carnival",
        anchor: "What to bring for Carnival: the packing list",
        blurb: "The no-nonsense list, nothing padded.",
      },
      {
        slug: "how-to-put-on-your-carnival-wire-bra",
        anchor: "How to put on your Carnival wire bra",
        blurb: "Fitting, taping and staying comfortable all day.",
      },
      {
        slug: "comfort-queen-or-hot-gyal",
        anchor: "Comfort queen or hot gyal: dressing for the road",
        blurb: "Where to spend comfort and where to spend glamour.",
      },
      {
        slug: "strut-or-struggle-the-ultimate-guide-to-carnival-shoes",
        anchor: "The ultimate guide to Carnival shoes",
        blurb: "Strut, do not struggle. Boots, trainers and everything between.",
      },
    ],
  },
  {
    id: "makeup-and-hair",
    title: "Makeup and hair",
    blurb: "Looks that hold through heat, sweat and a full road day.",
    guides: [
      {
        slug: "top-seven-best-carnival-hairstyles",
        anchor: "The best Carnival hairstyles that survive the road",
        blurb: "Headpiece-ready looks that hold all day.",
      },
      {
        slug: "carnival-ponytails-bald-spots-what-no-one-tells-you",
        anchor: "Carnival ponytails and bald spots",
        blurb: "What nobody tells you about road-day hair.",
      },
      {
        slug: "2025-carnival-makeup-guide-50-looks-to-show-your-mua",
        anchor: "Carnival makeup guide: 50 looks to show your MUA",
        blurb: "A reference gallery to bring to your appointment.",
      },
      {
        slug: "should-the-makeup-match-your-costume",
        anchor: "Should the makeup match your costume?",
        blurb: "Matching, contrasting, and when each one works.",
      },
      {
        slug: "is-soft-glam-the-new-trend-carnival-makeup-looks-2024",
        anchor: "Is soft glam the new Carnival makeup trend?",
        blurb: "Where the looks are heading, and what still photographs best.",
      },
    ],
  },
  {
    id: "jamaica",
    title: "Jamaica Carnival",
    blurb: "Road March week in Kingston, planned properly.",
    guides: [
      {
        slug: "your-ultimate-guide-to-jamaica-carnival-2025-everything-you-need-to-know",
        anchor: "The ultimate guide to Jamaica Carnival",
        blurb: "Bands, fetes, hotels and everything around the road.",
        territories: ["jamaica"],
      },
      {
        slug: "makeup-mastery-at-jamaica-carnival",
        anchor: "Makeup mastery at Jamaica Carnival",
        blurb: "What the Glam Hub does on Road March morning.",
        territories: ["jamaica"],
      },
      {
        slug: "winnie-harlow-turns-heads-at-jamaica-carnival-a-genxs-glam-hub-experience",
        anchor: "Winnie Harlow at Jamaica Carnival",
        blurb: "A GenXS and Glam Hub road-day look, up close.",
        territories: ["jamaica"],
      },
    ],
  },
  {
    id: "saint-lucia",
    title: "Saint Lucia Carnival",
    blurb: "Travel, costumes and the July road.",
    guides: [
      {
        slug: "what-you-need-to-know-about-saint-lucia-carnival",
        anchor: "What you need to know about Saint Lucia Carnival",
        blurb: "The basics, from bands to Carnival Tuesday.",
        territories: ["saint-lucia"],
      },
      {
        slug: "saint-lucia-carnival-2025-travel-tips-for-international-visitors",
        anchor: "Saint Lucia Carnival travel tips for international visitors",
        blurb: "Flights, transfers and where to base yourself.",
        territories: ["saint-lucia"],
      },
      {
        slug: "saint-lucia-carnival-2024-review",
        anchor: "Saint Lucia Carnival review",
        blurb: "What the road was actually like, honestly.",
        territories: ["saint-lucia"],
      },
      {
        slug: "chloe-baileys-saint-lucia-carnival-costume-breaks-the-internet",
        anchor: "Chloe Bailey's Saint Lucia Carnival costume",
        blurb: "The look that broke the internet, broken down.",
        territories: ["saint-lucia"],
      },
    ],
  },
  {
    id: "barbados",
    title: "Barbados Crop Over",
    blurb: "Kadooment, Foreday and the Bajan season.",
    guides: [
      {
        slug: "barbados-crop-over-2025-what-to-know-before-you-go",
        anchor: "Barbados Crop Over: what to know before you go",
        blurb: "Kadooment week, planned from the flight in.",
        territories: ["barbados"],
      },
      {
        slug: "carnival-queen-rihannas-stunning-return-to-crop-over-2024",
        anchor: "Rihanna's return to Crop Over",
        blurb: "The Bajan queen back on Kadooment day.",
        territories: ["barbados"],
      },
      {
        slug: "rihannas-carnival-looks-over-the-years-50-photos",
        anchor: "Rihanna's Carnival looks over the years, in 50 photos",
        blurb: "A decade of Crop Over costumes in one place.",
        territories: ["barbados"],
      },
    ],
  },
  {
    id: "around-the-circuit",
    title: "Around the circuit",
    blurb: "Miami, Tobago and the wider Carnival calendar.",
    guides: [
      {
        slug: "genx-miami-carnival-2024-costumes",
        anchor: "GenX Miami Carnival costumes",
        blurb: "The sections and looks from Columbus Day weekend.",
        territories: ["miami"],
      },
      {
        slug: "bianca-manzano-on-hibiscus-bloom-designing-for-iconic-mas-and-why-tobago-carnival-matters",
        anchor: "Bianca Manzano on designing for Tobago Carnival",
        blurb: "Hibiscus Bloom, ICONIC Mas, and why Tobago matters.",
        territories: ["tobago"],
      },
      {
        slug: "chatgpt-picks-the-top-5-best-caribbean-carnivals",
        anchor: "The top five Caribbean Carnivals, ranked",
        blurb: "A wild take on which road wins.",
      },
      {
        slug: "caribbean-carnival-has-an-airlift-problem",
        anchor: "Caribbean Carnival has an airlift problem",
        blurb: "Why flights sell out and how to plan around it.",
      },
    ],
  },
];

export const ALL_CARNIVAL_GUIDES: CarnivalGuide[] = CARNIVAL_GUIDE_GROUPS.flatMap(
  (g) => g.guides,
);

export const guideHref = (guide: CarnivalGuide) => `/blogs/${guide.slug}`;

/**
 * Guides relevant to one destination slug. Never season filtered, an
 * article stays useful after the Carnival has passed.
 */
export function getGuidesForTerritory(slug: string, limit = 6): CarnivalGuide[] {
  const seen = new Set<string>();
  const picked: CarnivalGuide[] = [];
  for (const guide of ALL_CARNIVAL_GUIDES) {
    if (!guide.territories?.includes(slug)) continue;
    if (seen.has(guide.slug)) continue;
    seen.add(guide.slug);
    picked.push(guide);
    if (picked.length >= limit) break;
  }
  return picked;
}
