import guyanaImg from "@/assets/carnival-4.jpg";

export const BOOKING_URL = "https://carnivalglamhub.masos.app/events";

export type Destination = {
  slug: string;
  name: string;
  shortName: string;
  date: string;
  description: string;
  longDescription: string;
  image: string;
  cta: string;
  upcoming?: boolean;
  objectPosition?: string;
  highlights: string[];
  metaTitle: string;
  metaDescription: string;
};

export const destinations: Destination[] = [
  {
    slug: "jamaica",
    name: "Jamaica Carnival",
    shortName: "Jamaica",
    date: "12 April 2026",
    description: "Premium glam hub services for Jamaica Carnival.",
    longDescription:
      "Our Jamaica Carnival glam hub is based at the Jamaica Pegasus Hotel, Kingston. We deliver full makeup, hair, gem application, body paint and lash services so you can hit the road flawless. Our Caribbean-trained artists specialise in long-wear, sweat-proof carnival looks built for the Jamaica heat.",
    image: "https://www.dropbox.com/scl/fi/a2s2gnuk6k1zurq8296ee/IMG_6662.jpg?rlkey=l0ekybyz3r68kohd6bbxjx2ro&raw=1",
    cta: "Book Jamaica Glam",
    highlights: [
      "Full carnival makeup with sweat-proof finish",
      "Gem & feather application",
      "Hair styling and braiding",
      "Lash application and body paint",
    ],
    metaTitle: "Jamaica Carnival Makeup & Glam Services 2026 | Carnival Glam Hub",
    metaDescription:
      "Book premium Jamaica Carnival makeup, hair, gems and body paint. Sweat-proof carnival glam by professional Caribbean artists for 12 April 2026.",
  },
  {
    slug: "saint-lucia",
    name: "Saint Lucia Carnival",
    shortName: "Saint Lucia",
    date: "20–21 July 2026",
    description: "Full-service glam for Saint Lucia Carnival.",
    longDescription:
      "Our Saint Lucia Carnival glam hub is set up across the island with packages for road march, j'ouvert and fete looks. Get matched with a senior artist for your full carnival glam experience.",
    image: "https://www.dropbox.com/scl/fi/wvkuyil1teg9kdvl6wdbp/Alliyah.png?rlkey=q8zy5e0rd8zbtpb2bi2yh6imc&dl=1",
    cta: "Book Saint Lucia Glam",
    objectPosition: "50% 20%",
    highlights: [
      "Road march full glam",
      "J'ouvert paint and shimmer",
      "Festival hair styling",
      "Eye gems & festival lashes",
    ],
    metaTitle: "Saint Lucia Carnival Makeup & Glam 2026 | Carnival Glam Hub",
    metaDescription:
      "Saint Lucia Carnival 2026 glam hub: full makeup, hair, gems and j'ouvert paint by professional artists. Reserve your slot for 20–21 July 2026.",
  },
  {
    slug: "antigua",
    name: "Antigua Carnival",
    shortName: "Antigua",
    date: "4 August 2026",
    description: "Carnival glam services for Antigua Carnival.",
    longDescription:
      "Antigua Carnival is one of the Caribbean's most colorful festivals — and our glam hub keeps you camera-ready from j'ouvert to last lap. Premium makeup, hair, gems and body art available across the island.",
    image: "https://www.dropbox.com/scl/fi/zj9aswskvl80vunhkhdcf/Chloe%20J.png?rlkey=yxp73i1uv8pcwpuink46ty6mv&dl=1",
    cta: "Book Antigua Glam",
    objectPosition: "50% 20%",
    highlights: [
      "Full carnival makeup",
      "Gem & rhinestone designs",
      "Hair braids and styling",
      "Body paint and shimmer",
    ],
    metaTitle: "Antigua Carnival Makeup & Glam Services 2026 | Carnival Glam Hub",
    metaDescription:
      "Premium Antigua Carnival makeup, hair and body art. Book your full glam package for 4 August 2026 with Carnival Glam Hub.",
  },
  {
    slug: "grenada",
    name: "Grenada Carnival",
    shortName: "Grenada",
    date: "10 – 11 August 2026",
    description: "Premium glam services for Grenada Spicemas.",
    longDescription:
      "Spicemas is unmatched — and our Grenada Carnival glam hub matches the energy. Full makeup, hair, gems, lashes and j'ouvert paint by our trained Caribbean carnival artists.",
    image: "https://www.dropbox.com/scl/fi/taonoqg2p6faph4jipzhr/AALiyah.png?rlkey=jwxhfig9y16l6kn2573nkuggh&dl=1",
    cta: "Book Grenada Glam",
    objectPosition: "50% 20%",
    highlights: [
      "Spicemas full glam",
      "J'ouvert paint and oil packages",
      "Hair styling and braiding",
      "Festival gems & lashes",
    ],
    metaTitle: "Grenada Spicemas Carnival Makeup 2026 | Carnival Glam Hub",
    metaDescription:
      "Spicemas 2026 glam hub in Grenada — full carnival makeup, hair, gems and j'ouvert paint. Book your spot for 11 August 2026.",
  },
  {
    slug: "barbados",
    name: "Barbados Crop Over",
    shortName: "Barbados",
    date: "3 August 2026",
    description: "Full glam hub services for Barbados Crop Over.",
    longDescription:
      "Crop Over is the Caribbean's biggest summer carnival — and our Barbados glam hub is fully booked every season for a reason. Get the full road experience with sweat-proof makeup, festival hair, gems and j'ouvert paint by our top artists.",
    image: "https://www.dropbox.com/scl/fi/4a52okz83gxh171qyhfjc/Dania.png?rlkey=q3figf3ty5abs9gdie4rtjcow&dl=1",
    cta: "Book Barbados Glam",
    objectPosition: "50% 20%",
    highlights: [
      "Grand Kadooment full glam",
      "Foreday Morning paint",
      "Festival hair & braids",
      "Gems, lashes and shimmer",
    ],
    metaTitle: "Barbados Carnival Glam & Makeup Services | Carnival Glam Hub",
    metaDescription:
      "Carnival Glam Hub brings expert carnival makeup to Barbados. Caribbean-inspired glam for diaspora women ready to shine. Book your Cropover look today.",
  },
  {
    slug: "miami",
    name: "Miami Carnival",
    shortName: "Miami",
    date: "11 October 2026",
    description: "Glam hub services for Miami Carnival.",
    longDescription:
      "Our Miami Carnival glam hub serves the entire Miami Carnival season — from pre-carnival fetes through Columbus Day weekend. Full makeup, hair, gems and body art by our pro carnival team.",
    image: "https://www.dropbox.com/scl/fi/x4z9o06d4h5ite4v2ph4g/Kayla.png?rlkey=o33o2vlxhcqidxgewnhp4wuh0&dl=1",
    cta: "Book Miami Glam",
    objectPosition: "50% 20%",
    highlights: [
      "Full road glam packages",
      "Fete-ready makeup",
      "Festival hair styling",
      "Gems, lashes and body paint",
    ],
    metaTitle: "Miami Carnival Makeup Artist | Carnival Glam Hub 2026",
    metaDescription:
      "Book your Miami Carnival glam look with Carnival Glam Hub. Makeup and styling for diaspora women ready to shine. Miami Caribbean carnival specialists.",
  },
  {
    slug: "toronto",
    name: "Toronto Caribana",
    shortName: "Toronto",
    date: "1 August 2026",
    description: "Glam hub services for Toronto Caribana.",
    longDescription:
      "Caribana is North America's biggest Caribbean carnival, and our Toronto glam hub is on the road with you. Full makeup, hair, festival gems and body art for the Grand Parade and weekend fetes.",
    image: "https://www.dropbox.com/scl/fi/tnghsl2n83e111g3b6ffs/Krystal%20Pitt.png?rlkey=nyhzn9cf43lwlsqjpa0hif5pk&dl=1",
    cta: "Book Toronto Glam",
    objectPosition: "50% 20%",
    highlights: [
      "Grand Parade full glam",
      "Fete makeup packages",
      "Festival hair & braids",
      "Gems, lashes and shimmer",
    ],
    metaTitle: "Toronto Carnival Makeup & Glam Services | Carnival Glam Hub",
    metaDescription:
      "Toronto Caribbean carnival glam from Carnival Glam Hub. Expert carnival makeup for Caribana and the diaspora. Book your look for Toronto Carnival now.",
  },
  {
    slug: "trinidad",
    name: "Trinidad Carnival",
    shortName: "Trinidad",
    date: "Feb–Mar 2027",
    description: "Premium glam services for Trinidad Carnival 2027 - Port of Spain.",
    longDescription:
      "Trinidad Carnival 2027 packages opening soon. Join the waitlist for j'ouvert, Monday wear and Carnival Tuesday road glam in Port of Spain.",
    image: "https://www.dropbox.com/scl/fi/onz3y4le6o3odlfa2kvyo/Mala.png?rlkey=df6azxcg4aqlwko4tce3ewqk7&dl=1",
    cta: "Book Trinidad Glam",
    upcoming: false,
    objectPosition: "50% 20%",
    highlights: [
      "Carnival Monday & Tuesday road glam",
      "J'ouvert paint packages",
      "Festival hair styling",
      "Gems, lashes and body art",
    ],
    metaTitle: "Trinidad Carnival Makeup & Glam Services 2027 | Carnival Glam Hub",
    metaDescription:
      "Trinidad Carnival 2027 glam hub waitlist — full road makeup, hair, gems and j'ouvert paint in Port of Spain. Reserve early.",
  },
  {
    slug: "guyana",
    name: "Guyana Carnival",
    shortName: "Guyana",
    date: "May 2026",
    description: "Full glam hub services for Guyana Carnival.",
    longDescription:
      "Guyana Carnival brings Mashramani energy to the road — and our Guyana glam hub keeps you flawless from fete to road march. Full makeup, hair, gems, lashes and body art by our Caribbean-trained carnival artists.",
    image: guyanaImg,
    cta: "Book Guyana Glam",
    highlights: [
      "Full road carnival glam",
      "Festival hair styling",
      "Gem & rhinestone application",
      "Body paint and shimmer",
    ],
    metaTitle: "Guyana Carnival Makeup & Glam Services 2026 | Carnival Glam Hub",
    metaDescription:
      "Book premium Guyana Carnival makeup, hair, gems and body paint. Sweat-proof carnival glam by professional Caribbean artists.",
  },
  {
    slug: "epic-cruise",
    name: "Epic Cruise — Trinidad Carnival",
    shortName: "Epic Cruise",
    date: "8–9 February 2027",
    description: "Premium glam hub services for EPIC Carnival Experience masqueraders.",
    longDescription:
      "Glam Hub at sea! Carnival Glam Hub is aboard the EPIC Carnival Experience — the luxury floating hotel that sails masqueraders from San Juan, Puerto Rico straight to Trinidad Carnival. Book your makeup, hair, photoshoot, and get-dressed services exclusively for EPIC cruise masqueraders.",
    image: "https://www.dropbox.com/scl/fi/i9atucg76ieovbmkkqupg/IMG_8522.jpg?rlkey=b74ambfqu21fjbadhidkcy6u7&st=rmucsn19&dl=1",
    cta: "Book Epic Cruise Glam",
    objectPosition: "50% 20%",
    highlights: [
      "Glam hub aboard the EPIC cruise ship",
      "Carnival Monday & Tuesday coverage",
      "Full makeup, hair & photoshoot",
      "Get Dressed assistance included",
    ],
    metaTitle: "EPIC Cruise Carnival Glam Hub 2027 | Carnival Glam Hub",
    metaDescription:
      "Book your carnival glam services on the EPIC Cruise. Carnival Glam Hub is aboard the EPIC Carnival Experience for Trinidad Carnival 2027.",
  },
];

