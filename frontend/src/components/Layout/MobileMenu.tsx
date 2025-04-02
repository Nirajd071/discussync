import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, PlusCircle, ChevronRight } from 'lucide-react';
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
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleMobileMenu}
        className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20"
      >
        {mobileMenuOpen ? (
          <X className="h-5 w-5 text-emerald-600" />
        ) : (
          <Menu className="h-5 w-5 text-emerald-600" />
        )}
      </Button>

      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 md:hidden border-t border-emerald-100 dark:border-emerald-800/30 py-4 px-6 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60 shadow-lg">
          <Navigation isMobile onItemClick={handleItemClick} />
          
          {isAuthenticated ? (
            <Link 
              to="/discussions/new" 
              className="text-sm font-medium flex items-center gap-2 mt-4 text-emerald-600 hover:text-emerald-700 transition-colors group" 
              onClick={handleItemClick}
            >
              <PlusCircle className="h-4 w-4" />
              New Discussion
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <div className="flex flex-col space-y-4 mt-4">
              <Button 
                variant="ghost" 
                asChild 
                className="justify-start text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                onClick={handleItemClick}
              >
                <Link to="/login">Log in</Link>
              </Button>
              <Button 
                asChild
                className="justify-start bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white group"
                onClick={handleItemClick}
              >
                <Link to="/register" className="flex items-center">
                  Sign up
                  <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MobileMenu;
