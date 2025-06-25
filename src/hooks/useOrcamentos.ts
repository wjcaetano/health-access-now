
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

type Orcamento = Tables<"orcamentos">;
type NovoOrcamento = TablesInsert<"orcamentos">;

export function useOrcamentos() {
  return useQuery({
    queryKey: ["orcamentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orcamentos")
        .select(`
          *,
          clientes (
            id,
            nome,
            cpf
          ),
          prestadores (
            id,
            nome,
            tipo
          ),
          servicos (
            id,
            nome,
            categoria
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useOrcamentosPorCliente(clienteId: string) {
  return useQuery({
    queryKey: ["orcamentos", "cliente", clienteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orcamentos")
        .select(`
          *,
          servicos (
            nome,
            categoria
          ),
          prestadores (
            nome
          )
        `)
        .eq("cliente_id", clienteId)
        .eq("status", "pendente")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!clienteId,
  });
}

export function useCreateOrcamento() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orcamento: NovoOrcamento) => {
      const { data, error } = await supabase
        .from("orcamentos")
        .insert([orcamento])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] });
    },
  });
}

export function useUpdateOrcamento() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Orcamento>) => {
      const { data, error } = await supabase
        .from("orcamentos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] });
    },
  });
}
