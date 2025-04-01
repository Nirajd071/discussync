
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <MessageSquare className="h-6 w-6 text-red-500" />
      <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
        DiscuSync
      </span>
    </Link>
  );
};

export default Logo;
