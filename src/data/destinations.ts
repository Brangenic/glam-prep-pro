import guyanaImg from "@/assets/carnival-4.jpg";
// Placeholder hero for Tobago: one of our own Glam Hub carnival images,
// not used as the hero of any other destination. Swap this for real
// Tobago photography as soon as we have it.
import tobagoImg from "@/assets/carnival-8.jpg";
import { getTerritoryPricing } from "@/data/territoryPricing";
import { getHubTier, getHubInclusions, TIER_LABEL, MIAMI_VENUE_NOTE, MIAMI_TRAVEL_WARNING, MIAMI_VENUE_FAQ } from "@/data/hubTiers";
import { hasSeasonPassed, passedSeasonYear } from "@/data/seasons";

export const BOOKING_URL = "https://carnivalglamhub.masos.app/events";

export type Destination = {
  slug: string;
  name: string;
  shortName: string;
  date: string;
  description: string;
  longDescription: string;
  image: string;
  /** Overrides the generated alt text when the hero is not location specific. */
  imageAlt?: string;
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
    date: "Sunday 4 April 2027",
    description: "Premium glam hub services for Jamaica Carnival.",
    longDescription:
      "Our Jamaica Carnival Full Service Glam Hub is based at the Jamaica Pegasus Hotel, Kingston. We deliver full makeup, hair, gem application, body paint and lash services so you can hit the road flawless. Our Caribbean-trained artists specialise in long-wear, sweat-resistant carnival looks built for the Jamaica heat.",
    image: "/images/destinations/jamaica-meliza-hernandez.jpg",
    cta: "Book Jamaica Glam",
    objectPosition: "50% 25%",
    highlights: [
      "Full carnival makeup with sweat-resistant finish",
      "Gem and feather application",
      "Hair styling and braiding",
      "Lash application and body paint",
    ],
    metaTitle:
      "Jamaica Carnival Makeup 2027 | Sweat-Proof Glam | Glam Hub",
    metaDescription:
      "Jamaica Carnival, Sunday 4 April 2027. Makeup, hair, bronzing, shuttle and photoshoot at our Full Service Glam Hub in Kingston. Book your morning slot.",
  },
  {
    slug: "saint-lucia",
    name: "Saint Lucia Carnival",
    shortName: "Saint Lucia",
    date: "20–21 July 2026",
    description: "Glam Hub Lite for Saint Lucia Carnival.",
    longDescription:
      "Our Saint Lucia Carnival Glam Hub Lite is set up with packages for road march, j'ouvert and fete looks. Sweat-resistant road makeup, j'ouvert paint and shimmer, eye gems and festival lashes, plus a photoshoot, a changing room, and coffee, tea and light refreshments. Get matched with a senior artist for your Glam Hub Lite carnival experience.",
    image: "https://www.dropbox.com/scl/fi/wvkuyil1teg9kdvl6wdbp/Alliyah.png?rlkey=q8zy5e0rd8zbtpb2bi2yh6imc&dl=1",
    cta: "Book Saint Lucia Glam",
    objectPosition: "50% 20%",
    highlights: [
      "Road march full glam",
      "J'ouvert paint and shimmer",
      "Eye gems and festival lashes",
      "Photoshoot in the lounge",
    ],
    metaTitle:
      "Saint Lucia Carnival Makeup 2026 | Sweat-Proof Glam | Glam Hub",
    metaDescription:
      "Sweat-resistant Saint Lucia Carnival 2026 makeup with a photoshoot at our Glam Hub Lite. Trusted by 15,000+ masqueraders since 2017. Slots are limited.",
  },
  {
    slug: "antigua",
    name: "Antigua Carnival",
    shortName: "Antigua",
    date: "4 August 2026",
    description: "Carnival glam services for Antigua Carnival.",
    longDescription:
      "Antigua Carnival is one of the Caribbean's most colourful festivals, and our Glam Hub Lite keeps you camera-ready from j'ouvert to last lap. Premium sweat-resistant makeup, gems, body art and shimmer, plus a photoshoot in the lounge.",
    image: "https://www.dropbox.com/scl/fi/zj9aswskvl80vunhkhdcf/Chloe%20J.png?rlkey=yxp73i1uv8pcwpuink46ty6mv&dl=1",
    cta: "Book Antigua Glam",
    objectPosition: "50% 20%",
    highlights: [
      "Full carnival makeup",
      "Gem and rhinestone designs",
      "Body paint and shimmer",
      "Photoshoot in the lounge",
    ],
    metaTitle:
      "Antigua Carnival Makeup 2026 | Sweat-Proof Glam | Glam Hub",
    metaDescription:
      "Sweat-resistant Antigua Carnival 2026 makeup with a photoshoot at our Glam Hub Lite. Trusted by 15,000+ masqueraders since 2017. Slots are limited.",
  },
  {
    slug: "grenada",
    name: "Grenada Carnival",
    shortName: "Grenada",
    date: "Monday 9 & Tuesday 10 August 2027",
    description: "Premium glam services for Grenada Spicemas.",
    longDescription:
      "Spicemas is unmatched, and our Grenada Glam Hub Lite matches the energy. Full sweat-resistant makeup, gems, lashes and j'ouvert paint by our trained Caribbean carnival artists, plus a photoshoot in the lounge.",
    image: "https://www.dropbox.com/scl/fi/taonoqg2p6faph4jipzhr/AALiyah.png?rlkey=jwxhfig9y16l6kn2573nkuggh&dl=1",
    cta: "Book Grenada Glam",
    objectPosition: "50% 20%",
    highlights: [
      "Spicemas full glam",
      "J'ouvert paint and oil packages",
      "Festival gems and lashes",
      "Photoshoot in the lounge",
    ],
    metaTitle:
      "Grenada Spicemas Makeup 2027 | Sweat-Proof Glam | Glam Hub",
    metaDescription:
      "Spicemas 2027 is 9 and 10 August. Pre-registration is open at US$50 for sweat-resistant Grenada makeup at our Glam Hub Lite. Trusted since 2017.",
  },
  {
    slug: "tobago",
    name: "Tobago Carnival",
    shortName: "Tobago",
    date: "30 October – 1 November 2026",
    description: "Glam Hub Lite for Tobago Carnival.",
    longDescription:
      "Our Tobago Carnival Glam Hub Lite is set up with packages for road march, j'ouvert and fete looks, built around the October Carnival that closes the regional calendar. Sweat-resistant road makeup that holds through the whole day, j'ouvert paint and shimmer, eye gems and festival lashes, plus a photoshoot, a changing room, and coffee, tea and light refreshments. Get matched with a senior artist for your Glam Hub Lite carnival experience.",
    // Placeholder imagery of our own work, not a Tobago location shot.
    image: tobagoImg,
    imageAlt:
      "Carnival Glam Hub artist finishing a sweat-resistant road march makeup look with gems and lashes",
    cta: "Book Tobago Glam",
    objectPosition: "50% 20%",
    highlights: [
      "Road march full glam",
      "J'ouvert paint and shimmer",
      "Eye gems and festival lashes",
      "Photoshoot in the lounge",
    ],
    metaTitle:
      "Tobago Carnival Makeup 2026 | Sweat-Proof Glam | Glam Hub",
    metaDescription:
      "Sweat-resistant Tobago Carnival 2026 makeup with a photoshoot at our Glam Hub Lite. The Awakening runs 30 October to 1 November 2026. Slots are limited.",
  },
  {
    slug: "barbados",
    name: "Barbados Crop Over",
    shortName: "Barbados",
    date: "3 August 2026",
    description: "Glam Hub Lite services for Barbados Crop Over.",
    longDescription:
      "Crop Over is the Caribbean's biggest summer carnival, and our Barbados Glam Hub Lite is fully booked every season for a reason. Get road-ready with sweat-resistant Grand Kadooment makeup, Foreday Morning paint, gems, lashes and shimmer, plus a photoshoot, a changing room, and coffee, tea and light refreshments in the lounge.",
    image: "https://www.dropbox.com/scl/fi/4a52okz83gxh171qyhfjc/Dania.png?rlkey=q3figf3ty5abs9gdie4rtjcow&dl=1",
    cta: "Book Barbados Glam",
    objectPosition: "50% 20%",
    highlights: [
      "Grand Kadooment full glam",
      "Foreday Morning paint",
      "Gems, lashes and shimmer",
      "Photoshoot in the lounge",
    ],
    metaTitle:
      "Barbados Crop Over Makeup 2026 | Sweat-Proof Glam | Glam Hub",
    metaDescription:
      "Sweat-resistant Barbados Crop Over 2026 makeup with a photoshoot at our Glam Hub Lite. Trusted by 15,000+ masqueraders since 2017. Slots are limited.",
  },
  {
    slug: "miami",
    name: "Miami Carnival",
    shortName: "Miami",
    date: "11 October 2026",
    description: "Glam hub services for Miami Carnival.",
    longDescription:
      "Our Miami Carnival Full Service Glam Hub serves the entire Miami Carnival season, from pre-carnival fetes through Columbus Day weekend. Full sweat-resistant makeup, hair, gems and body art by our pro carnival team, with a photoshoot in the lounge. The venue and travel notice above covers the move to Broward County and the ride you will need on Carnival morning.",
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
      "Miami Carnival Makeup 2026 | Broward Venue | Glam Hub",
    metaDescription:
      "Miami Carnival 2026 has moved to Broward: Central Broward Park, Lauderhill. No shuttle this season, so plan your ride. Book makeup, hair and photoshoot.",
  },
  {
    slug: "toronto",
    name: "Toronto Caribana",
    shortName: "Toronto",
    date: "1 August 2026",
    description: "Glam hub services for Toronto Caribana.",
    longDescription:
      "Caribana is North America's biggest Caribbean carnival, and our Toronto Glam Hub Lite is on the road with you. Sweat-resistant Grand Parade and fete makeup, festival gems, lashes and body art, plus a photoshoot in the lounge.",
    image: "https://www.dropbox.com/scl/fi/tnghsl2n83e111g3b6ffs/Krystal%20Pitt.png?rlkey=nyhzn9cf43lwlsqjpa0hif5pk&dl=1",
    cta: "Book Toronto Glam",
    objectPosition: "50% 20%",
    highlights: [
      "Grand Parade full glam",
      "Fete makeup packages",
      "Gems, lashes and shimmer",
      "Photoshoot in the lounge",
    ],
    metaTitle: "Toronto Carnival Makeup & Glam 2026 | Glam Hub",
    metaDescription:
      "Toronto Caribana glam from our Glam Hub Lite. Sweat-resistant Carnival makeup, headpiece-ready hair and a photoshoot, by professional Caribbean artists.",
  },
  {
    slug: "trinidad",
    name: "Trinidad Carnival",
    shortName: "Trinidad",
    date: "Monday 8 & Tuesday 9 February 2027",
    description:
      "Trinidad Carnival 2027 hair, makeup and photos from the Hilton Hotel, two minutes from the Savannah. Bookings are open.",
    longDescription:
      "Trinidad Carnival 2027 hair, makeup and photos from the Hilton Hotel, two minutes from the Savannah. Shuttle service from the Hilton, getting dressed assistance, and refreshments and snacks included. Bookings are open, book now for Carnival Monday 8 February and Carnival Tuesday 9 February 2027.",
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
      "Trinidad Carnival Makeup, Hair & Photoshoots | Glam Hub",
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
      "Guyana Carnival brings Mashramani energy to the road, and our Guyana Glam Hub Lite keeps you flawless from fete to road march. Sweat-resistant makeup, gems, lashes and body art by our Caribbean-trained carnival artists, plus a photoshoot, a changing room, and coffee, tea and light refreshments in the lounge.",
    image: guyanaImg,
    cta: "Book Guyana Glam",
    highlights: [
      "Full road carnival glam",
      "Gem and rhinestone application",
      "Body paint and shimmer",
      "Photoshoot in the lounge",
    ],
    metaTitle: "Guyana Carnival Makeup & Glam 2026 | Glam Hub",
    metaDescription:
      "Guyana Carnival makeup with a photoshoot at our Glam Hub Lite. Sweat-resistant Carnival glam by professional Caribbean artists, trusted since 2017.",
  },
  {
    slug: "epic-cruise",
    name: "Epic Cruise, Trinidad Carnival",
    shortName: "Epic Cruise",
    date: "Returns 2028, dates to be confirmed",
    description: "Premium glam hub services for EPIC Carnival Experience masqueraders.",
    longDescription:
      "Glam Hub at sea! Carnival Glam Hub is aboard the EPIC Carnival Experience, the luxury floating hotel that sails masqueraders from San Juan, Puerto Rico straight to Trinidad Carnival. Book your makeup, hair, photoshoot, and get-dressed services exclusively for EPIC cruise masqueraders.",
    image: "https://www.dropbox.com/scl/fi/i9atucg76ieovbmkkqupg/IMG_8522.jpg?rlkey=b74ambfqu21fjbadhidkcy6u7&st=rmucsn19&dl=1",
    cta: "Ask about Epic Cruise",
    objectPosition: "50% 20%",
    highlights: [
      "Glam hub aboard the EPIC cruise ship",
      "Carnival Monday & Tuesday coverage",
      "Full makeup, hair & photoshoot",
      "Get Dressed assistance included",
    ],
    metaTitle: "Epic Cruise Carnival Glam | Returns 2028 | Glam Hub",
    metaDescription:
      "The EPIC Cruise Glam Hub returns in 2028 and dates are still to be confirmed. Register your interest with Carnival Glam Hub for the next sailing.",
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
              ? `${loc} is a ${tierLabel}. That means ${inclusionText}${d.slug === "miami" ? `. ${MIAMI_TRAVEL_WARNING} ${MIAMI_VENUE_NOTE}` : ""}. Full Service Glam Hubs run in Jamaica, Trinidad and Miami.`
              : `${loc} is a ${tierLabel}. Glam Hub Lite covers ${inclusionText} only, with no getting dressed, seamstress, overnight bag check, shuttle, hair, bronzing, reels, alcohol or breakfast. Our Full Service Glam Hubs, which add those services, run in Jamaica, Trinidad and Miami.`,
        },
      ]
    : [];

  // Miami's venue has moved to Broward County, so the venue question
  // leads its FAQ list and its FAQPage structured data.
  const venueFaq: Faq[] = d.slug === "miami" ? [MIAMI_VENUE_FAQ] : [];

  const passed = hasSeasonPassed(d.slug);
  const year = passedSeasonYear(d.slug);
  // A territory with no confirmed product list never implies a service
  // price. Grenada 2027 is pre-registration only, and the answer says so.
  const pricing = getTerritoryPricing(d.slug);
  const bookingLink = pricing?.bookingUrl?.includes("/events/")
    ? pricing.bookingUrl.replace(/^https?:\/\//, "")
    : "carnivalglamhub.masos.app/events";
  const preRegOnly = pricing ? pricing.quotable === false && Boolean(pricing.deposit) : false;

  return [
    ...venueFaq,
    {
      question: `Where can I book ${loc} carnival glam?`,
      answer: passed
        ? `${event} ${year} has wrapped, so bookings are closed for this season. You can see the looks our artists created on the road in our gallery at carnivalglamhub.com, and follow Carnival Glam Hub for ${loc} next season.`
        : `You can book ${loc} carnival glam directly with Carnival Glam Hub through our online booking platform at ${bookingLink}. We are the leading carnival glam service for ${event}, delivered by professional Caribbean-trained artists.`,
    },
    ...tierFaq,
    {
      question: `When is ${event} in ${date.includes("2027") ? "2027" : "2026"}?`,
      answer: passed
        ? `${event} ${year} took place on ${date} and the season has now finished. Carnival Glam Hub ran appointments across the carnival weekend.`
        : `${event} ${d.upcoming ? "takes place" : "is scheduled for"} ${date}. Carnival Glam Hub appointments run across the carnival weekend. Spaces fill quickly, so we recommend booking at least 4 to 6 weeks in advance.`,
    },
    {
      question: `What's included in a ${loc} carnival glam package?`,
      answer: `Our ${loc} carnival glam packages include ${inclusionText}. Every package is performed by a senior Caribbean carnival makeup artist using long-wear, sweat-resistant products designed for full-day road performance.`,
    },
    {
      question: `How much does ${loc} carnival makeup cost?`,
      answer: passed
        ? `${loc} carnival makeup pricing varies by package. Pricing for the ${year} season is closed. Rates for the next ${loc} season are confirmed when bookings reopen.`
        : preRegOnly
          ? `No ${loc} makeup, hair or photoshoot price is published yet. Pre-registration is open at US$${pricing?.deposit?.amount} per masquerader, which secures your place, and the service prices are confirmed when the ${loc} product list goes live.`
          : `${loc} carnival makeup pricing varies by package. Live pricing and availability for every ${loc} package is shown on our booking page at ${bookingLink}.`,
    },
    {
      question: `Do you offer j'ouvert paint and body art for ${event}?`,
      answer: `Yes. J'ouvert paint, shimmer, oil and body art are part of our ${loc} carnival glam menu at every Carnival Glam Hub, Full Service and Glam Hub Lite alike, because it is makeup work. Our artists use professional, skin-safe carnival paints that hold up to heat, sweat and water on the road.`,
    },
    {
      question: `How early should I book ${loc} carnival glam?`,
      answer: passed
        ? `Peak road march slots sell out first every season, so when ${loc} bookings reopen we recommend securing your appointment at least 4 to 6 weeks ahead of the parade.`
        : `For ${event} (${date}), we recommend booking your ${loc} carnival glam appointment at least 4 to 6 weeks ahead. Peak road march slots sell out first every season.`,
    },
    {
      question: `Are your ${loc} carnival makeup artists professional?`,
      answer: `Every Carnival Glam Hub artist working ${event} is a vetted, professional Caribbean carnival makeup artist with multi-season experience in long-wear, photo-ready road glam. We service masqueraders across all major bands in ${loc}.`,
    },
  ];
}