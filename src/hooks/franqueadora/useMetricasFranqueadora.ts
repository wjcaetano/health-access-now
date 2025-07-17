
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMetricasFranqueadora = () => {
  return useQuery({
    queryKey: ["metricas-franqueadora"],
    queryFn: async () => {
      const { data: franquias } = await supabase
        .from("franquias")
        .select("*");

      const { data: leads } = await supabase
        .from("leads_franqueados")
        .select("*");

      const { data: royalties } = await supabase
        .from("royalties")
        .select("*")
        .gte("data_vencimento", new Date().toISOString().split('T')[0]);

      return {
        totalFranquias: franquias?.length || 0,
        franquiasAtivas: franquias?.filter(f => f.status === 'ativa').length || 0,
        totalLeads: leads?.length || 0,
        leadsQualificados: leads?.filter(l => l.status === 'qualificado').length || 0,
        royaltiesPendentes: royalties?.filter(r => r.status === 'pendente').length || 0,
        valorRoyaltiesPendentes: royalties?.filter(r => r.status === 'pendente')
          .reduce((sum, r) => sum + (r.valor_total || 0), 0) || 0,
      };
    },
  });
};
