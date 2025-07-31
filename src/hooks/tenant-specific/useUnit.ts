
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { useCache } from "@/hooks/useCache";

export function useUnitData() {
  const { currentTenant } = useTenant();
  
  return useQuery({
    queryKey: ["unit", "data", currentTenant?.id],
    queryFn: async () => {
      if (!currentTenant || currentTenant.tipo !== 'filial') {
        throw new Error('Acesso negado: contexto unidade necessário');
      }

      const { data, error } = await supabase
        .from("unidades")
        .select(`
          *,
          matriz:unidades!unidade_matriz_id(
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
    enabled: !!currentTenant && currentTenant.tipo === 'filial',
  });
}

export function useUnitMetrics() {
  const { currentTenant } = useTenant();
  
  const { data: metrics, loading, error } = useCache(
    `unit-metrics-${currentTenant?.id}`,
    async () => {
      if (!currentTenant || currentTenant.tipo !== 'filial') {
        throw new Error('Acesso negado: contexto unidade necessário');
      }

      const [vendas, clientes, prestadores] = await Promise.all([
        supabase.from("vendas").select("valor_total").eq("unidade_id", currentTenant.id),
        supabase.from("clientes").select("id").eq("unidade_id", currentTenant.id),
        supabase.from("prestadores").select("id").eq("unidade_id", currentTenant.id).eq("ativo", true)
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
        body: { unidadeId: currentTenant?.id, data }
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
