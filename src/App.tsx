import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import FloatingWhatsApp from "@/components/landing/FloatingWhatsApp";
import Index from "./pages/Index.tsx";
import Reviews from "./pages/Reviews.tsx";
import AmazonStore from "./pages/AmazonStore.tsx";
import Blogs from "./pages/Blogs.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import Auth from "./pages/Auth.tsx";
import Admin from "./pages/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/amazon-store" element={<AmazonStore />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogPost />} />
          <Route path="/jamaica" element={<Navigate to="/#destinations" replace />} />
          <Route path="/trinidad" element={<Navigate to="/#destinations" replace />} />
          <Route path="/trinidad-and-tobago" element={<Navigate to="/#destinations" replace />} />
          <Route path="/antigua" element={<Navigate to="/#destinations" replace />} />
          <Route path="/antigua-and-barbuda" element={<Navigate to="/#destinations" replace />} />
          <Route path="/barbados" element={<Navigate to="/#destinations" replace />} />
          <Route path="/grenada" element={<Navigate to="/#destinations" replace />} />
          <Route path="/tobago" element={<Navigate to="/#destinations" replace />} />
          <Route path="/st-lucia" element={<Navigate to="/#destinations" replace />} />
          <Route path="/saint-lucia" element={<Navigate to="/#destinations" replace />} />
          <Route path="/stlucia" element={<Navigate to="/#destinations" replace />} />
          <Route path="/atlanta" element={<Navigate to="/#destinations" replace />} />
          <Route path="/miami" element={<Navigate to="/#destinations" replace />} />
          <Route path="/toronto" element={<Navigate to="/#destinations" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingWhatsApp />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
