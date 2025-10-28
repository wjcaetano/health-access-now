import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook para buscar todas as organizações do sistema
 * (Clínicas, Laboratórios e Prestadores PJ)
 */
export function useOrganizacoes() {
  return useQuery({
    queryKey: ["organizacoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizacoes")
        .select("*")
        .order("nome");
      
      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook para buscar apenas organizações do tipo 'clinica'
 */
export function useClinicas() {
  return useQuery({
    queryKey: ["organizacoes", "clinicas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizacoes")
        .select("*")
        .eq("tipo_organizacao", "clinica")
        .order("nome");
      
      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar apenas organizações do tipo 'laboratorio'
 */
export function useLaboratorios() {
  return useQuery({
    queryKey: ["organizacoes", "laboratorios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizacoes")
        .select("*")
        .eq("tipo_organizacao", "laboratorio")
        .order("nome");
      
      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar uma organização específica por ID
 */
export function useOrganizacao(id?: string) {
  return useQuery({
    queryKey: ["organizacoes", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("organizacoes")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutos
  });
}
