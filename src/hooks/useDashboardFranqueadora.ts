
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useHoldingData } from "./tenant-specific/useHolding";

export const useDashboardFranqueadora = () => {
  const { data: holdingData } = useHoldingData();

  return useQuery({
    queryKey: ["dashboard-franqueadora", holdingData?.id],
    queryFn: async () => {
      if (!holdingData || holdingData.tipo !== 'holding') {
        throw new Error('Acesso negado: contexto holding necessário');
      }

      // Buscar métricas consolidadas de todas as franquias
      const { data: franquias, error: franquiasError } = await supabase
        .from("franquias")
        .select(`
          *,
          royalties:royalties(*),
          vendas_agregadas:view_franquias_resumo(*)
        `);

      if (franquiasError) throw franquiasError;

      // Calcular métricas consolidadas
      const totalFranquias = franquias?.length || 0;
      const franquiasAtivas = franquias?.filter(f => f.status === 'ativa').length || 0;
      
      const faturamentoTotal = franquias?.reduce((total, franquia) => {
        const vendas = franquia.vendas_agregadas?.faturamento_total || 0;
        return total + Number(vendas);
      }, 0) || 0;

      const royaltiesPendentes = franquias?.reduce((total, franquia) => {
        const pendentes = franquia.royalties?.filter(r => r.status === 'pendente') || [];
        return total + pendentes.reduce((sum, r) => sum + Number(r.valor_total), 0);
      }, 0) || 0;

      return {
        totalFranquias,
        franquiasAtivas,
        faturamentoTotal,
        royaltiesPendentes,
        performanceGeral: franquiasAtivas > 0 ? (franquiasAtivas / totalFranquias) * 100 : 0,
        franquias: franquias || []
      };
    },
    enabled: !!holdingData && holdingData.tipo === 'holding',
  });
};

export const useAlertasExecutivos = () => {
  const { data: holdingData } = useHoldingData();

  return useQuery({
    queryKey: ["alertas-executivos", holdingData?.id],
    queryFn: async () => {
      if (!holdingData || holdingData.tipo !== 'holding') {
        throw new Error('Acesso negado: contexto holding necessário');
      }

      const alertas = [];

      // Buscar royalties em atraso
      const { data: royaltiesAtrasados } = await supabase
        .from("royalties")
        .select("*, franquia:franquias(nome_fantasia)")
        .eq("status", "pendente")
        .lt("data_vencimento", new Date().toISOString());

      if (royaltiesAtrasados && royaltiesAtrasados.length > 0) {
        alertas.push({
          tipo: "critico",
          categoria: "financeiro",
          titulo: "Royalties em Atraso",
          descricao: `${royaltiesAtrasados.length} franquias com pagamentos atrasados`,
          valor: royaltiesAtrasados.reduce((sum, r) => sum + Number(r.valor_total), 0),
          franquias: royaltiesAtrasados.map(r => r.franquia?.nome_fantasia).filter(Boolean)
        });
      }

      // Buscar franquias com performance baixa
      const { data: franquiasBaixaPerformance } = await supabase
        .from("view_franquias_resumo")
        .select("*")
        .lt("faturamento_total", 50000); // Exemplo: menos de 50k de faturamento

      if (franquiasBaixaPerformance && franquiasBaixaPerformance.length > 0) {
        alertas.push({
          tipo: "alerta",
          categoria: "performance",
          titulo: "Franquias com Baixa Performance",
          descricao: `${franquiasBaixaPerformance.length} unidades abaixo da meta`,
          franquias: franquiasBaixaPerformance.map(f => f.nome_fantasia).filter(Boolean)
        });
      }

      return alertas;
    },
    enabled: !!holdingData && holdingData.tipo === 'holding',
  });
};
