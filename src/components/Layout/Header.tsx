
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  LogOut, 
  User as UserIcon,
  MessageSquare,
  PlusCircle
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import NotificationDropdown from '@/components/NotificationDropdown';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-forum-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-forum-primary to-forum-secondary bg-clip-text text-transparent">
              ChatterBox
            </span>
          </Link>

          {!isMobile && (
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link to="/discussions" className="text-foreground/70 hover:text-foreground">
                Discussions
              </Link>
              <Link to="/tags" className="text-foreground/70 hover:text-foreground">
                Tags
              </Link>
              <Link to="/users" className="text-foreground/70 hover:text-foreground">
                Users
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/discussions/new">
                <Button size="sm" className="hidden md:flex">
                  <PlusCircle className="mr-2 h-4 w-4" /> New Discussion
                </Button>
              </Link>

              {/* Fixed notification button that doesn't trigger React.Children.only error */}
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
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-forum-highlight text-white">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                }
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">@{user?.username}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer w-full">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {isMobile && (
                <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden md:inline-flex">
                <Link to="/login">Log in</Link>
              </Button>
              <Button className="hidden md:inline-flex" asChild>
                <Link to="/register">Sign up</Link>
              </Button>
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 py-4 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <nav className="flex flex-col space-y-4">
            <Link to="/discussions" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Discussions
            </Link>
            <Link to="/tags" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Tags
            </Link>
            <Link to="/users" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Users
            </Link>
            {isAuthenticated ? (
              <Link to="/discussions/new" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                New Discussion
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Log in
                </Link>
                <Link to="/register" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
