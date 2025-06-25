
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

type Servico = Tables<"servicos">;
type NovoServico = TablesInsert<"servicos">;

export function useServicos() {
  return useQuery({
    queryKey: ["servicos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("servicos")
        .select("*")
        .eq("ativo", true)
        .order("nome");
      
      if (error) throw error;
      return data;
    },
  });
}

export function useServicosPorPrestador(prestadorId: string) {
  return useQuery({
    queryKey: ["servicos", "prestador", prestadorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("servicos")
        .select("*")
        .eq("prestador_id", prestadorId)
        .eq("ativo", true)
        .order("nome");
      
      if (error) throw error;
      return data;
    },
    enabled: !!prestadorId,
  });
}

export function useCreateServico() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (servico: NovoServico) => {
      const { data, error } = await supabase
        .from("servicos")
        .insert([servico])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicos"] });
    },
  });
}
