
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, FileUp, Tag, Users } from 'lucide-react';

interface NavigationProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isMobile = false, onItemClick = () => {} }) => {
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
            className="text-sm font-medium flex items-center gap-2" 
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
          className="text-foreground/70 hover:text-foreground flex items-center gap-1"
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
