
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { useCache } from "@/hooks/useCache";

export function useUnitData() {
  const { currentTenant } = useTenant();
  
  return useQuery({
    queryKey: ["unit", "data", currentTenant?.id],
    queryFn: async () => {
      if (!currentTenant || currentTenant.tipo !== 'franquia') {
        throw new Error('Acesso negado: contexto franquia necessário');
      }

      const { data, error } = await supabase
        .from("tenants")
        .select(`
          *,
          holding:tenants!tenant_pai_id(
            id,
            nome,
            codigo
          )
        `)
        .eq("id", currentTenant.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!currentTenant && currentTenant.tipo === 'franquia',
  });
}

export function useUnitMetrics() {
  const { currentTenant } = useTenant();
  
  const { data: metrics, loading, error } = useCache(
    `unit-metrics-${currentTenant?.id}`,
    async () => {
      if (!currentTenant || currentTenant.tipo !== 'franquia') {
        throw new Error('Acesso negado: contexto franquia necessário');
      }

      const [vendas, clientes, prestadores] = await Promise.all([
        supabase.from("vendas").select("valor_total").eq("tenant_id", currentTenant.id),
        supabase.from("clientes").select("id").eq("tenant_id", currentTenant.id),
        supabase.from("prestadores").select("id").eq("tenant_id", currentTenant.id).eq("ativo", true)
      ]);

      const metricas = {
        totalVendas: vendas.data?.length || 0,
        faturamentoMensal: vendas.data?.reduce((sum, v) => sum + Number(v.valor_total), 0) || 0,
        clientesAtivos: clientes.data?.length || 0,
        prestadoresAtivos: prestadores.data?.length || 0
      };

      return metricas;
    },
    { ttl: 2 * 60 * 1000 } // 2 minutes cache
  );

  return { data: metrics, loading, error };
}

export function useUnitOperations() {
  const { currentTenant } = useTenant();
  const queryClient = useQueryClient();

  const syncWithHolding = useMutation({
    mutationFn: async (data: any) => {
      const { data: result, error } = await supabase.functions.invoke('sync-unit-data', {
        body: { tenantId: currentTenant?.id, data }
      });
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unit"] });
    }
  });

  return { syncWithHolding };
}
