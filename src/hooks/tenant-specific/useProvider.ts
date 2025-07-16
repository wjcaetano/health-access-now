
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/contexts/TenantContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCache } from "@/hooks/useCache";

export function useProviderData() {
  const { currentTenant } = useTenant();
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ["provider", "data", currentTenant?.id, profile?.prestador_id],
    queryFn: async () => {
      if (!profile?.prestador_id) {
        throw new Error('Acesso negado: perfil de prestador necessário');
      }

      const { data, error } = await supabase
        .from("prestadores")
        .select(`
          *,
          servicos:servicos(*),
          guias:guias(*),
          agenda:agenda_pagamentos(*)
        `)
        .eq("id", profile.prestador_id)
        .eq("tenant_id", currentTenant?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!currentTenant && !!profile?.prestador_id,
  });
}

export function useProviderMetrics() {
  const { currentTenant } = useTenant();
  const { profile } = useAuth();
  
  const { data: metrics, loading, error } = useCache(
    `provider-metrics-${currentTenant?.id}-${profile?.prestador_id}`,
    async () => {
      if (!profile?.prestador_id) {
        throw new Error('Acesso negado: perfil de prestador necessário');
      }

      const [guias, servicos] = await Promise.all([
        supabase
          .from("guias")
          .select("valor, status")
          .eq("prestador_id", profile.prestador_id)
          .eq("tenant_id", currentTenant?.id),
        supabase
          .from("servicos")
          .select("valor_venda")
          .eq("prestador_id", profile.prestador_id)
          .eq("tenant_id", currentTenant?.id)
          .eq("ativo", true)
      ]);

      const metricas = {
        totalGuias: guias.data?.length || 0,
        guiasPendentes: guias.data?.filter(g => g.status === 'pendente').length || 0,
        faturamentoMensal: guias.data?.reduce((sum, g) => sum + Number(g.valor), 0) || 0,
        servicosAtivos: servicos.data?.length || 0
      };

      return metricas;
    },
    { ttl: 1 * 60 * 1000 } // 1 minute cache for provider data
  );

  return { data: metrics, loading, error };
}

export function useProviderOperations() {
  const { currentTenant } = useTenant();
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const updateAvailability = useMutation({
    mutationFn: async (availability: any) => {
      const { data, error } = await supabase
        .from("prestadores")
        .update({ 
          configuracoes: { 
            ...availability,
            updated_at: new Date().toISOString()
          }
        })
        .eq("id", profile?.prestador_id)
        .eq("tenant_id", currentTenant?.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider"] });
    }
  });

  return { updateAvailability };
}
