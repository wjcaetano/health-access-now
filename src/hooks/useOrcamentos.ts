
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

export function useOrcamento(orcamentoId: string) {
  return useQuery({
    queryKey: ["orcamento", orcamentoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orcamentos")
        .select(`
          *,
          clientes (
            id,
            nome,
            cpf,
            telefone,
            email
          ),
          servicos (
            id,
            nome,
            categoria
          ),
          prestadores (
            id,
            nome
          )
        `)
        .eq("id", orcamentoId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!orcamentoId,
  });
}

export function useCreateOrcamento() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orcamento: NovoOrcamento) => {
      // Definir data de validade para 7 dias a partir de hoje
      const dataValidade = new Date();
      dataValidade.setDate(dataValidade.getDate() + 7);
      
      const orcamentoComValidade = {
        ...orcamento,
        data_validade: dataValidade.toISOString().split('T')[0],
        status: 'pendente'
      };

      const { data, error } = await supabase
        .from("orcamentos")
        .insert([orcamentoComValidade])
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

export function useCancelarOrcamento() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orcamentoId: string) => {
      const { data, error } = await supabase
        .from("orcamentos")
        .update({ status: 'cancelado' })
        .eq("id", orcamentoId)
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
