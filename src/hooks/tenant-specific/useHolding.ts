
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { useCache } from "@/hooks/useCache";

export function useHoldingData() {
  const { currentTenant } = useTenant();
  
  return useQuery({
    queryKey: ["holding", "data", currentTenant?.id],
    queryFn: async () => {
      if (!currentTenant || currentTenant.tipo !== 'holding') {
        throw new Error('Acesso negado: contexto holding necessário');
      }

      const { data, error } = await supabase
        .from("tenants")
        .select(`
          *,
          franquias:tenants!tenant_pai_id(
            id,
            nome,
            codigo,
            tipo,
            status,
            created_at
          )
        `)
        .eq("id", currentTenant.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!currentTenant && currentTenant.tipo === 'holding',
  });
}

export function useHoldingMetrics() {
  const { currentTenant } = useTenant();
  
  const { data: metrics, loading, error } = useCache(
    `holding-metrics-${currentTenant?.id}`,
    async () => {
      if (!currentTenant || currentTenant.tipo !== 'holding') {
        throw new Error('Acesso negado: contexto holding necessário');
      }

      // Buscar franquias filhas
      const { data: franquias, error: franquiasError } = await supabase
        .from("tenants")
        .select("id, nome")
        .eq("tenant_pai_id", currentTenant.id);

      if (franquiasError) throw franquiasError;

      // Agregar métricas de todas as franquias
      const metricas = {
        totalFranquias: franquias?.length || 0,
        totalVendas: 0,
        faturamentoTotal: 0,
        clientesAtivos: 0
      };

      return metricas;
    },
    { ttl: 5 * 60 * 1000 } // 5 minutes cache
  );

  return { data: metrics, loading, error };
}

export function useCreateHoldingTenant() {
  const queryClient = useQueryClient();
  const { currentTenant } = useTenant();
  
  return useMutation({
    mutationFn: async (tenantData: any) => {
      if (!currentTenant || currentTenant.tipo !== 'holding') {
        throw new Error('Acesso negado: apenas holdings podem criar tenants');
      }

      const { data, error } = await supabase
        .from("tenants")
        .insert([{
          ...tenantData,
          tenant_pai_id: currentTenant.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holding"] });
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
}
