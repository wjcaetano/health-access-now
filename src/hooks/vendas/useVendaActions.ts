
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GuiasService } from "@/services/guiasService";
import { useEstornarGuia } from "@/hooks/guias/useGuiaStatus";

const QUERY_KEYS = {
  vendas: ["vendas"],
  guias: ["guias"]
};

export function useCancelarVenda() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vendaId: string) => {
      console.log('Cancelando venda:', vendaId);
      
      // Buscar e cancelar guias relacionadas
      const { data: guiasRelacionadas, error: guiasError } = await supabase
        .from("guias")
        .select("id, status")
        .eq("agendamento_id", vendaId);
      
      if (guiasError) throw guiasError;

      let guiasCanceladas = 0;
      if (guiasRelacionadas?.length > 0) {
        for (const guia of guiasRelacionadas) {
          if (['emitida', 'realizada', 'faturada'].includes(guia.status)) {
            try {
              await GuiasService.cancelarGuiaIndividual(guia.id);
              guiasCanceladas++;
            } catch (error) {
              console.error(`Erro ao cancelar guia ${guia.id}:`, error);
            }
          }
        }
      }

      // Cancelar a venda
      const { data, error } = await supabase
        .from("vendas")
        .update({ status: 'cancelada' })
        .eq("id", vendaId)
        .select()
        .single();
      
      if (error) throw error;
      
      return { 
        venda: data, 
        guiasCanceladas, 
        totalGuias: guiasRelacionadas?.length || 0 
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vendas });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.guias });
    },
  });
}

export function useEstornarVenda() {
  const queryClient = useQueryClient();
  const { mutate: estornarGuia } = useEstornarGuia();
  
  return useMutation({
    mutationFn: async (vendaId: string) => {
      console.log('Estornando venda:', vendaId);
      
      // Buscar e estornar guias relacionadas
      const { data: guiasRelacionadas, error: guiasError } = await supabase
        .from("guias")
        .select("id, status")
        .eq("agendamento_id", vendaId);
      
      if (guiasError) throw guiasError;

      if (guiasRelacionadas?.length > 0) {
        for (const guia of guiasRelacionadas) {
          if (guia.status === 'paga') {
            try {
              await estornarGuia({ guiaId: guia.id, userType: 'unidade' });
            } catch (error) {
              console.error(`Erro ao estornar guia ${guia.id}:`, error);
            }
          }
        }
      }

      // Estornar a venda
      const { data, error } = await supabase
        .from("vendas")
        .update({ status: 'estornada' })
        .eq("id", vendaId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vendas });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.guias });
    },
  });
}
