import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const HeroSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-transparent" />
      
      <div className="container relative">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent animate-fade-in">
            Where ideas meet collaboration
          </h1>
          <p className="text-lg md:text-xl mb-8 text-muted-foreground animate-fade-in opacity-0" style={{ animationDelay: '200ms' }}>
            Join our community to discuss ideas, share projects, and collaborate with other passionate developers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in opacity-0" style={{ animationDelay: '400ms' }}>
            {isAuthenticated ? (
              <>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
                  asChild
                >
                  <Link to="/discussions">
                    Explore Discussions <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/50"
                  asChild
                >
                  <Link to="/projects">
                    Browse Projects <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
                  asChild
                >
                  <Link to="/register">
                    Join the Community <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/50"
                  asChild
                >
                  <Link to="/login">
                    Log In <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
