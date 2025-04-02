import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, FileUp, Tag, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isMobile = false, onItemClick = () => {} }) => {
  const location = useLocation();
  const navItems = [
    { to: '/discussions', icon: <MessageSquare className="h-4 w-4" />, label: 'Discussions' },
    { to: '/projects', icon: <FileUp className="h-4 w-4" />, label: 'Projects' },
    { to: '/tags', icon: <Tag className="h-4 w-4" />, label: 'Tags' },
    { to: '/users', icon: <Users className="h-4 w-4" />, label: 'Users' },
  ];

  if (isMobile) {
    return (
      <nav className="flex flex-col space-y-4">
        {navItems.map((item) => (
          <Link 
            key={item.to}
            to={item.to} 
            className={cn(
              "text-sm font-medium flex items-center gap-2 transition-colors",
              location.pathname === item.to
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400"
            )}
            onClick={onItemClick}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex items-center gap-6 text-sm">
      {navItems.map((item) => (
        <Link 
          key={item.to}
          to={item.to} 
          className={cn(
            "flex items-center gap-1 transition-colors",
            location.pathname === item.to
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400"
          )}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
