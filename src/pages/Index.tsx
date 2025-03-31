
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-violet-900 to-black">
      <div className="animate-pulse-glow">
        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 animate-spin"></div>
      </div>
    </div>
  );
};

export default Index;
