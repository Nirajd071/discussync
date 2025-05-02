// Toaster components are now in main.tsx
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";

// Pages
import LandingPage from "./pages/LandingPage";
import DiscussionsPage from "./pages/DiscussionsPage";
import DiscussionDetailPage from "./pages/DiscussionDetailPage";
import NewDiscussionPage from "./pages/NewDiscussionPage";
import TagsPage from "./pages/TagsPage";
import UsersPage from "./pages/UsersPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileEditPage from "./pages/ProfileEditPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotificationSettingsPage from "./pages/NotificationSettingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import FaqPage from "./pages/FaqPage";
import GuidelinesPage from "./pages/GuidelinesPage";
import AboutPage from "./pages/AboutPage";
import ProjectsPage from "./pages/ProjectsPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ApiTestPage from "./pages/ApiTestPage";

const App = () => (
  <AuthProvider>
    <WebSocketProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/index" element={<Index />} />
            <Route path="/discussions" element={<DiscussionsPage />} />
            <Route path="/discussions/new" element={<NewDiscussionPage />} />
            <Route path="/discussions/:id" element={<DiscussionDetailPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/tags" element={<TagsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:username" element={<ProfilePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<ProfileEditPage />} />
            <Route path="/notification-settings" element={<NotificationSettingsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/guidelines" element={<GuidelinesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/api-test" element={<ApiTestPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </NotificationProvider>
    </WebSocketProvider>
  </AuthProvider>
);

export default App;
