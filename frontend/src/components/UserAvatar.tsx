
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

  // Generate display name from first_name and last_name if name is not available
  const displayName = user.name ||
    (user.first_name && user.last_name ?
      `${user.first_name} ${user.last_name}` :
      (user.first_name || user.username));

  const avatar = (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={user.avatar || undefined} alt={displayName} />
      <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
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
          <span className={`font-medium ${nameClasses[size]}`}>{displayName}</span>
          <span className="text-xs text-muted-foreground ml-1">@{user.username}</span>
        </div>
      )}
    </Link>
  );
};

export default UserAvatar;
