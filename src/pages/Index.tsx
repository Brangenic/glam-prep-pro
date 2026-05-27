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
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Carnival Glam Hub",
  legalName: "Carnival Glam Hub",
  url: "https://www.carnivalglamhub.com",
  logo: "https://www.carnivalglamhub.com/logo.png",
  description:
    "Premium Carnival morning concierge for travelling masqueraders",
  foundingDate: "2017-01-01",
  founder: {
    "@type": "Person",
    name: "Gabrielle Waite",
  },
  areaServed: [
    "Trinidad and Tobago",
    "Jamaica",
    "Miami",
    "Toronto",
    "Grenada",
    "Saint Lucia",
    "Antigua and Barbuda",
    "Barbados",
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
      <FAQ />
      <FinalCTA />
    </main>
    <Footer />
    <StickyMobileCTA />
  </div>
);

export default Index;
