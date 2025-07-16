// Re-export all hooks from the new modular structure
export * from "./franqueadora/useFranquias";
export * from "./franqueadora/useFranqueados";
export * from "./franqueadora/useLeadsFranqueados";
export * from "./franqueadora/useRoyaltiesFranqueadora";
export * from "./franqueadora/useMetricasFranqueadora";

// Re-export types
export type { Franquia, Franqueado, LeadFranqueado, Royalty, MetricasFranqueadora } from "../types/franqueadora";

// Keep backward compatibility
export { useFranquias, useFranquiasResumo, useCreateFranquia } from "./franqueadora/useFranquias";
export { useFranqueados } from "./franqueadora/useFranqueados";
export { useLeadsFranqueados, useCreateLead, useUpdateLead } from "./franqueadora/useLeadsFranqueados";
export { useRoyalties } from "./franqueadora/useRoyaltiesFranqueadora";
export { useMetricasFranqueadora } from "./franqueadora/useMetricasFranqueadora";
