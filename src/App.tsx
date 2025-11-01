import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/contexts/WalletContext";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import MyCollectibles from "./pages/MyCollectibles";
import MintNFT from "./pages/MintNFT";
import DevelopersLanding from "./pages/DevelopersLanding";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import AdminPayments from "./pages/AdminPayments";
import Documentation from "./pages/Documentation";
import About from "./pages/About";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WalletProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/my-collectibles" element={<MyCollectibles />} />
            <Route path="/mint" element={<MintNFT />} />
            <Route path="/developers" element={<DevelopersLanding />} />
            <Route path="/developer-dashboard" element={<DeveloperDashboard />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;