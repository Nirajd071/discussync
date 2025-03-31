
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated, otherwise to users page
    if (isAuthenticated) {
      navigate("/users");
    } else {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  return null;
};

export default Index;
