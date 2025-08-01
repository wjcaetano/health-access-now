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
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });
}

export function useOrcamentosPorCliente(clienteId: string) {
  return useQuery({
    queryKey: ["orcamentos", "cliente", clienteId],
    queryFn: async () => {
      if (!clienteId) {
        return [];
      }
      
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
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    enabled: !!clienteId,
    staleTime: 3 * 60 * 1000, // 3 minutos
    gcTime: 8 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useOrcamento(orcamentoId: string) {
  return useQuery({
    queryKey: ["orcamento", orcamentoId],
    queryFn: async () => {
      if (!orcamentoId) {
        throw new Error('ID do orçamento é obrigatório');
      }
      
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
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        return null;
      }
      
      return data;
    },
    enabled: !!orcamentoId,
    staleTime: 10 * 60 * 1000, // 10 minutos para item específico
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateOrcamento() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orcamento: NovoOrcamento) => {
      console.log('Criando orçamento:', orcamento);
      
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
      
      if (error) {
        console.error('Erro ao criar orçamento:', error);
        throw error;
      }
      
      console.log('Orçamento criado:', data);
      return data;
    },
    onSuccess: () => {
      console.log('Invalidando cache de orçamentos');
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] });
    },
    onError: (error) => {
      console.error('Erro na criação do orçamento:', error);
    }
  });
}

export function useUpdateOrcamento() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string; [key: string]: any }) => {
      if (!id) {
        throw new Error('ID do orçamento é obrigatório para atualização');
      }
      
      console.log('Atualizando orçamento:', id, updateData);
      
      const { data, error } = await supabase
        .from("orcamentos")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar orçamento:', error);
        throw error;
      }
      
      console.log('Orçamento atualizado:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Invalidando cache após atualização');
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] });
      queryClient.invalidateQueries({ queryKey: ["orcamento", data.id] });
    },
    onError: (error) => {
      console.error('Erro na atualização do orçamento:', error);
    }
  });
}

export function useCancelarOrcamento() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orcamentoId: string) => {
      console.log('Cancelando orçamento:', orcamentoId);
      
      if (!orcamentoId) {
        throw new Error('ID do orçamento é obrigatório para cancelamento');
      }
      
      const { data, error } = await supabase
        .from("orcamentos")
        .update({ status: 'cancelado' })
        .eq("id", orcamentoId)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao cancelar orçamento:', error);
        throw error;
      }
      
      console.log('Orçamento cancelado com sucesso:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Invalidando cache após cancelamento');
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] });
      queryClient.invalidateQueries({ queryKey: ["orcamento", data.id] });
      queryClient.invalidateQueries({ queryKey: ["orcamentos", "cliente"] });
    },
    onError: (error) => {
      console.error('Erro no cancelamento do orçamento:', error);
    }
  });
}
