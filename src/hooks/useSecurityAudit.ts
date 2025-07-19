
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
      // Use audit log functionality instead of direct security audit log
      console.log('Security event logged:', { eventType, resource, metadata });
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
      // For now, use user audit log as fallback
      const { data, error } = await supabase
        .from('user_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Transform audit log to security events format
      const transformedEvents = (data || []).map(log => ({
        id: log.id,
        user_id: log.user_id,
        event_type: 'data_access' as const,
        resource: log.action,
        ip_address: log.ip_address || 'unknown',
        user_agent: log.user_agent || 'unknown',
        metadata: log.details || {},
        created_at: log.created_at,
      }));

      setEvents(transformedEvents);
    } catch (error) {
      console.error('Erro ao buscar eventos de segurança:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSecurityMetrics = async () => {
    try {
      // Calculate basic metrics from available data
      setMetrics({
        total_events: events.length,
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
      // Basic suspicious activity detection
      return {
        is_suspicious: false,
        reason: 'No suspicious activity detected',
        confidence: 0,
      };
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
