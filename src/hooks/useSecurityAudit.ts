
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface SecurityEvent {
  id: string;
  user_id: string;
  event_type: 'login' | 'logout' | 'access_denied' | 'data_access' | 'data_modification';
  resource: string;
  ip_address: string;
  user_agent: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface SecurityMetrics {
  total_events: number;
  failed_logins: number;
  suspicious_activities: number;
  data_breaches: number;
}

export function useSecurityAudit() {
  const { user } = useAuth();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    total_events: 0,
    failed_logins: 0,
    suspicious_activities: 0,
    data_breaches: 0,
  });
  const [loading, setLoading] = useState(false);

  const logSecurityEvent = async (
    eventType: SecurityEvent['event_type'],
    resource: string,
    metadata: Record<string, any> = {}
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('security_audit_log').insert({
        user_id: user.id,
        event_type: eventType,
        resource,
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent,
        metadata,
      });

      if (error) {
        console.error('Erro ao registrar evento de segurança:', error);
      }
    } catch (error) {
      console.error('Erro ao registrar evento de segurança:', error);
    }
  };

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  };

  const fetchSecurityEvents = async (filters?: {
    startDate?: string;
    endDate?: string;
    eventType?: string;
    userId?: string;
  }) => {
    setLoading(true);
    try {
      let query = supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
      if (filters?.eventType) {
        query = query.eq('event_type', filters.eventType);
      }
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setEvents(data || []);
    } catch (error) {
      console.error('Erro ao buscar eventos de segurança:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSecurityMetrics = async () => {
    try {
      const { data, error } = await supabase.rpc('get_security_metrics');

      if (error) throw error;

      setMetrics(data || {
        total_events: 0,
        failed_logins: 0,
        suspicious_activities: 0,
        data_breaches: 0,
      });
    } catch (error) {
      console.error('Erro ao buscar métricas de segurança:', error);
    }
  };

  const detectSuspiciousActivity = async () => {
    try {
      const { data, error } = await supabase.rpc('detect_suspicious_activity', {
        user_id: user?.id
      });

      if (error) throw error;

      if (data?.is_suspicious) {
        await logSecurityEvent('access_denied', 'suspicious_activity_detected', {
          reason: data.reason,
          confidence: data.confidence,
        });
      }

      return data;
    } catch (error) {
      console.error('Erro ao detectar atividade suspeita:', error);
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchSecurityEvents();
      fetchSecurityMetrics();
    }
  }, [user]);

  return {
    events,
    metrics,
    loading,
    logSecurityEvent,
    fetchSecurityEvents,
    fetchSecurityMetrics,
    detectSuspiciousActivity,
  };
}
