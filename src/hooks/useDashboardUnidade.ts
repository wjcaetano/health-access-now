
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUnitData } from "./tenant-specific/useUnit";
import { useTenant } from "@/contexts/TenantContext";

export const useDashboardUnidade = () => {
  const { currentTenant } = useTenant();
  const { data: unitData } = useUnitData();

  return useQuery({
    queryKey: ["dashboard-unidade", currentTenant?.id],
    queryFn: async () => {
      if (!currentTenant || currentTenant.tipo !== 'franquia') {
        throw new Error('Acesso negado: contexto franquia necessário');
      }

      const hoje = new Date().toISOString().split('T')[0];

      // Buscar métricas operacionais
      const [vendas, agendamentos, clientes, prestadores] = await Promise.all([
        supabase
          .from("vendas")
          .select("*")
          .eq("tenant_id", currentTenant.id)
          .gte("created_at", hoje),
        
        supabase
          .from("agendamentos")
          .select("*")
          .eq("tenant_id", currentTenant.id)
          .eq("data_agendamento", hoje),
        
        supabase
          .from("clientes")
          .select("id")
          .eq("tenant_id", currentTenant.id),
        
        supabase
          .from("prestadores")
          .select("*")
          .eq("tenant_id", currentTenant.id)
          .eq("ativo", true)
      ]);

      const vendasHoje = vendas.data?.length || 0;
      const faturamentoHoje = vendas.data?.reduce((sum, v) => sum + Number(v.valor_total), 0) || 0;
      const agendamentosHoje = agendamentos.data?.length || 0;
      const totalClientes = clientes.data?.length || 0;
      const prestadoresAtivos = prestadores.data?.length || 0;

      return {
        vendasHoje,
        faturamentoHoje,
        agendamentosHoje,
        totalClientes,
        prestadoresAtivos,
        metaDiaria: 3000, // Configurável por unidade
        percentualMeta: faturamentoHoje > 0 ? (faturamentoHoje / 3000) * 100 : 0
      };
    },
    enabled: !!currentTenant && currentTenant.tipo === 'franquia',
  });
};

export const useComparativoUnidades = () => {
  const { currentTenant } = useTenant();

  return useQuery({
    queryKey: ["comparativo-unidades", currentTenant?.id],
    queryFn: async () => {
      if (!currentTenant) {
        throw new Error('Tenant não identificado');
      }

      // Buscar dados da própria unidade
      const { data: minhaUnidade } = await supabase
        .from("view_franquias_resumo")
        .select("*")
        .eq("id", currentTenant.id)
        .single();

      // Buscar dados de outras unidades (da mesma rede)
      const { data: outrasUnidades } = await supabase
        .from("view_franquias_resumo")
        .select("*")
        .neq("id", currentTenant.id)
        .order("faturamento_total", { ascending: false })
        .limit(10);

      // Calcular posição no ranking
      const todasUnidades = [minhaUnidade, ...(outrasUnidades || [])].filter(Boolean);
      const unidadesOrdenadas = todasUnidades.sort((a, b) => 
        Number(b.faturamento_total) - Number(a.faturamento_total)
      );

      const minhaPosicao = unidadesOrdenadas.findIndex(u => u.id === currentTenant.id) + 1;

      // Calcular médias da rede
      const mediaFaturamento = todasUnidades.reduce((sum, u) => 
        sum + Number(u.faturamento_total), 0
      ) / todasUnidades.length;

      const mediaVendas = todasUnidades.reduce((sum, u) => 
        sum + Number(u.total_vendas), 0
      ) / todasUnidades.length;

      return {
        minhaUnidade,
        outrasUnidades: outrasUnidades || [],
        minhaPosicao,
        totalUnidades: todasUnidades.length,
        mediaFaturamento,
        mediaVendas,
        ranking: unidadesOrdenadas
      };
    },
    enabled: !!currentTenant,
  });
};
