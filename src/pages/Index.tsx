
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the users page instead of "/"
    navigate("/users");
  }, [navigate]);

  return null;
};

export default Index;
