
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";

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
  const { currentTenant } = useTenant();
  
  return useQuery({
    queryKey: [VENDAS_QUERY_KEY, currentTenant?.id, limit],
    queryFn: async () => {
      let query = supabase
        .from("vendas")
        .select(VENDAS_SELECT)
        .order("created_at", { ascending: false })
        .limit(limit);
      
      if (currentTenant?.id) {
        query = query.eq("tenant_id", currentTenant.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    enabled: !!currentTenant?.id,
  });
}

export function useVendasPorCliente(clienteId: string, limit = 20) {
  const { currentTenant } = useTenant();
  
  return useQuery({
    queryKey: [VENDAS_QUERY_KEY, "cliente", clienteId, currentTenant?.id, limit],
    queryFn: async () => {
      let query = supabase
        .from("vendas")
        .select(VENDAS_SELECT)
        .eq("cliente_id", clienteId)
        .order("created_at", { ascending: false })
        .limit(limit);
      
      if (currentTenant?.id) {
        query = query.eq("tenant_id", currentTenant.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    enabled: !!clienteId && !!currentTenant?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
