
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-forum-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-forum-primary to-forum-secondary bg-clip-text text-transparent">
                ChatterBox
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A community platform for sharing knowledge and collaborating on projects.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/discussions" className="text-muted-foreground hover:text-foreground">
                  Discussions
                </Link>
              </li>
              <li>
                <Link to="/tags" className="text-muted-foreground hover:text-foreground">
                  Tags
                </Link>
              </li>
              <li>
                <Link to="/users" className="text-muted-foreground hover:text-foreground">
                  Users
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/guidelines" className="text-muted-foreground hover:text-foreground">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40">
          <p className="text-xs text-center text-muted-foreground">
            © {new Date().getFullYear()} ChatterBox. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
