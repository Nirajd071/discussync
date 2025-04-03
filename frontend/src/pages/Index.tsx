
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import MainLayout from "@/components/Layout/MainLayout";
import ApiConnectionTest from "@/components/ApiConnectionTest";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Add a small delay for a smoother transition
    const redirectTimer = setTimeout(() => {
      // Redirect to login if not authenticated, otherwise to users page
      if (isAuthenticated) {
        navigate("/discussions");
      } else {
        navigate("/login");
      }
    }, 5000); // Increased time to allow testing the API connection

    return () => clearTimeout(redirectTimer);
  }, [navigate, isAuthenticated]);

  return (
    <MainLayout>
      <div className="h-[60vh] w-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Welcome to DiscussSync</h1>
          <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
          <p className="text-lg text-muted-foreground animate-pulse">Redirecting in a few seconds...</p>
        </div>
        
        {/* API Connection Test Component */}
        <div className="w-full max-w-md">
          <ApiConnectionTest />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
