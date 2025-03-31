
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface TagBadgeProps {
  tag: string;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  asLink?: boolean;
}

const TagBadge: React.FC<TagBadgeProps> = ({ 
  tag, 
  count, 
  size = 'md', 
  className = '',
  asLink = true
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  const badge = (
    <Badge 
      variant="secondary" 
      className={`rounded-md font-normal hover:bg-muted ${sizeClasses[size]} ${className}`}
    >
      {tag}
      {count !== undefined && <span className="ml-1 text-muted-foreground">({count})</span>}
    </Badge>
  );

  if (asLink) {
    return (
      <Link to={`/discussions?tag=${tag}`}>
        {badge}
      </Link>
    );
  }

  return badge;
};

export default TagBadge;
