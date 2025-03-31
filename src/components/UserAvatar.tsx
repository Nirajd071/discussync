
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { User } from '@/types';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  avatarOnly?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md', showName = false, avatarOnly = false }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const nameClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const avatar = (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
    </Avatar>
  );

  if (avatarOnly) {
    return avatar;
  }

  return (
    <Link to={`/users/${user.username}`} className="flex items-center hover:opacity-90">
      {avatar}
      {showName && (
        <div className="ml-2">
          <span className={`font-medium ${nameClasses[size]}`}>{user.name}</span>
          <span className="text-xs text-muted-foreground ml-1">@{user.username}</span>
        </div>
      )}
    </Link>
  );
};

export default UserAvatar;
