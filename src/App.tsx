import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import FloatingWhatsApp from "@/components/landing/FloatingWhatsApp";
import ChatWidget from "@/components/landing/ChatWidget";
import RouteTracker from "@/components/RouteTracker";
import { getWixRedirectTarget } from "@/lib/wixRedirects";
import Index from "./pages/Index.tsx";
import Reviews from "./pages/Reviews.tsx";
import About from "./pages/About.tsx";
import CarnivalMakeup from "./pages/services/CarnivalMakeup.tsx";
import CarnivalPhotoshoot from "./pages/services/CarnivalPhotoshoot.tsx";
import CarnivalHair from "./pages/services/CarnivalHair.tsx";
import GettingDressed from "./pages/services/GettingDressed.tsx";
import CarnivalShuttle from "./pages/services/CarnivalShuttle.tsx";
import FAQ from "./pages/FAQ.tsx";
import Press from "./pages/Press.tsx";
import TrinidadCarnival2027 from "./pages/TrinidadCarnival2027.tsx";
import AmazonStore from "./pages/AmazonStore.tsx";
import Blogs from "./pages/Blogs.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import AirliftProblem from "./pages/blog/AirliftProblem.tsx";
import CarnivalMakeupWorthIt from "./pages/blog/CarnivalMakeupWorthIt.tsx";
import BookEarly from "./pages/blog/BookEarly.tsx";
import Destination from "./pages/Destination.tsx";
import Auth from "./pages/Auth.tsx";
import Admin from "./pages/Admin.tsx";
import BookingConfirmed from "./pages/BookingConfirmed.tsx";
import BookingCalculator from "./pages/BookingCalculator.tsx";
import StationRentals from "./pages/StationRentals.tsx";
import Policies from "./pages/Policies.tsx";
import NotFound from "./pages/NotFound.tsx";

import {
  BestCarnivalMakeupTrinidad,
  BestCarnivalMakeupJamaica,
  BestCarnivalMakeupMiami,
} from "./pages/BestCarnivalMakeup.tsx";

const queryClient = new QueryClient();

// Redirect Wix legacy /post/:slug URLs. Curated map first (high-traffic
// posts mapped to their current canonical target); fall back to the
// generic /blogs/:slug pattern for slugs not in the map.
const WixPostRedirect = () => {
  const { slug } = useParams();
  const mapped = getWixRedirectTarget(slug);
  return <Navigate to={mapped ?? `/blogs/${slug ?? ""}`} replace />;
};

// Render the Destination landing page for a fixed slug (short SEO aliases).
const DestinationAlias = ({ slug }: { slug: string }) => <Destination slugOverride={slug} />;

// Redirect /destinations/:slug → /:slug (short SEO slug)
const DestinationsSlugRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/${slug ?? ""}`} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/about" element={<About />} />
          <Route path="/services/carnival-makeup" element={<CarnivalMakeup />} />
          <Route path="/services/carnival-photoshoot" element={<CarnivalPhotoshoot />} />
          <Route path="/services/carnival-hair" element={<CarnivalHair />} />
          <Route path="/services/getting-dressed" element={<GettingDressed />} />
          <Route path="/services/carnival-shuttle" element={<CarnivalShuttle />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/press" element={<Press />} />
          <Route path="/trinidad-carnival-2027" element={<TrinidadCarnival2027 />} />
          <Route path="/amazon-store" element={<AmazonStore />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route
            path="/blogs/caribbean-carnival-has-an-airlift-problem"
            element={<AirliftProblem />}
          />
          <Route
            path="/blogs/is-professional-carnival-makeup-worth-it"
            element={<CarnivalMakeupWorthIt />}
          />
          <Route
            path="/blogs/how-far-in-advance-to-book-carnival-makeup"
            element={<BookEarly />}
          />
          <Route path="/blogs/:slug" element={<BlogPost />} />
          {/* Wix legacy URL pattern → new blog URLs */}
          <Route path="/post/:slug" element={<WixPostRedirect />} />
          {/* Legacy /blog and /blog/post/:slug → new /blogs paths */}
          <Route path="/blog" element={<Navigate to="/blogs" replace />} />
          <Route path="/blog/post/:slug" element={<WixPostRedirect />} />
          <Route path="/blog/:slug" element={<WixPostRedirect />} />
          {/* /destinations/:slug → redirect to short slug */}
          <Route
            path="/destinations/:slug"
            element={<DestinationsSlugRedirect />}
          />
          {/* Locale-prefixed legacy URLs */}
          <Route path="/fr/toronto" element={<Navigate to="/toronto" replace />} />
          {/* Direct slug aliases for SEO */}
          <Route path="/jamaica" element={<DestinationAlias slug="jamaica" />} />
          <Route path="/trinidad" element={<DestinationAlias slug="trinidad" />} />
          <Route path="/trinidad-and-tobago" element={<Navigate to="/trinidad" replace />} />
          <Route path="/tobago" element={<DestinationAlias slug="tobago" />} />
          <Route path="/antigua" element={<DestinationAlias slug="antigua" />} />
          <Route path="/antigua-and-barbuda" element={<Navigate to="/antigua" replace />} />
          <Route path="/barbados" element={<DestinationAlias slug="barbados" />} />
          <Route path="/grenada" element={<DestinationAlias slug="grenada" />} />
          <Route path="/st-lucia" element={<Navigate to="/saint-lucia" replace />} />
          <Route path="/saint-lucia" element={<DestinationAlias slug="saint-lucia" />} />
          <Route path="/stlucia" element={<Navigate to="/saint-lucia" replace />} />
          <Route path="/saintlucia" element={<Navigate to="/saint-lucia" replace />} />
          <Route path="/miami" element={<DestinationAlias slug="miami" />} />
          <Route path="/toronto" element={<DestinationAlias slug="toronto" />} />
          <Route path="/guyana" element={<DestinationAlias slug="guyana" />} />
          <Route path="/epic-cruise" element={<DestinationAlias slug="epic-cruise" />} />
          <Route path="/epic" element={<Navigate to="/epic-cruise" replace />} />
          <Route path="/atlanta" element={<Navigate to="/#destinations" replace />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/booking-confirmed" element={<BookingConfirmed />} />
          <Route path="/thank-you" element={<BookingConfirmed />} />
          <Route path="/booking-calculator" element={<BookingCalculator />} />
          <Route path="/station-rentals" element={<StationRentals />} />
          <Route path="/best-carnival-makeup-trinidad" element={<BestCarnivalMakeupTrinidad />} />
          <Route path="/best-carnival-makeup-jamaica" element={<BestCarnivalMakeupJamaica />} />
          <Route path="/best-carnival-makeup-miami" element={<BestCarnivalMakeupMiami />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingWhatsApp />
        <ChatWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
