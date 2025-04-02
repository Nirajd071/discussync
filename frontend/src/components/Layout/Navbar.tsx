import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            DiscuSync
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/discussions" className="text-muted-foreground hover:text-foreground transition-colors">
            Discussions
          </Link>
          <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
            Projects
          </Link>
          <Link to="/tags" className="text-muted-foreground hover:text-foreground transition-colors">
            Tags
          </Link>
          <Link to="/users" className="text-muted-foreground hover:text-foreground transition-colors">
            Users
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          {isAuthenticated ? (
            <Button 
              variant="outline"
              className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/50"
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button 
                variant="outline"
                className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/50"
                asChild
              >
                <Link to="/login">Log in</Link>
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                asChild
              >
                <Link to="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 