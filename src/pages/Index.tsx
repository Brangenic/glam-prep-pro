import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import PressBar from "@/components/landing/PressBar";
import Problem from "@/components/landing/Problem";
import Services from "@/components/landing/Services";
import Destinations from "@/components/landing/Destinations";
import Gallery from "@/components/landing/Gallery";
import Testimonials from "@/components/landing/Testimonials";
import Founder from "@/components/landing/Founder";
import FAQ from "@/components/landing/FAQ";
import AmazonStoreFeature from "@/components/landing/AmazonStoreFeature";
import CarnivalGuides from "@/components/landing/CarnivalGuides";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "BeautySalon"],
  name: "Carnival Glam Hub",
  legalName: "Carnival Glam Hub",
  url: "https://www.carnivalglamhub.com",
  logo: "https://www.carnivalglamhub.com/logo.png",
  description:
    "Premium Carnival morning concierge for travelling masqueraders. Trusted by 15,000+ masqueraders since 2017.",
  foundingDate: "2017-01-01",
  founder: [
    { "@type": "Person", name: "Gabby Glam", alternateName: "Gabrielle Waite" },
    { "@type": "Person", name: "Kibwe McGann" },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "43",
    bestRating: "5",
  },
  areaServed: [
    { "@type": "Place", name: "Trinidad" },
    { "@type": "Place", name: "Jamaica" },
    { "@type": "Place", name: "Barbados" },
    { "@type": "Place", name: "Grenada" },
    { "@type": "Place", name: "Saint Lucia" },
    { "@type": "Place", name: "Antigua" },
    { "@type": "Place", name: "Miami" },
    { "@type": "Place", name: "Toronto" },
    { "@type": "Place", name: "Guyana" },
    { "@type": "Place", name: "Saint Vincent" },
    { "@type": "Place", name: "Cayman Islands" },
    { "@type": "Place", name: "Atlanta" },
    { "@type": "Place", name: "United Kingdom" },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "bookings@carnivalglamhub.com",
    contactType: "customer service",
    areaServed: "Caribbean",
    availableLanguage: ["English"],
  },
  sameAs: [
    "https://www.instagram.com/carnivalglamhub",
    "https://www.facebook.com/carnivalglamhub",
    "https://www.tiktok.com/@carnivalglamhub",
    "https://www.youtube.com/@carnivalglamhub",
    "https://www.pinterest.com/carnivalglamhub",
    "https://www.amazon.com/shop/carnivalglamhub",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Carnival Glam Hub",
  url: "https://www.carnivalglamhub.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        "https://www.carnivalglamhub.com/blogs?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I book Carnival Glam Hub?", acceptedAnswer: { "@type": "Answer", text: "Select your destination and choose your glam package. You will receive confirmation after booking." } },
    { "@type": "Question", name: "How far in advance should I book carnival makeup?", acceptedAnswer: { "@type": "Answer", text: "Carnival morning slots fill quickly. We recommend booking as early as possible to secure your preferred time." } },
    { "@type": "Question", name: "What is included in a Carnival Glam Hub appointment?", acceptedAnswer: { "@type": "Answer", text: "Services depend on the package selected but typically include makeup, hair styling, and costume dressing assistance." } },
    { "@type": "Question", name: "Where does the carnival glam take place?", acceptedAnswer: { "@type": "Answer", text: "Each destination has a designated glam hub location shared after booking confirmation." } },
    { "@type": "Question", name: "Can I book carnival glam for a group?", acceptedAnswer: { "@type": "Answer", text: "Yes. Group bookings are available and recommended for friends or band sections." } },
    { "@type": "Question", name: "Do carnival glam slots sell out?", acceptedAnswer: { "@type": "Answer", text: "Yes. We limit appointments per carnival morning to maintain a premium experience. Early booking is strongly recommended." } },
    { "@type": "Question", name: "How much does professional Carnival makeup cost?", acceptedAnswer: { "@type": "Answer", text: "Carnival Glam Hub offers tiered options to suit every masquerader, from an entry road-ready access package through to full celebrity-artist glam. Makeup packages and add-ons are listed on each service page and in our quote calculator." } },
    { "@type": "Question", name: "Can I do my own Carnival makeup without experience?", acceptedAnswer: { "@type": "Answer", text: "You can, but Carnival makeup must survive heat, sweat, and hours on the road. Most masqueraders choose a professional for sweat-resistant, photo-ready results that last all day." } },
    { "@type": "Question", name: "What is the difference between regular makeup and Carnival makeup?", acceptedAnswer: { "@type": "Answer", text: "Carnival makeup is built for endurance: sweat-resistant, long-wear, and designed for bright outdoor light and constant photography, unlike everyday makeup which is not made to last through a full day of dancing in the sun." } },
  ],
};

const founderPersonSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Gabby Glam",
  alternateName: "Gabrielle Waite",
  jobTitle: "Celebrity Makeup Artist and Co-Founder",
  description:
    "Jamaican celebrity makeup artist, founder of Gabby Glam Cosmetics, and co-founder of Carnival Glam Hub. Known for soft-glam looks on public figures including Sheryl Lee Ralph and Davina Bennett.",
  worksFor: {
    "@type": "BeautySalon",
    name: "Carnival Glam Hub",
    url: "https://www.carnivalglamhub.com",
  },
  knowsAbout: [
    "Carnival makeup",
    "Celebrity makeup",
    "Soft glam",
    "Sweat-resistant makeup",
  ],
  sameAs: [
    "https://gabbyglamcosmetics.com",
    "https://www.instagram.com/carnivalglamhub",
  ],
};

const Index = () => (
  <div className="min-h-screen bg-background text-foreground">
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(founderPersonSchema) }}
    />
    <Navbar />
    <main>
      <Hero />
      <SocialProof />
      <PressBar />
      <Problem />
      <Services />
      <Destinations />
      <Gallery />
      <Testimonials />
      <Founder />
      <AmazonStoreFeature />
      <CarnivalGuides />
      <FAQ />
      <FinalCTA />
    </main>
    <Footer />
    <StickyMobileCTA />
  </div>
);

export default Index;
