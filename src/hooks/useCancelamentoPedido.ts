
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GuiasService } from "@/services/guiasService";
import { UserType } from "@/types/guias";

export function useCancelamentoPedido() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ guiaId, userType = 'unidade' }: { guiaId: string; userType?: UserType }) => {
      return GuiasService.cancelarPedidoCompleto(guiaId, userType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guias"] });
      queryClient.invalidateQueries({ queryKey: ["vendas"] });
    },
  });
}

export function useBuscarGuiasRelacionadas() {
  return useMutation({
    mutationFn: async (guiaId: string) => {
      return GuiasService.buscarGuiasRelacionadas(guiaId);
    },
  });
}
