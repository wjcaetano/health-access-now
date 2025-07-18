// Re-export all guia hooks from specific files for backwards compatibility
export { 
  useGuias, 
  useGuiasPorStatus, 
  useGuiasProximasVencimento, 
  useGuiasPorPedido 
} from "@/hooks/guias/useGuiaQueries";

export { 
  useUpdateGuiaStatus, 
  useEstornarGuia 
} from "@/hooks/guias/useGuiaStatus";

// Keep existing hooks that weren't moved
export { useCancelamentoPedido, useBuscarGuiasRelacionadas } from "@/hooks/useCancelamentoPedido";

// Re-export utilities for backwards compatibility
export { isStatusTransitionAllowed, calcularDiasParaExpiracao } from "@/utils/guiaUtils";
export { GUIA_STATUS, STATUS_TRANSITIONS } from "@/types/guias";
