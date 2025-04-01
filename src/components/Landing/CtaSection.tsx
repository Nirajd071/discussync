
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const CtaSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-16">
      <div className="container">
        <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-r from-red-800 to-red-600 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join the Discussion?</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Become part of our growing community today and start connecting with other developers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <>
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/discussions/new">
                    Start a Discussion
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-white hover:bg-white/10" asChild>
                  <Link to="/projects">
                    Share a Project
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/register">
                    Sign Up Now
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-white hover:bg-white/10" asChild>
                  <Link to="/about">
                    Learn More
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

export default CtaSection;
