
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

type Colaborador = Tables<"colaboradores">;
type NovoColaborador = TablesInsert<"colaboradores">;

export function useColaboradores() {
  return useQuery({
    queryKey: ["colaboradores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("colaboradores")
        .select("*")
        .order("data_cadastro", { ascending: false });
      
      if (error) throw error;
      return data as Colaborador[];
    },
  });
}

export function useColaboradorByEmail(email: string) {
  return useQuery({
    queryKey: ["colaborador", email],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("colaboradores")
        .select("*")
        .eq("email", email)
        .single();
      
      if (error) throw error;
      return data as Colaborador;
    },
    enabled: !!email,
  });
}

export function useCreateColaborador() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (colaborador: NovoColaborador) => {
      const { data, error } = await supabase
        .from("colaboradores")
        .insert([colaborador])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colaboradores"] });
    },
  });
}
