import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ClienteDashboardData {
  proximosAgendamentos: {
    data: any[];
    isLoading: boolean;
    error: any;
  };
  historicoGuias: {
    data: any[];
    isLoading: boolean;
    error: any;
  };
  metricas: {
    totalAgendamentosFuturos: number;
    servicosRealizados: number;
    ultimaAvaliacao: number | null;
  };
}

/**
 * Hook para buscar dados do dashboard do cliente
 * Busca agendamentos futuros, histórico de guias e métricas
 */
export function useClienteDashboard(clienteId: string | undefined): ClienteDashboardData {
  const proximosAgendamentos = useQuery({
    queryKey: ['cliente-proximos-agendamentos', clienteId],
    queryFn: async () => {
      if (!clienteId) return [];
      
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          servico:servicos(nome, categoria),
          prestador:prestadores(nome, tipo, especialidades)
        `)
        .eq('cliente_id', clienteId)
        .gte('data_agendamento', new Date().toISOString().split('T')[0])
        .order('data_agendamento', { ascending: true })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: !!clienteId,
    staleTime: 30000, // 30 segundos
  });

  const historicoGuias = useQuery({
    queryKey: ['cliente-historico-guias', clienteId],
    queryFn: async () => {
      if (!clienteId) return [];
      
      const { data, error } = await supabase
        .from('guias')
        .select(`
          *,
          servico:servicos(nome, categoria),
          prestador:prestadores(nome)
        `)
        .eq('cliente_id', clienteId)
        .in('status', ['realizada', 'faturada', 'paga'])
        .order('data_realizacao', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    },
    enabled: !!clienteId,
    staleTime: 60000, // 1 minuto
  });

  const avaliacoesQuery = useQuery({
    queryKey: ['cliente-avaliacoes', clienteId],
    queryFn: async () => {
      if (!clienteId) return [];
      
      const { data, error } = await supabase
        .from('avaliacoes')
        .select('nota')
        .eq('cliente_id', clienteId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data || [];
    },
    enabled: !!clienteId,
    staleTime: 300000, // 5 minutos
  });

  return {
    proximosAgendamentos: {
      data: proximosAgendamentos.data || [],
      isLoading: proximosAgendamentos.isLoading,
      error: proximosAgendamentos.error,
    },
    historicoGuias: {
      data: historicoGuias.data || [],
      isLoading: historicoGuias.isLoading,
      error: historicoGuias.error,
    },
    metricas: {
      totalAgendamentosFuturos: proximosAgendamentos.data?.length || 0,
      servicosRealizados: historicoGuias.data?.length || 0,
      ultimaAvaliacao: avaliacoesQuery.data?.[0]?.nota || null,
    },
  };
}
