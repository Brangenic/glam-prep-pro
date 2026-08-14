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

// BeautySalon (Organization) JSON-LD is rendered statically in index.html
// to avoid duplicate structured-data on the homepage.

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
    { "@type": "Question", name: "What is included in a Carnival Glam Hub appointment?", acceptedAnswer: { "@type": "Answer", text: "A Full Service Glam Hub appointment (Jamaica, Trinidad, Miami) includes shuttle, bag and wing check including overnight, breakfast and refreshments, alcohol, makeup, hair, bronzing, photoshoot and reels, and coffee and tea. There is no shuttle in Miami this season. A Glam Hub Lite appointment, offered in all other territories, includes makeup, photoshoot and reels, and coffee and tea." } },
    { "@type": "Question", name: "Where does the carnival glam take place?", acceptedAnswer: { "@type": "Answer", text: "Each destination has a designated glam hub location shared after booking confirmation." } },
    { "@type": "Question", name: "Can I book carnival glam for a group?", acceptedAnswer: { "@type": "Answer", text: "Yes. Group bookings are available and recommended for friends or band sections." } },
    { "@type": "Question", name: "Do carnival glam slots sell out?", acceptedAnswer: { "@type": "Answer", text: "Yes. We limit appointments per carnival morning to maintain a premium experience. Early booking is strongly recommended." } },
    { "@type": "Question", name: "How much does professional Carnival makeup cost?", acceptedAnswer: { "@type": "Answer", text: "Professional Carnival makeup at Carnival Glam Hub starts from US$160, with most masqueraders spending US$200 to US$300. Celebrity-artist glam ranges US$250 to US$350, and premium looks go up to US$2,000. A road-ready access package — getting dressed, shuttle and lounge — starts at US$35." } },
    { "@type": "Question", name: "Can I do my own Carnival makeup without experience?", acceptedAnswer: { "@type": "Answer", text: "You can, but Carnival makeup must survive heat, sweat, and hours on the road. Most masqueraders choose a professional for sweat-resistant, photo-ready results that last all day." } },
    { "@type": "Question", name: "What is the difference between regular makeup and Carnival makeup?", acceptedAnswer: { "@type": "Answer", text: "Carnival makeup is built for endurance: sweat-resistant, long-wear, and designed for bright outdoor light and constant photography, unlike everyday makeup which is not made to last through a full day of dancing in the sun." } },
  ],
};

// Founder Person JSON-LD is rendered statically in index.html to avoid
// duplicate structured-data on the homepage.

const Index = () => (
  <div className="min-h-screen bg-background text-foreground">
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
