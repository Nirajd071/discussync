import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronRight } from 'lucide-react';

const CtaSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20">
      <div className="container">
        <div className="relative p-8 md:p-12 rounded-2xl overflow-hidden animate-fade-in">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800" />
          
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] animate-grid-flow" />
          
          <div className="relative text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to Join the Discussion?
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90">
              Become part of our growing community today and start connecting with other developers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {isAuthenticated ? (
                <>
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="bg-white text-red-600 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300"
                    asChild
                  >
                    <Link to="/discussions/new">
                      Start a Discussion <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10 transition-all duration-300"
                    asChild
                  >
                    <Link to="/projects">
                      Share a Project <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="bg-white text-red-600 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300"
                    asChild
                  >
                    <Link to="/register">
                      Sign Up Now <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10 transition-all duration-300"
                    asChild
                  >
                    <Link to="/about">
                      Learn More <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
