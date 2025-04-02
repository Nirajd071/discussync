import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Github, Twitter, Linkedin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-emerald-100 dark:border-emerald-800/30 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60 py-8">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <MessageSquare className="h-6 w-6 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                DiscuSync
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A platform for sharing projects and fostering meaningful discussions among developers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-emerald-600 hover:text-emerald-700 transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-emerald-600 hover:text-emerald-700 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-emerald-600 hover:text-emerald-700 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4 text-emerald-900 dark:text-emerald-100">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/discussions" className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Discussions
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/tags" className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Tags
                </Link>
              </li>
              <li>
                <Link to="/users" className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Users
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4 text-emerald-900 dark:text-emerald-100">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6 bg-emerald-100 dark:bg-emerald-800/30" />

        <p className="text-xs text-center text-muted-foreground">
          © {new Date().getFullYear()} DiscuSync. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
