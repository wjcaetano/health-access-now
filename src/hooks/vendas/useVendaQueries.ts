
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const VENDAS_QUERY_KEY = "vendas";

// Query otimizada com select específico para melhor performance
const VENDAS_SELECT = `
  *,
  clientes (id, nome, cpf),
  vendas_servicos (
    *,
    servicos (nome, categoria),
    prestadores (nome)
  )
`;

export function useVendas() {
  return useQuery({
    queryKey: [VENDAS_QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendas")
        .select(VENDAS_SELECT)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useVendasPorCliente(clienteId: string) {
  return useQuery({
    queryKey: [VENDAS_QUERY_KEY, "cliente", clienteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendas")
        .select(VENDAS_SELECT)
        .eq("cliente_id", clienteId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!clienteId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
