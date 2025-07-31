
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUnitData } from "./tenant-specific/useUnit";
import { useTenant } from "@/contexts/TenantContext";

export const useDashboardUnidade = () => {
  const { currentTenant } = useTenant();

  return {
    data: {
      vendasHoje: 0,
      faturamentoHoje: 0,
      agendamentosHoje: 0,
      totalClientes: 0,
      prestadoresAtivos: 0,
      metaDiaria: 3000,
      percentualMeta: 0
    },
    isLoading: false,
    error: null
  };
};

export const useComparativoUnidades = () => {
  return {
    data: {
      minhaUnidade: null,
      outrasUnidades: [],
      minhaPosicao: 1,
      totalUnidades: 1,
      mediaFaturamento: 0,
      mediaVendas: 0,
      ranking: []
    },
    isLoading: false,
    error: null
  };
};
