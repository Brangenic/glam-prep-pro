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
import AmazonStore from "./pages/AmazonStore.tsx";
import Blogs from "./pages/Blogs.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import Destination from "./pages/Destination.tsx";
import Auth from "./pages/Auth.tsx";
import Admin from "./pages/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

// Redirect Wix legacy /post/:slug URLs to the new blog path
const WixPostRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/blogs/${slug ?? ""}`} replace />;
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
          <Route path="/amazon-store" element={<AmazonStore />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogPost />} />
          {/* Wix legacy URL pattern → new blog URLs */}
          <Route path="/post/:slug" element={<WixPostRedirect />} />
          <Route path="/destinations/:slug" element={<Destination />} />
          {/* Direct slug aliases for SEO */}
          <Route path="/jamaica" element={<Navigate to="/destinations/jamaica" replace />} />
          <Route path="/trinidad" element={<Navigate to="/destinations/trinidad" replace />} />
          <Route path="/trinidad-and-tobago" element={<Navigate to="/destinations/trinidad" replace />} />
          <Route path="/tobago" element={<Navigate to="/destinations/trinidad" replace />} />
          <Route path="/antigua" element={<Navigate to="/destinations/antigua" replace />} />
          <Route path="/antigua-and-barbuda" element={<Navigate to="/destinations/antigua" replace />} />
          <Route path="/barbados" element={<Navigate to="/destinations/barbados" replace />} />
          <Route path="/grenada" element={<Navigate to="/destinations/grenada" replace />} />
          <Route path="/st-lucia" element={<Navigate to="/destinations/saint-lucia" replace />} />
          <Route path="/saint-lucia" element={<Navigate to="/destinations/saint-lucia" replace />} />
          <Route path="/stlucia" element={<Navigate to="/destinations/saint-lucia" replace />} />
          <Route path="/miami" element={<Navigate to="/destinations/miami" replace />} />
          <Route path="/toronto" element={<Navigate to="/destinations/toronto" replace />} />
          <Route path="/atlanta" element={<Navigate to="/#destinations" replace />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingWhatsApp />
        <ChatWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
