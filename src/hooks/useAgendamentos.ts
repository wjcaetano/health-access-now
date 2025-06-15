
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

type Agendamento = Tables<"agendamentos">;
type NovoAgendamento = TablesInsert<"agendamentos">;

export function useAgendamentos() {
  return useQuery({
    queryKey: ["agendamentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agendamentos")
        .select(`
          *,
          clientes (nome, cpf, telefone),
          servicos (nome, categoria),
          prestadores (nome, tipo)
        `)
        .order("data_agendamento", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateAgendamento() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (agendamento: NovoAgendamento) => {
      const { data, error } = await supabase
        .from("agendamentos")
        .insert([agendamento])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agendamentos"] });
    },
  });
}
