// Re-export all guia hooks from specific files for backwards compatibility
export { 
  useGuias, 
  useGuiasPorStatus, 
  useGuiasProximasVencimento, 
  useGuiasPorPedido 
} from "./guias/useGuiaQueries";

export { 
  useUpdateGuiaStatus, 
  useEstornarGuia 
} from "./guias/useGuiaStatus";

// Keep existing hooks that weren't moved
export { useCancelamentoPedido, useBuscarGuiasRelacionadas } from "@/hooks/useCancelamentoPedido";

// Re-export utilities for backwards compatibility
export { isStatusTransitionAllowed, calcularDiasParaExpiracao } from "@/utils/guiaUtils";
export { GUIA_STATUS, STATUS_TRANSITIONS } from "@/types/guias";
