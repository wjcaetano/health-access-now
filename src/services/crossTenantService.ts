
import { supabase } from "@/integrations/supabase/client";

export interface TenantEvent {
  id: string;
  sourceTenatId: string;
  targetTenantId: string;
  eventType: string;
  payload: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export interface NotificationMessage {
  tenantId: string;
  userId?: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  data?: any;
}

export class CrossTenantService {
  // Sistema de eventos entre contextos
  static async publishEvent(event: Omit<TenantEvent, 'id' | 'status' | 'createdAt'>) {
    const { data, error } = await supabase.functions.invoke('cross-tenant-events', {
      body: {
        action: 'publish',
        event
      }
    });

    if (error) throw error;
    return data;
  }

  static async subscribeToEvents(tenantId: string, eventTypes: string[]) {
    const { data, error } = await supabase.functions.invoke('cross-tenant-events', {
      body: {
        action: 'subscribe',
        tenantId,
        eventTypes
      }
    });

    if (error) throw error;
    return data;
  }

  // Sistema de webhooks para sincronização
  static async registerWebhook(tenantId: string, url: string, events: string[]) {
    const { data, error } = await supabase
      .from('tenant_webhooks')
      .insert([{
        tenant_id: tenantId,
        url,
        events,
        active: true,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async triggerWebhook(webhookId: string, payload: any) {
    const { data, error } = await supabase.functions.invoke('webhook-trigger', {
      body: {
        webhookId,
        payload
      }
    });

    if (error) throw error;
    return data;
  }

  // Sistema de mensagens assíncronas
  static async sendAsyncMessage(fromTenantId: string, toTenantId: string, message: any) {
    const { data, error } = await supabase.functions.invoke('async-messaging', {
      body: {
        action: 'send',
        fromTenantId,
        toTenantId,
        message
      }
    });

    if (error) throw error;
    return data;
  }

  static async processMessageQueue(tenantId: string) {
    const { data, error } = await supabase.functions.invoke('async-messaging', {
      body: {
        action: 'process',
        tenantId
      }
    });

    if (error) throw error;
    return data;
  }

  // Sistema de notificações cross-tenant
  static async sendCrossTenantNotification(notification: NotificationMessage) {
    const { data, error } = await supabase.functions.invoke('cross-tenant-notifications', {
      body: {
        action: 'send',
        notification
      }
    });

    if (error) throw error;
    return data;
  }

  static async broadcastToAllTenants(message: Omit<NotificationMessage, 'tenantId'>) {
    const { data, error } = await supabase.functions.invoke('cross-tenant-notifications', {
      body: {
        action: 'broadcast',
        message
      }
    });

    if (error) throw error;
    return data;
  }

  // Sincronização de dados entre tenants
  static async syncDataBetweenTenants(sourceTenantId: string, targetTenantId: string, dataType: string, filters?: any) {
    const { data, error } = await supabase.functions.invoke('tenant-data-sync', {
      body: {
        sourceTenantId,
        targetTenantId,
        dataType,
        filters
      }
    });

    if (error) throw error;
    return data;
  }

  // Gateway para roteamento entre tenants
  static async routeRequest(targetTenantId: string, endpoint: string, data: any) {
    const { data: result, error } = await supabase.functions.invoke('tenant-gateway', {
      body: {
        targetTenantId,
        endpoint,
        data
      }
    });

    if (error) throw error;
    return result;
  }
}
