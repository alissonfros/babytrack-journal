
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Páginas
import Index from "./pages/Index";
import BabiesPage from "./pages/BabiesPage";
import NewBabyPage from "./pages/NewBabyPage";
import BabyDetailPage from "./pages/BabyDetailPage";
import VaccinesPage from "./pages/VaccinesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/babies" element={<BabiesPage />} />
            <Route path="/baby/new" element={<NewBabyPage />} />
            <Route path="/baby/:id" element={<BabyDetailPage />} />
            <Route path="/vaccines" element={<VaccinesPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
