import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import FloatingWhatsApp from "@/components/landing/FloatingWhatsApp";
import ChatWidget from "@/components/landing/ChatWidget";
import RouteTracker from "@/components/RouteTracker";
import Index from "./pages/Index.tsx";
import Reviews from "./pages/Reviews.tsx";
import About from "./pages/About.tsx";
import CarnivalMakeup from "./pages/services/CarnivalMakeup.tsx";
import CarnivalPhotoshoot from "./pages/services/CarnivalPhotoshoot.tsx";
import CarnivalHair from "./pages/services/CarnivalHair.tsx";
import GettingDressed from "./pages/services/GettingDressed.tsx";
import TrinidadCarnival2027 from "./pages/TrinidadCarnival2027.tsx";
import AmazonStore from "./pages/AmazonStore.tsx";
import Blogs from "./pages/Blogs.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import Destination from "./pages/Destination.tsx";
import Auth from "./pages/Auth.tsx";
import Admin from "./pages/Admin.tsx";
import BookingConfirmed from "./pages/BookingConfirmed.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

// Redirect Wix legacy /post/:slug URLs to the new blog path
const WixPostRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/blogs/${slug ?? ""}`} replace />;
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
          <Route path="/trinidad-carnival-2027" element={<TrinidadCarnival2027 />} />
          <Route path="/amazon-store" element={<AmazonStore />} />
          <Route path="/blogs" element={<Blogs />} />
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
          <Route path="/trinidad-and-tobago" element={<DestinationAlias slug="trinidad" />} />
          <Route path="/tobago" element={<DestinationAlias slug="trinidad" />} />
          <Route path="/antigua" element={<DestinationAlias slug="antigua" />} />
          <Route path="/antigua-and-barbuda" element={<DestinationAlias slug="antigua" />} />
          <Route path="/barbados" element={<DestinationAlias slug="barbados" />} />
          <Route path="/grenada" element={<DestinationAlias slug="grenada" />} />
          <Route path="/st-lucia" element={<DestinationAlias slug="saint-lucia" />} />
          <Route path="/saint-lucia" element={<DestinationAlias slug="saint-lucia" />} />
          <Route path="/stlucia" element={<DestinationAlias slug="saint-lucia" />} />
          <Route path="/saintlucia" element={<DestinationAlias slug="saint-lucia" />} />
          <Route path="/miami" element={<DestinationAlias slug="miami" />} />
          <Route path="/toronto" element={<DestinationAlias slug="toronto" />} />
          <Route path="/guyana" element={<DestinationAlias slug="guyana" />} />
          <Route path="/epic-cruise" element={<DestinationAlias slug="epic-cruise" />} />
          <Route path="/epic" element={<DestinationAlias slug="epic-cruise" />} />
          <Route path="/atlanta" element={<Navigate to="/#destinations" replace />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/booking-confirmed" element={<BookingConfirmed />} />
          <Route path="/thank-you" element={<BookingConfirmed />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingWhatsApp />
        <ChatWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
