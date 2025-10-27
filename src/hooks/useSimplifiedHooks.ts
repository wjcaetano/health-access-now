// Hooks simplificados para dados centralizados (sem filtros de tenant)
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Hook para dados de organizações
export function useOrganizacoes() {
  return useQuery({
    queryKey: ["organizacoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizacoes")
        .select("*")
        .order("nome");
      
      if (error) throw error;
      return data;
    },
  });
}

// Hook simplificado para métricas globais
export function useMetricasGlobais() {
  return useQuery({
    queryKey: ["metricas-globais"],
    queryFn: async () => {
      // Busca dados básicos de vendas, clientes e prestadores (SEM FILTRO DE UNIDADE)
      const [vendas, clientes, prestadores] = await Promise.all([
        supabase.from("vendas").select("valor_total"),
        supabase.from("clientes").select("id"),
        supabase.from("prestadores").select("id").eq("ativo", true)
      ]);

      return {
        totalVendas: vendas.data?.length || 0,
        faturamentoTotal: vendas.data?.reduce((sum, v) => sum + Number(v.valor_total), 0) || 0,
        totalClientes: clientes.data?.length || 0,
        totalPrestadores: prestadores.data?.length || 0
      };
    },
  });
}