
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

type Unidade = Tables<"unidades">;
type NovaUnidade = TablesInsert<"unidades">;

export function useUnidades() {
  return useQuery({
    queryKey: ["unidades"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unidades")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Unidade[];
    },
  });
}

export function useUnidadeById(unidadeId: string) {
  return useQuery({
    queryKey: ["unidade", unidadeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unidades")
        .select("*")
        .eq("id", unidadeId)
        .single();
      
      if (error) throw error;
      return data as Unidade;
    },
    enabled: !!unidadeId,
  });
}

export function useCreateUnidade() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (unidade: NovaUnidade) => {
      const { data, error } = await supabase
        .from("unidades")
        .insert([unidade])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unidades"] });
    },
  });
}

export function useUpdateUnidade() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Unidade> }) => {
      const { data, error } = await supabase
        .from("unidades")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["unidades"] });
      queryClient.invalidateQueries({ queryKey: ["unidade", data.id] });
    },
  });
}

// Mantendo compatibilidade com código existente
export const useTenants = useUnidades;
export const useTenantById = useUnidadeById;
export const useCreateTenant = useCreateUnidade;
export const useUpdateTenant = useUpdateUnidade;
