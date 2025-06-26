
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Guia = Tables<"guias">;

export function useGuias() {
  return useQuery({
    queryKey: ["guias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guias")
        .select(`
          *,
          clientes (
            id,
            nome,
            cpf,
            telefone,
            email,
            id_associado
          ),
          servicos (
            nome,
            categoria,
            valor_venda
          ),
          prestadores (
            nome,
            tipo,
            especialidades
          )
        `)
        .order("data_emissao", { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar guias:', error);
        throw error;
      }
      
      console.log('Guias carregadas do banco:', data);
      return data;
    },
  });
}

export function useUpdateGuiaStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ guiaId, status }: { guiaId: string; status: string }) => {
      const updateData: any = { status };
      
      // Adicionar timestamp baseado no status
      if (status === 'realizada') {
        updateData.data_realizacao = new Date().toISOString();
      } else if (status === 'faturada') {
        updateData.data_faturamento = new Date().toISOString();
      } else if (status === 'paga') {
        updateData.data_pagamento = new Date().toISOString();
      }
      
      const { data, error } = await supabase
        .from("guias")
        .update(updateData)
        .eq("id", guiaId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guias"] });
    },
  });
}

export function useGuiasPorStatus(status?: string) {
  return useQuery({
    queryKey: ["guias", "status", status],
    queryFn: async () => {
      let query = supabase
        .from("guias")
        .select(`
          *,
          clientes (
            id,
            nome,
            cpf,
            telefone,
            email,
            id_associado
          ),
          servicos (
            nome,
            categoria,
            valor_venda
          ),
          prestadores (
            nome,
            tipo,
            especialidades
          )
        `);
      
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order("data_emissao", { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar guias por status:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!status,
  });
}
