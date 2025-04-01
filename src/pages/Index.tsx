
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import MainLayout from "@/components/Layout/MainLayout";

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
    }, 300);

    return () => clearTimeout(redirectTimer);
  }, [navigate, isAuthenticated]);

  return (
    <MainLayout>
      <div className="h-[60vh] w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
          <p className="text-lg text-muted-foreground animate-pulse">Redirecting...</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
