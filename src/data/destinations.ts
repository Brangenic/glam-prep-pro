import guyanaImg from "@/assets/carnival-4.jpg";
import { getHubTier, getHubInclusions, TIER_LABEL } from "@/data/hubTiers";

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
      "Our Jamaica Carnival Full Service Glam Hub is based at the Jamaica Pegasus Hotel, Kingston. We deliver full makeup, hair, gem application, body paint and lash services so you can hit the road flawless. Our Caribbean-trained artists specialise in long-wear, sweat-resistant carnival looks built for the Jamaica heat.",
    image: "https://www.dropbox.com/scl/fi/a2s2gnuk6k1zurq8296ee/IMG_6662.jpg?rlkey=l0ekybyz3r68kohd6bbxjx2ro&raw=1",
    cta: "Book Jamaica Glam",
    objectPosition: "center 30%",
    highlights: [
      "Full carnival makeup with sweat-resistant finish",
      "Gem and feather application",
      "Hair styling and braiding",
      "Lash application and body paint",
    ],
    metaTitle:
      "Jamaica Carnival Makeup 2027 | Sweat-Proof Glam | Glam Hub",
    metaDescription:
      "Book Jamaica Carnival 2027 makeup, hair, bronzing, shuttle, photoshoot and reels at our Full Service Glam Hub in Kingston. Trusted by 15,000+ masqueraders since 2017.",
  },
  {
    slug: "saint-lucia",
    name: "Saint Lucia Carnival",
    shortName: "Saint Lucia",
    date: "20–21 July 2026",
    description: "Glam Hub Lite for Saint Lucia Carnival.",
    longDescription:
      "Our Saint Lucia Carnival Glam Hub Lite is set up with packages for road march, j'ouvert and fete looks. Sweat-resistant road makeup, j'ouvert paint and shimmer, eye gems and festival lashes, plus a photoshoot and reels, a changing room, and coffee, tea and light refreshments. Get matched with a senior artist for your Glam Hub Lite carnival experience.",
    image: "https://www.dropbox.com/scl/fi/wvkuyil1teg9kdvl6wdbp/Alliyah.png?rlkey=q8zy5e0rd8zbtpb2bi2yh6imc&dl=1",
    cta: "Book Saint Lucia Glam",
    objectPosition: "50% 20%",
    highlights: [
      "Road march full glam",
      "J'ouvert paint and shimmer",
      "Eye gems and festival lashes",
      "Photoshoot and reels in the lounge",
    ],
    metaTitle:
      "Saint Lucia Carnival Makeup 2026 | Sweat-Proof Glam | Glam Hub",
    metaDescription:
      "Book sweat-resistant Saint Lucia Carnival 2026 makeup with a photoshoot and reels at our Glam Hub Lite. Trusted by 15,000+ masqueraders since 2017. Limited slots, secure yours.",
  },
  {
    slug: "antigua",
    name: "Antigua Carnival",
    shortName: "Antigua",
    date: "4 August 2026",
    description: "Carnival glam services for Antigua Carnival.",
    longDescription:
      "Antigua Carnival is one of the Caribbean's most colourful festivals, and our Glam Hub Lite keeps you camera-ready from j'ouvert to last lap. Premium sweat-resistant makeup, gems, body art and shimmer, plus a photoshoot and reels in the lounge.",
    image: "https://www.dropbox.com/scl/fi/zj9aswskvl80vunhkhdcf/Chloe%20J.png?rlkey=yxp73i1uv8pcwpuink46ty6mv&dl=1",
    cta: "Book Antigua Glam",
    objectPosition: "50% 20%",
    highlights: [
      "Full carnival makeup",
      "Gem and rhinestone designs",
      "Body paint and shimmer",
      "Photoshoot and reels in the lounge",
    ],
    metaTitle:
      "Antigua Carnival Makeup 2026 | Sweat-Proof Glam | Glam Hub",
    metaDescription:
      "Book sweat-resistant Antigua Carnival 2026 makeup with a photoshoot and reels at our Glam Hub Lite. Trusted by 15,000+ masqueraders since 2017. Limited slots, secure yours.",
  },
  {
    slug: "grenada",
    name: "Grenada Carnival",
    shortName: "Grenada",
    date: "10 – 11 August 2026",
    description: "Premium glam services for Grenada Spicemas.",
    longDescription:
      "Spicemas is unmatched, and our Grenada Glam Hub Lite matches the energy. Full sweat-resistant makeup, gems, lashes and j'ouvert paint by our trained Caribbean carnival artists, plus a photoshoot and reels in the lounge.",
    image: "https://www.dropbox.com/scl/fi/taonoqg2p6faph4jipzhr/AALiyah.png?rlkey=jwxhfig9y16l6kn2573nkuggh&dl=1",
    cta: "Book Grenada Glam",
    objectPosition: "50% 20%",
    highlights: [
      "Spicemas full glam",
      "J'ouvert paint and oil packages",
      "Festival gems and lashes",
      "Photoshoot and reels in the lounge",
    ],
    metaTitle:
      "Grenada Spicemas Makeup 2026 | Sweat-Proof Glam | Glam Hub",
    metaDescription:
      "Book sweat-resistant Grenada Spicemas 2026 makeup with a photoshoot and reels at our Glam Hub Lite. Trusted by 15,000+ masqueraders since 2017. Limited slots, secure yours.",
  },
  {
    slug: "barbados",
    name: "Barbados Crop Over",
    shortName: "Barbados",
    date: "3 August 2026",
    description: "Glam Hub Lite services for Barbados Crop Over.",
    longDescription:
      "Crop Over is the Caribbean's biggest summer carnival, and our Barbados Glam Hub Lite is fully booked every season for a reason. Get road-ready with sweat-resistant Grand Kadooment makeup, Foreday Morning paint, gems, lashes and shimmer, plus a photoshoot and reels, a changing room, and coffee, tea and light refreshments in the lounge.",
    image: "https://www.dropbox.com/scl/fi/4a52okz83gxh171qyhfjc/Dania.png?rlkey=q3figf3ty5abs9gdie4rtjcow&dl=1",
    cta: "Book Barbados Glam",
    objectPosition: "50% 20%",
    highlights: [
      "Grand Kadooment full glam",
      "Foreday Morning paint",
      "Gems, lashes and shimmer",
      "Photoshoot and reels in the lounge",
    ],
    metaTitle:
      "Barbados Crop Over Makeup 2026 | Sweat-Proof Glam | Glam Hub",
    metaDescription:
      "Book sweat-resistant Barbados Crop Over 2026 makeup with a photoshoot and reels at our Glam Hub Lite. Trusted by 15,000+ masqueraders since 2017. Limited slots, secure yours.",
  },
  {
    slug: "miami",
    name: "Miami Carnival",
    shortName: "Miami",
    date: "11 October 2026",
    description: "Glam hub services for Miami Carnival.",
    longDescription:
      "Our Miami Carnival Full Service Glam Hub serves the entire Miami Carnival season, from pre-carnival fetes through Columbus Day weekend. Full sweat-resistant makeup, hair, gems and body art by our pro carnival team, with a photoshoot and reels in the lounge. There is no shuttle in Miami this season.",
    image: "https://www.dropbox.com/scl/fi/x4z9o06d4h5ite4v2ph4g/Kayla.png?rlkey=o33o2vlxhcqidxgewnhp4wuh0&dl=1",
    cta: "Book Miami Glam",
    objectPosition: "50% 20%",
    highlights: [
      "Full road glam packages",
      "Fete-ready makeup",
      "Festival hair styling",
      "Gems, lashes and body paint",
    ],
    metaTitle:
      "Miami Carnival Makeup 2026 | Sweat-Proof Glam | Glam Hub",
    metaDescription:
      "Book Miami Carnival 2026 makeup, hair, bronzing, photoshoot and reels at our Full Service Glam Hub. No shuttle in Miami this season. Trusted by 15,000+ masqueraders since 2017.",
  },
  {
    slug: "toronto",
    name: "Toronto Caribana",
    shortName: "Toronto",
    date: "1 August 2026",
    description: "Glam hub services for Toronto Caribana.",
    longDescription:
      "Caribana is North America's biggest Caribbean carnival, and our Toronto Glam Hub Lite is on the road with you. Sweat-resistant Grand Parade and fete makeup, festival gems, lashes and body art, plus a photoshoot and reels in the lounge.",
    image: "https://www.dropbox.com/scl/fi/tnghsl2n83e111g3b6ffs/Krystal%20Pitt.png?rlkey=nyhzn9cf43lwlsqjpa0hif5pk&dl=1",
    cta: "Book Toronto Glam",
    objectPosition: "50% 20%",
    highlights: [
      "Grand Parade full glam",
      "Fete makeup packages",
      "Gems, lashes and shimmer",
      "Photoshoot and reels in the lounge",
    ],
    metaTitle: "Toronto Carnival Makeup & Glam 2026 | Glam Hub",
    metaDescription:
      "Toronto Caribana glam from our Glam Hub Lite. Sweat-resistant carnival makeup with a photoshoot and reels. Book your Caribana look now.",
  },
  {
    slug: "trinidad",
    name: "Trinidad Carnival",
    shortName: "Trinidad",
    date: "Monday 8 & Tuesday 9 February 2027",
    description:
      "Trinidad Carnival 2027 hair, makeup and photos from the Hilton Hotel, two minutes from the Savannah. Bookings are open.",
    longDescription:
      "Trinidad Carnival 2027 hair, makeup and photos from the Hilton Hotel, two minutes from the Savannah. Shuttle service from the Hilton, getting dressed assistance, and refreshments and snacks included. Bookings are open — book now for Carnival Monday 8 February and Carnival Tuesday 9 February 2027.",
    image: "https://www.dropbox.com/scl/fi/onz3y4le6o3odlfa2kvyo/Mala.png?rlkey=df6azxcg4aqlwko4tce3ewqk7&dl=1",
    cta: "Book Trinidad Glam",
    upcoming: false,
    objectPosition: "50% 20%",
    highlights: [
      "Hair, makeup and photos from the Hilton Hotel",
      "Two minutes from the Savannah",
      "Shuttle service from the Hilton",
      "Getting dressed assistance",
      "Refreshments and snacks included",
      "Carnival Monday 8 and Tuesday 9 February 2027",
    ],
    metaTitle:
      "Trinidad Carnival Makeup, Hair & Photoshoots | Carnival Glam Hub",
    metaDescription:
      "Trinidad Carnival makeup, hair, photoshoots, getting-dressed and shuttle from one Port of Spain lounge. Trusted by 15,000+ masqueraders since 2017.",
  },
  {
    slug: "guyana",
    name: "Guyana Carnival",
    shortName: "Guyana",
    date: "May 2026",
    description: "Glam Hub Lite services for Guyana Carnival.",
    longDescription:
      "Guyana Carnival brings Mashramani energy to the road, and our Guyana Glam Hub Lite keeps you flawless from fete to road march. Sweat-resistant makeup, gems, lashes and body art by our Caribbean-trained carnival artists, plus a photoshoot and reels, a changing room, and coffee, tea and light refreshments in the lounge.",
    image: guyanaImg,
    cta: "Book Guyana Glam",
    highlights: [
      "Full road carnival glam",
      "Gem and rhinestone application",
      "Body paint and shimmer",
      "Photoshoot and reels in the lounge",
    ],
    metaTitle: "Guyana Carnival Makeup & Glam 2026 | Glam Hub",
    metaDescription:
      "Book Guyana Carnival makeup with a photoshoot and reels at our Glam Hub Lite. Sweat-resistant carnival glam by professional Caribbean artists.",
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
    metaTitle: "Epic Cruise Carnival Makeup & Glam 2027 | Glam Hub",
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
  const tier = getHubTier(d.slug);
  const tierLabel = tier ? TIER_LABEL[tier] : null;
  const inclusions = getHubInclusions(d.slug) ?? d.highlights;
  const inclusionText = inclusions.map((h) => h.toLowerCase()).join(", ");

  const tierFaq: Faq[] = tierLabel
    ? [
        {
          question: `Is ${loc} a Full Service Glam Hub or a Glam Hub Lite?`,
          answer:
            tier === "full"
              ? `${loc} is a ${tierLabel}. That means ${inclusionText}${d.slug === "miami" ? ". There is no shuttle in Miami this season" : ""}. Full Service Glam Hubs run in Jamaica, Trinidad and Miami.`
              : `${loc} is a ${tierLabel}. Glam Hub Lite covers ${inclusionText} only, with no getting dressed, seamstress, bag and wing check, shuttle, hair, bronzing, alcohol or breakfast. Our Full Service Glam Hubs, which add those services, run in Jamaica, Trinidad and Miami.`,
        },
      ]
    : [];

  return [
    {
      question: `Where can I book ${loc} carnival glam?`,
      answer: `You can book ${loc} carnival glam directly with Carnival Glam Hub through our online booking platform at carnivalglamhub.masos.app/events. We are the leading carnival glam service for ${event}, delivered by professional Caribbean-trained artists.`,
    },
    ...tierFaq,
    {
      question: `When is ${event} in ${date.includes("2027") ? "2027" : "2026"}?`,
      answer: `${event} ${d.upcoming ? "takes place" : "is scheduled for"} ${date}. Carnival Glam Hub appointments run across the carnival weekend. Spaces fill quickly, so we recommend booking at least 4 to 6 weeks in advance.`,
    },
    {
      question: `What's included in a ${loc} carnival glam package?`,
      answer: `Our ${loc} carnival glam packages include ${inclusionText}. Every package is performed by a senior Caribbean carnival makeup artist using long-wear, sweat-resistant products designed for full-day road performance.`,
    },
    {
      question: `How much does ${loc} carnival makeup cost?`,
      answer: `${loc} carnival makeup pricing varies by package. Live pricing and availability for every ${loc} package is shown on our booking page at carnivalglamhub.masos.app/events.`,
    },
    {
      question: `Do you offer j'ouvert paint and body art for ${event}?`,
      answer: `Yes. J'ouvert paint, shimmer, oil and body art are part of our ${loc} carnival glam menu at every Carnival Glam Hub, Full Service and Glam Hub Lite alike, because it is makeup work. Our artists use professional, skin-safe carnival paints that hold up to heat, sweat and water on the road.`,
    },
    {
      question: `How early should I book ${loc} carnival glam?`,
      answer: `For ${event} (${date}), we recommend booking your ${loc} carnival glam appointment at least 4 to 6 weeks ahead. Peak road march slots sell out first every season.`,
    },
    {
      question: `Are your ${loc} carnival makeup artists professional?`,
      answer: `Every Carnival Glam Hub artist working ${event} is a vetted, professional Caribbean carnival makeup artist with multi-season experience in long-wear, photo-ready road glam. We service masqueraders across all major bands in ${loc}.`,
    },
  ];
}