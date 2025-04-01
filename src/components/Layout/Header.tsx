
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Bell, PlusCircle } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
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
                <Button size="sm" className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground">
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
                    className="relative"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground">
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
              <Button variant="ghost" asChild className="hidden md:inline-flex">
                <Link to="/login">Log in</Link>
              </Button>
              <Button className="hidden md:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <Link to="/register">Sign up</Link>
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
