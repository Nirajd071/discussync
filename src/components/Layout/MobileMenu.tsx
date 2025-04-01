
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from './Navigation';
import { useAuth } from '@/contexts/AuthContext';

const MobileMenu: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleItemClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 py-4 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Navigation isMobile onItemClick={handleItemClick} />
          
          {isAuthenticated ? (
            <Link to="/discussions/new" className="text-sm font-medium flex items-center gap-2 mt-4" onClick={handleItemClick}>
              <PlusCircle className="h-4 w-4" />
              New Discussion
            </Link>
          ) : (
            <div className="flex flex-col space-y-4 mt-4">
              <Link to="/login" className="text-sm font-medium" onClick={handleItemClick}>
                Log in
              </Link>
              <Link to="/register" className="text-sm font-medium" onClick={handleItemClick}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MobileMenu;
