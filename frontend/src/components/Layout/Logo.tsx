import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <MessageSquare className="h-6 w-6 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
      <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
        DiscuSync
      </span>
    </Link>
  );
};

export default Logo;
