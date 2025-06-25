
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

type Orcamento = Tables<"orcamentos">;
type NovoOrcamento = TablesInsert<"orcamentos">;

export function useOrcamentos() {
  return useQuery({
    queryKey: ["orcamentos"],
    queryFn: async () => {
      console.log('Buscando orçamentos...');
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
        console.error('Erro ao buscar orçamentos:', error);
        throw error;
      }
      
      console.log('Orçamentos encontrados:', data);
      return data;
    },
  });
}

export function useOrcamentosPorCliente(clienteId: string) {
  return useQuery({
    queryKey: ["orcamentos", "cliente", clienteId],
    queryFn: async () => {
      if (!clienteId) {
        console.log('Cliente ID não fornecido');
        return [];
      }
      
      console.log('Buscando orçamentos para cliente:', clienteId);
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
        console.error('Erro ao buscar orçamentos por cliente:', error);
        throw error;
      }
      
      console.log('Orçamentos por cliente encontrados:', data);
      return data;
    },
    enabled: !!clienteId,
  });
}

export function useOrcamento(orcamentoId: string) {
  return useQuery({
    queryKey: ["orcamento", orcamentoId],
    queryFn: async () => {
      if (!orcamentoId) {
        throw new Error('ID do orçamento é obrigatório');
      }
      
      console.log('Buscando orçamento:', orcamentoId);
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
        console.error('Erro ao buscar orçamento:', error);
        throw error;
      }
      
      if (!data) {
        console.warn('Orçamento não encontrado:', orcamentoId);
        return null;
      }
      
      console.log('Orçamento encontrado:', data);
      return data;
    },
    enabled: !!orcamentoId,
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
      if (!orcamentoId) {
        throw new Error('ID do orçamento é obrigatório para cancelamento');
      }
      
      console.log('Cancelando orçamento:', orcamentoId);
      
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
      
      console.log('Orçamento cancelado:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Invalidando cache após cancelamento');
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] });
      queryClient.invalidateQueries({ queryKey: ["orcamento", data.id] });
    },
    onError: (error) => {
      console.error('Erro no cancelamento do orçamento:', error);
    }
  });
}
