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
import { homeFaqSchema } from "@/data/homeFaqs";

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

// The home page FAQ has one source: src/data/homeFaqs.ts. The visible
// accordion and this JSON-LD render from the same array.
const faqSchema = homeFaqSchema;

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
