import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Bell, PlusCircle, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import NotificationDropdown from '@/components/NotificationDropdown';
import { useIsMobile } from '@/hooks/use-mobile';

// Import components
import Logo from './Logo';
import Navigation from './Navigation';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';

const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const isMobile = useIsMobile();
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100 dark:border-emerald-800/30 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60 shadow-sm">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Logo />
          {!isMobile && <Navigation />}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <Link to="/discussions/new">
                <Button 
                  size="sm" 
                  className="hidden md:flex bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white group"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> New Discussion
                </Button>
              </Link>

              <NotificationDropdown 
                open={notificationsOpen} 
                onOpenChange={setNotificationsOpen}
                trigger={
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Notifications"
                    className="relative border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/30 dark:hover:bg-emerald-950/20"
                  >
                    <Bell className="h-4 w-4 text-emerald-600" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                }
              />

              <UserMenu />
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                asChild 
                className="hidden md:inline-flex text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
              >
                <Link to="/login">Log in</Link>
              </Button>
              <Button 
                className="hidden md:inline-flex bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white group" 
                asChild
              >
                <Link to="/register" className="flex items-center">
                  Sign up
                  <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </>
          )}

          {isMobile && <MobileMenu />}
        </div>
      </div>
    </header>
  );
};

export default Header;
