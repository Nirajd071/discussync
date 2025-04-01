
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Add a small delay for a smoother transition
    const redirectTimer = setTimeout(() => {
      // Redirect to login if not authenticated, otherwise to users page
      if (isAuthenticated) {
        navigate("/users");
      } else {
        navigate("/login");
      }
    }, 300);

    return () => clearTimeout(redirectTimer);
  }, [navigate, isAuthenticated]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-background to-primary/10">
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
        <p className="text-lg text-muted-foreground animate-pulse">Redirecting...</p>
      </div>
    </div>
  );
};

export default Index;
