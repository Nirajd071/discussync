
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import MainLayout from "@/components/Layout/MainLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-primary/10 p-6 mb-6">
          <FileQuestion className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Page not found</h1>
        <p className="text-xl text-muted-foreground mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/">Return to home</Link>
        </Button>
      </div>
    </MainLayout>
  );
};

export default NotFound;
