
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, Bell } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface NotificationDropdownProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    fetchNotifications 
  } = useNotifications();

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'mention':
        return '@';
      case 'reply':
        return '↩️';
      case 'upvote':
        return '👍';
      case 'system':
        return '🔔';
      default:
        return '•';
    }
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div /> {/* Empty div as we're controlling this externally */}
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7 px-2"
              onClick={() => markAllAsRead()}
            >
              <Check className="mr-1 h-3 w-3" />
              Mark all as read
            </Button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="py-6 text-center">
            <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2 opacity-40" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="space-y-1">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={notification.link || '#'}
                  className={`flex items-start p-3 text-sm transition-colors rounded-md hover:bg-muted ${
                    notification.isRead ? 'opacity-70' : 'bg-accent/10'
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex-shrink-0 mr-3">
                    {notification.from ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={notification.from.avatar} alt={notification.from.name} />
                        <AvatarFallback>{notification.from.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={notification.isRead ? 'font-normal' : 'font-medium'}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="ml-2 mt-1 h-2 w-2 bg-forum-highlight rounded-full" />
                  )}
                </Link>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
