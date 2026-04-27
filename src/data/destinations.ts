import jamaicaImg from "@/assets/dest-jamaica-new.jpg";
import stluciaImg from "@/assets/dest-stlucia-new.jpg";
import trinidadImg from "@/assets/dest-trinidad-new.jpg";
import antiguaImg from "@/assets/carnival-3.jpg";
import grenadaImg from "@/assets/carnival-5.jpg";
import miamiImg from "@/assets/carnival-7.jpg";
import barbadosImg from "@/assets/carnival-8.jpg";
import torontoImg from "@/assets/carnival-9.jpg";

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
      "From Kingston to Ocho Rios, our Jamaica Carnival glam hub delivers full makeup, hair, gem application, body paint and lash services so you can hit the road flawless. Our Caribbean-trained artists specialize in long-wear, sweat-proof carnival looks built for the Jamaica heat.",
    image: jamaicaImg,
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
    image: stluciaImg,
    cta: "Book Saint Lucia Glam",
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
    image: antiguaImg,
    cta: "Book Antigua Glam",
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
    date: "11 August 2026",
    description: "Premium glam services for Grenada Spicemas.",
    longDescription:
      "Spicemas is unmatched — and our Grenada Carnival glam hub matches the energy. Full makeup, hair, gems, lashes and j'ouvert paint by our trained Caribbean carnival artists.",
    image: grenadaImg,
    cta: "Book Grenada Glam",
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
    date: "August 2026",
    description: "Full glam hub services for Barbados Crop Over.",
    longDescription:
      "Crop Over is the Caribbean's biggest summer carnival — and our Barbados glam hub is fully booked every season for a reason. Get the full road experience with sweat-proof makeup, festival hair, gems and j'ouvert paint by our top artists.",
    image: barbadosImg,
    cta: "Book Barbados Glam",
    highlights: [
      "Grand Kadooment full glam",
      "Foreday Morning paint",
      "Festival hair & braids",
      "Gems, lashes and shimmer",
    ],
    metaTitle: "Barbados Crop Over Makeup & Glam 2026 | Carnival Glam Hub",
    metaDescription:
      "Barbados Crop Over 2026 glam hub: Grand Kadooment makeup, hair, gems and Foreday paint by professional Caribbean artists. Reserve now.",
  },
  {
    slug: "miami",
    name: "Miami Carnival",
    shortName: "Miami",
    date: "Aug–Oct 2026",
    description: "Glam hub services for Miami Carnival.",
    longDescription:
      "Our Miami Carnival glam hub serves the entire Miami Carnival season — from pre-carnival fetes through Columbus Day weekend. Full makeup, hair, gems and body art by our pro carnival team.",
    image: miamiImg,
    cta: "Book Miami Glam",
    highlights: [
      "Full road glam packages",
      "Fete-ready makeup",
      "Festival hair styling",
      "Gems, lashes and body paint",
    ],
    metaTitle: "Miami Carnival Makeup & Glam Services 2026 | Carnival Glam Hub",
    metaDescription:
      "Miami Carnival 2026 glam hub — book full carnival makeup, hair, gems and body art with Carnival Glam Hub for the Columbus Day weekend.",
  },
  {
    slug: "toronto",
    name: "Toronto Caribana",
    shortName: "Toronto",
    date: "August 2026",
    description: "Glam hub services for Toronto Caribana.",
    longDescription:
      "Caribana is North America's biggest Caribbean carnival, and our Toronto glam hub is on the road with you. Full makeup, hair, festival gems and body art for the Grand Parade and weekend fetes.",
    image: torontoImg,
    cta: "Book Toronto Glam",
    highlights: [
      "Grand Parade full glam",
      "Fete makeup packages",
      "Festival hair & braids",
      "Gems, lashes and shimmer",
    ],
    metaTitle: "Toronto Caribana Makeup & Glam Services 2026 | Carnival Glam Hub",
    metaDescription:
      "Toronto Caribana 2026 glam hub — full carnival makeup, hair, gems and body art for the Grand Parade. Book your slot today.",
  },
  {
    slug: "trinidad",
    name: "Trinidad Carnival",
    shortName: "Trinidad",
    date: "Feb–Mar 2027",
    description: "Upcoming glam services for Trinidad Carnival — Port of Spain.",
    longDescription:
      "Trinidad Carnival 2027 packages opening soon. Join the waitlist for j'ouvert, Monday wear and Carnival Tuesday road glam in Port of Spain.",
    image: trinidadImg,
    cta: "Join Trinidad Waitlist",
    upcoming: true,
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