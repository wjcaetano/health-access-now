
import React, { useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUnreadNotifications, useMarkNotificationAsRead } from '@/hooks/useNotifications';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function NotificationBell() {
  const { user } = useAuth();
  const { data: notifications = [] } = useUnreadNotifications();
  const markAsRead = useMarkNotificationAsRead();
  
  // Listener já está ativo no AppLayout, não precisa duplicar aqui

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead.mutate(notificationId);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-accent">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
            >
              {notifications.length > 9 ? '9+' : notifications.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b bg-background">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Notificações</h3>
            {notifications.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {notifications.length} nova{notifications.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                Nenhuma notificação nova
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Você está em dia! 🎉
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 border-b hover:bg-accent cursor-pointer transition-colors"
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getTypeColor(notification.type)}`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
