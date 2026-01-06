import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Home from "./pages/Home";
import GrowthPrediction from "./pages/GrowthPrediction";
import DiseaseDetection from "./pages/DiseaseDetection";
import Encyclopedia from "./pages/Encyclopedia";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { Chatbot } from "./components/shared/Chatbot";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/growth-prediction" element={<GrowthPrediction />} />
            <Route path="/disease-detection" element={<DiseaseDetection />} />
            <Route path="/encyclopedia" element={<Encyclopedia />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Chatbot />
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
