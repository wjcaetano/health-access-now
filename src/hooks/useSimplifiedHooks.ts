// Hooks simplificados para resolver problemas de tipos complexos
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Hook simplificado para dados básicos das unidades
export function useUnidadeData(unidadeId?: string) {
  return useQuery({
    queryKey: ["unidade-data", unidadeId],
    queryFn: async () => {
      if (!unidadeId) return null;
      
      const { data, error } = await supabase
        .from("unidades")
        .select("*")
        .eq("id", unidadeId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!unidadeId,
  });
}

// Hook simplificado para métricas básicas
export function useUnidadeMetrics(unidadeId?: string) {
  return useQuery({
    queryKey: ["unidade-metrics", unidadeId],
    queryFn: async () => {
      if (!unidadeId) return null;
      
      // Busca dados básicos de vendas, clientes e prestadores
      const [vendas, clientes, prestadores] = await Promise.all([
        supabase.from("vendas").select("valor_total").eq("unidade_id", unidadeId),
        supabase.from("clientes").select("id").eq("unidade_id", unidadeId),
        supabase.from("prestadores").select("id").eq("unidade_id", unidadeId).eq("ativo", true)
      ]);

      return {
        totalVendas: vendas.data?.length || 0,
        faturamentoMensal: vendas.data?.reduce((sum, v) => sum + Number(v.valor_total), 0) || 0,
        clientesAtivos: clientes.data?.length || 0,
        prestadoresAtivos: prestadores.data?.length || 0
      };
    },
    enabled: !!unidadeId,
  });
}