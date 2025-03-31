
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationDropdownProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ 
  open, 
  onOpenChange,
  trigger 
}) => {
  const { notifications, markAllAsRead } = useNotifications();
  
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Notifications</h4>
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-1" /> Mark all as read
          </Button>
        </div>
        
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <Link 
                  key={notification.id} 
                  to={notification.link || '#'} 
                  className={`block p-3 rounded-md text-sm ${notification.isRead ? 'bg-background' : 'bg-muted'}`}
                  onClick={() => onOpenChange(false)}
                >
                  <div className="font-medium">{notification.type}</div>
                  <div className="text-muted-foreground">{notification.message}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {notification.createdAt.toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
