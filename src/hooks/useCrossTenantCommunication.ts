
import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { CrossTenantService, TenantEvent, NotificationMessage } from '@/services/crossTenantService';
import { useToast } from '@/hooks/use-toast';

export function useCrossTenantEvents(eventTypes: string[] = []) {
  const { currentTenant } = useTenant();
  const [events, setEvents] = useState<TenantEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const publishEvent = useCallback(async (eventType: string, payload: any, targetTenantId?: string) => {
    if (!currentTenant) return;

    try {
      await CrossTenantService.publishEvent({
        sourceTenatId: currentTenant.id,
        targetTenantId: targetTenantId || '',
        eventType,
        payload
      });

      toast({
        title: 'Evento publicado',
        description: 'Evento enviado com sucesso para outros contextos'
      });
    } catch (error) {
      toast({
        title: 'Erro ao publicar evento',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      });
    }
  }, [currentTenant, toast]);

  const subscribeToEvents = useCallback(async () => {
    if (!currentTenant || eventTypes.length === 0) return;

    setLoading(true);
    try {
      const subscription = await CrossTenantService.subscribeToEvents(currentTenant.id, eventTypes);
      console.log('Subscrito aos eventos:', eventTypes);
    } catch (error) {
      console.error('Erro ao se inscrever aos eventos:', error);
    } finally {
      setLoading(false);
    }
  }, [currentTenant, eventTypes]);

  useEffect(() => {
    subscribeToEvents();
  }, [subscribeToEvents]);

  return {
    events,
    publishEvent,
    loading
  };
}

export function useCrossTenantNotifications() {
  const { currentTenant } = useTenant();
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const { toast } = useToast();

  const sendNotification = useCallback(async (notification: Omit<NotificationMessage, 'tenantId'>, targetTenantId?: string) => {
    if (!currentTenant) return;

    try {
      await CrossTenantService.sendCrossTenantNotification({
        ...notification,
        tenantId: targetTenantId || currentTenant.id
      });

      toast({
        title: 'Notificação enviada',
        description: 'Notificação cross-tenant enviada com sucesso'
      });
    } catch (error) {
      toast({
        title: 'Erro ao enviar notificação',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      });
    }
  }, [currentTenant, toast]);

  const broadcastToAll = useCallback(async (message: Omit<NotificationMessage, 'tenantId'>) => {
    try {
      await CrossTenantService.broadcastToAllTenants(message);

      toast({
        title: 'Broadcast enviado',
        description: 'Mensagem enviada para todos os contextos'
      });
    } catch (error) {
      toast({
        title: 'Erro no broadcast',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      });
    }
  }, [toast]);

  return {
    notifications,
    sendNotification,
    broadcastToAll
  };
}

export function useTenantDataSync() {
  const { currentTenant } = useTenant();
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  const syncData = useCallback(async (targetTenantId: string, dataType: string, filters?: any) => {
    if (!currentTenant) return;

    setSyncing(true);
    try {
      await CrossTenantService.syncDataBetweenTenants(
        currentTenant.id,
        targetTenantId,
        dataType,
        filters
      );

      toast({
        title: 'Sincronização concluída',
        description: `Dados do tipo ${dataType} sincronizados com sucesso`
      });
    } catch (error) {
      toast({
        title: 'Erro na sincronização',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      });
    } finally {
      setSyncing(false);
    }
  }, [currentTenant, toast]);

  return {
    syncData,
    syncing
  };
}
