import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook completo para dados do Portal do Cliente
 * Fornece todos os dados necessários para o dashboard e páginas do cliente
 */

export function useClienteGuias(clienteId: string | undefined) {
  return useQuery({
    queryKey: ['cliente-guias', clienteId],
    queryFn: async () => {
      if (!clienteId) return [];
      
      const { data, error } = await supabase
        .from('guias')
        .select(`
          *,
          prestador:prestadores(id, nome, tipo),
          servico:servicos(id, nome, categoria, descricao),
          agendamento:agendamentos(id, data_agendamento, horario)
        `)
        .eq('cliente_id', clienteId)
        .order('data_emissao', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!clienteId,
    staleTime: 60000, // 1 minuto
  });
}

export function useClienteVendas(clienteId: string | undefined) {
  return useQuery({
    queryKey: ['cliente-vendas', clienteId],
    queryFn: async () => {
      if (!clienteId) return [];
      
      const { data, error } = await supabase
        .from('vendas')
        .select(`
          *,
          vendas_servicos(
            id,
            servico_id,
            prestador_id,
            valor,
            status,
            data_agendamento,
            horario,
            servico:servicos(nome, categoria),
            prestador:prestadores(nome, tipo)
          )
        `)
        .eq('cliente_id', clienteId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!clienteId,
    staleTime: 60000, // 1 minuto
  });
}

export function useClienteFinanceiro(clienteId: string | undefined) {
  return useQuery({
    queryKey: ['cliente-financeiro', clienteId],
    queryFn: async () => {
      if (!clienteId) return {
        totalGasto: 0,
        totalPendente: 0,
        ultimoPagamento: null
      };
      
      // Buscar todas as vendas do cliente
      const { data: vendas, error } = await supabase
        .from('vendas')
        .select('valor_total, status, created_at')
        .eq('cliente_id', clienteId);

      if (error) throw error;

      const totalGasto = vendas
        ?.filter(v => v.status === 'concluida')
        .reduce((sum, v) => sum + v.valor_total, 0) || 0;

      const totalPendente = vendas
        ?.filter(v => v.status === 'pendente')
        .reduce((sum, v) => sum + v.valor_total, 0) || 0;

      const ultimoPagamento = vendas?.length > 0 
        ? vendas[0].created_at 
        : null;

      return {
        totalGasto,
        totalPendente,
        ultimoPagamento
      };
    },
    enabled: !!clienteId,
    staleTime: 300000, // 5 minutos
  });
}

export function useClienteAvaliacoes(clienteId: string | undefined) {
  return useQuery({
    queryKey: ['cliente-avaliacoes', clienteId],
    queryFn: async () => {
      if (!clienteId) return [];
      
      const { data, error } = await supabase
        .from('avaliacoes')
        .select(`
          *,
          prestador:prestadores(nome, tipo),
          guia:guias(
            id,
            servico:servicos(nome)
          )
        `)
        .eq('cliente_id', clienteId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!clienteId,
    staleTime: 300000, // 5 minutos
  });
}