export const getDestinationBySlug = (slug: string) =>
  destinations.find((d) => d.slug === slug);

export type Faq = { question: string; answer: string };

/**
 * SEO-rich FAQs per destination, targeting "{destination} carnival glam"
 * and related long-tail searches (cost, location, what's included, etc.).
 */
export function getDestinationFaqs(d: Destination): Faq[] {
  const loc = d.shortName;
  const event = d.name;
  const date = d.date;

  return [
    {
      question: `Where can I book ${loc} carnival glam?`,
      answer: `You can book ${loc} carnival glam directly with Carnival Glam Hub through our online booking platform at carnivalglamhub.masos.app/events. We're the leading carnival glam service for ${event}, offering full makeup, hair, gems, lashes and body paint packages by professional Caribbean-trained artists.`,
    },
    {
      question: `When is ${event} in ${date.includes("2027") ? "2027" : "2026"}?`,
      answer: `${event} ${d.upcoming ? "takes place" : "is scheduled for"} ${date}. Carnival Glam Hub services are available throughout the carnival weekend — including j'ouvert, road march and fete glam appointments. Spaces fill quickly, so we recommend booking at least 4–6 weeks in advance.`,
    },
    {
      question: `What's included in a ${loc} carnival glam package?`,
      answer: `Our ${loc} carnival glam packages include ${d.highlights.map((h) => h.toLowerCase()).join(", ")}. Every package is performed by a senior Caribbean carnival makeup artist using long-wear, sweat-proof products designed for full-day road performance.`,
    },
    {
      question: `How much does ${loc} carnival makeup cost?`,
      answer: `${loc} carnival makeup pricing varies by service tier — full glam, j'ouvert paint, hair, gems and lashes are all available as individual add-ons or full packages. Live pricing and availability for each ${loc} package is shown on our booking page at carnivalglamhub.masos.app/events.`,
    },
    {
      question: `Do you offer j'ouvert paint and body art for ${event}?`,
      answer: `Yes — j'ouvert paint, shimmer, oil and body art are part of our ${loc} carnival glam menu. Our artists use professional, skin-safe carnival paints that hold up to heat, sweat and water on the road.`,
    },
    {
      question: `How early should I book ${loc} carnival glam?`,
      answer: `For ${event} (${date}), we recommend booking your ${loc} carnival glam appointment at least 4–6 weeks ahead. Peak weekend slots — especially j'ouvert morning and road march — sell out first every season.`,
    },
    {
      question: `Are your ${loc} carnival makeup artists professional?`,
      answer: `Every Carnival Glam Hub artist working ${event} is a vetted, professional Caribbean carnival makeup artist with multi-season experience in long-wear, photo-ready road glam. We service masqueraders across all major bands in ${loc}.`,
    },
  ];
}