
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GuiasService } from "@/services/guiasService";
import { GuiaStatus, UserType } from "@/types/guias";

export function useUpdateGuiaStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      guiaId, 
      status, 
      userType = 'unidade' 
    }: { 
      guiaId: string; 
      status: GuiaStatus;
      userType?: UserType;
    }) => {
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { data: guiaAtual, error: fetchError } = await supabase
        .from("guias")
        .select("status, data_emissao")
        .eq("id", guiaId)
        .single();
      
      if (fetchError) throw fetchError;
      
      return GuiasService.updateGuiaStatus(
        guiaId, 
        status, 
        guiaAtual.status as GuiaStatus, 
        guiaAtual.data_emissao, 
        userType
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guias"] });
      queryClient.invalidateQueries({ queryKey: ["vendas"] });
    },
  });
}

export function useEstornarGuia() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ guiaId, userType = 'unidade' }: { guiaId: string; userType?: UserType }) => {
      return GuiasService.estornarGuia(guiaId, userType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guias"] });
      queryClient.invalidateQueries({ queryKey: ["vendas"] });
    },
  });
}
