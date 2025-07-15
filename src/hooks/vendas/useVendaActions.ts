
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GuiasService } from "@/services/guiasService";
import { useEstornarGuia } from "@/hooks/guias/useGuiaStatus";

export function useCancelarVenda() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vendaId: string) => {
      console.log('Cancelando venda:', vendaId);
      
      const { data: guiasRelacionadas, error: guiasError } = await supabase
        .from("guias")
        .select("id, status")
        .eq("agendamento_id", vendaId);
      
      if (guiasError) {
        console.error('Erro ao buscar guias da venda:', guiasError);
        throw guiasError;
      }

      let guiasCanceladas = 0;

      if (guiasRelacionadas && guiasRelacionadas.length > 0) {
        console.log('Cancelando guias relacionadas:', guiasRelacionadas);
        
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

      const { data, error } = await supabase
        .from("vendas")
        .update({ status: 'cancelada' })
        .eq("id", vendaId)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao cancelar venda:', error);
        throw error;
      }
      
      console.log(`Venda cancelada com sucesso. ${guiasCanceladas} guias foram canceladas.`);
      return { venda: data, guiasCanceladas, totalGuias: guiasRelacionadas?.length || 0 };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendas"] });
      queryClient.invalidateQueries({ queryKey: ["guias"] });
    },
  });
}

export function useEstornarVenda() {
  const queryClient = useQueryClient();
  const { mutate: estornarGuia } = useEstornarGuia();
  
  return useMutation({
    mutationFn: async (vendaId: string) => {
      console.log('Estornando venda:', vendaId);
      
      const { data: guiasRelacionadas, error: guiasError } = await supabase
        .from("guias")
        .select("id, status")
        .eq("agendamento_id", vendaId);
      
      if (guiasError) {
        console.error('Erro ao buscar guias da venda:', guiasError);
        throw guiasError;
      }

      if (guiasRelacionadas && guiasRelacionadas.length > 0) {
        console.log('Estornando guias relacionadas:', guiasRelacionadas);
        
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

      const { data, error } = await supabase
        .from("vendas")
        .update({ status: 'estornada' })
        .eq("id", vendaId)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao estornar venda:', error);
        throw error;
      }
      
      console.log('Venda estornada com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendas"] });
      queryClient.invalidateQueries({ queryKey: ["guias"] });
    },
  });
}
