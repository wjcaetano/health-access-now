import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Hook para escutar notificações em tempo real
 * Atualiza automaticamente o cache e mostra toast quando novas notificações chegam
 */
export function useRealtimeNotifications(userId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    console.log('🔔 Iniciando listener de notificações realtime para usuário:', userId);

    // Usar um nome de canal único para evitar múltiplas inscrições
    const channelName = `notifications-${userId}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('🔔 Nova notificação recebida:', payload);

          // Invalidar cache de notificações
          queryClient.invalidateQueries({ queryKey: ['notifications'] });

          // Mostrar toast com a notificação
          const notification = payload.new as any;
          toast({
            title: notification.title,
            description: notification.message,
            variant: notification.type === 'error' ? 'destructive' : 'default',
          });
        }
      )
      .subscribe((status) => {
        console.log('📡 Status do canal de notificações:', status);
      });

    // Cleanup na desmontagem
    return () => {
      console.log('🔕 Removendo listener de notificações');
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
}
