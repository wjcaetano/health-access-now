// Re-export all hooks from the new modular structure
export * from "@/hooks/franqueadora/useFranquias";
export * from "@/hooks/franqueadora/useFranqueados";
export * from "@/hooks/franqueadora/useLeadsFranqueados";
export * from "@/hooks/franqueadora/useRoyaltiesFranqueadora";
export * from "@/hooks/franqueadora/useMetricasFranqueadora";

// Re-export types
export type { Franquia, Franqueado, LeadFranqueado, Royalty, MetricasFranqueadora } from "@/types/franqueadora";

// Keep backward compatibility
export { useFranquias, useFranquiasResumo, useCreateFranquia } from "@/hooks/franqueadora/useFranquias";
export { useFranqueados } from "@/hooks/franqueadora/useFranqueados";
export { useLeadsFranqueados, useCreateLead, useUpdateLead } from "@/hooks/franqueadora/useLeadsFranqueados";
export { useRoyalties } from "@/hooks/franqueadora/useRoyaltiesFranqueadora";
export { useMetricasFranqueadora } from "@/hooks/franqueadora/useMetricasFranqueadora";
