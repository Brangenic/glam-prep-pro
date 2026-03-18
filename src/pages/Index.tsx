import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
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

const Index = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navbar />
    <main>
      <Hero />
      <SocialProof />
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
