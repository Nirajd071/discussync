
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

// Pages
import LandingPage from "./pages/LandingPage";
import DiscussionsPage from "./pages/DiscussionsPage";
import DiscussionDetailPage from "./pages/DiscussionDetailPage";
import NewDiscussionPage from "./pages/NewDiscussionPage";
import TagsPage from "./pages/TagsPage";
import UsersPage from "./pages/UsersPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/index" element={<Index />} />
              <Route path="/discussions" element={<DiscussionsPage />} />
              <Route path="/discussions/:id" element={<DiscussionDetailPage />} />
              <Route path="/discussions/new" element={<NewDiscussionPage />} />
              <Route path="/tags" element={<TagsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/:username" element={<ProfilePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
