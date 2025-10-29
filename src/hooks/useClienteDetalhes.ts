import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useClienteDetalhes(clienteId: string | null) {
  // Query do cliente
  const clienteQuery = useQuery({
    queryKey: ['cliente', clienteId],
    queryFn: async () => {
      if (!clienteId) return null;
      
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', clienteId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!clienteId,
  });

  // Query de vendas do cliente
  const vendasQuery = useQuery({
    queryKey: ['vendas', 'cliente', clienteId],
    queryFn: async () => {
      if (!clienteId) return [];
      
      const { data, error } = await supabase
        .from('vendas')
        .select(`
          *,
          vendas_servicos(
            *,
            servicos(nome, categoria),
            prestadores(nome)
          )
        `)
        .eq('cliente_id', clienteId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!clienteId,
  });

  // Query de agendamentos do cliente
  const agendamentosQuery = useQuery({
    queryKey: ['agendamentos', 'cliente', clienteId],
    queryFn: async () => {
      if (!clienteId) return [];
      
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          servicos(nome, categoria),
          prestadores(nome)
        `)
        .eq('cliente_id', clienteId)
        .order('data_agendamento', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!clienteId,
  });

  // Query de orçamentos do cliente
  const orcamentosQuery = useQuery({
    queryKey: ['orcamentos', 'cliente', clienteId],
    queryFn: async () => {
      if (!clienteId) return [];
      
      const { data, error } = await supabase
        .from('orcamentos')
        .select(`
          *,
          servicos(nome, categoria),
          prestadores(nome)
        `)
        .eq('cliente_id', clienteId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!clienteId,
  });

  return {
    cliente: clienteQuery.data,
    isLoadingCliente: clienteQuery.isLoading,
    vendas: vendasQuery.data || [],
    isLoadingVendas: vendasQuery.isLoading,
    agendamentos: agendamentosQuery.data || [],
    isLoadingAgendamentos: agendamentosQuery.isLoading,
    orcamentos: orcamentosQuery.data || [],
    isLoadingOrcamentos: orcamentosQuery.isLoading,
  };
}
