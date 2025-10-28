import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Hook para escutar notificações em tempo real
 * Atualiza automaticamente o cache e mostra toast quando novas notificações chegam
 * IMPORTANTE: Deve ser usado apenas uma vez por aplicação (já está no AppLayout)
 */
export function useRealtimeNotifications(userId: string | undefined) {
  const queryClient = useQueryClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!userId || isSubscribedRef.current) return;

    console.log('🔔 Iniciando listener de notificações realtime para usuário:', userId);

    // Usar um nome de canal único para evitar múltiplas inscrições
    const channelName = `notifications-${userId}`;
    
    // Remover canal anterior se existir
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }
    
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
        if (status === 'SUBSCRIBED') {
          isSubscribedRef.current = true;
        }
      });

    channelRef.current = channel;

    // Cleanup na desmontagem
    return () => {
      console.log('🔕 Removendo listener de notificações');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      isSubscribedRef.current = false;
    };
  }, [userId, queryClient]);
}
