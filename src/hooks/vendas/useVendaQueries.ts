
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const VENDAS_QUERY_KEY = "vendas";

// Query otimizada com select específico para melhor performance
const VENDAS_SELECT = `
  *,
  clientes!inner (id, nome, cpf),
  vendas_servicos!inner (
    *,
    servicos!inner (nome, categoria),
    prestadores!inner (nome)
  )
`;

export function useVendas(limit = 50) {
  return useQuery({
    queryKey: [VENDAS_QUERY_KEY, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendas")
        .select(VENDAS_SELECT)
        .order("created_at", { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });
}

export function useVendasPorCliente(clienteId: string, limit = 20) {
  return useQuery({
    queryKey: [VENDAS_QUERY_KEY, "cliente", clienteId, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendas")
        .select(VENDAS_SELECT)
        .eq("cliente_id", clienteId)
        .order("created_at", { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    },
    enabled: !!clienteId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
