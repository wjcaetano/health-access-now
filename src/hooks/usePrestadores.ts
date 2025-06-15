
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

type Prestador = Tables<"prestadores">;
type NovoPrestador = TablesInsert<"prestadores">;

export function usePrestadores() {
  return useQuery({
    queryKey: ["prestadores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prestadores")
        .select("*")
        .order("data_cadastro", { ascending: false });
      
      if (error) throw error;
      return data as Prestador[];
    },
  });
}

export function useCreatePrestador() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (prestador: NovoPrestador) => {
      const { data, error } = await supabase
        .from("prestadores")
        .insert([prestador])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prestadores"] });
    },
  });
}
