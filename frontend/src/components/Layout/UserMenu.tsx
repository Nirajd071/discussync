import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-8 w-8 rounded-full ring-2 ring-emerald-200 dark:ring-emerald-800/30 hover:ring-emerald-300 dark:hover:ring-emerald-700/30"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-emerald-100 dark:bg-emerald-800/30 text-emerald-600 dark:text-emerald-400">
              {user?.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 border-emerald-100 dark:border-emerald-800/30" 
        align="end" 
        forceMount
      >
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">{user?.name}</p>
            <p className="text-xs text-muted-foreground">@{user?.username}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-emerald-100 dark:bg-emerald-800/30" />
        <DropdownMenuItem asChild>
          <Link 
            to="/profile" 
            className="cursor-pointer w-full hover:bg-emerald-50 dark:hover:bg-emerald-950/20 focus:bg-emerald-50 dark:focus:bg-emerald-950/20"
          >
            <UserIcon className="mr-2 h-4 w-4 text-emerald-600" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={logout}
          className="hover:bg-emerald-50 dark:hover:bg-emerald-950/20 focus:bg-emerald-50 dark:focus:bg-emerald-950/20"
        >
          <LogOut className="mr-2 h-4 w-4 text-emerald-600" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
