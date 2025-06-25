
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

type ServicoPrestador = Tables<"servico_prestadores">;
type NovoServicoPrestador = TablesInsert<"servico_prestadores">;

export function useServicoPrestadores() {
  return useQuery({
    queryKey: ["servico_prestadores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("servico_prestadores")
        .select(`
          *,
          servicos (
            id,
            nome,
            categoria,
            valor_venda
          ),
          prestadores (
            id,
            nome,
            tipo,
            especialidades
          )
        `)
        .eq("ativo", true);
      
      if (error) throw error;
      return data;
    },
  });
}

export function usePrestadoresPorServico(servicoId: string) {
  return useQuery({
    queryKey: ["prestadores_por_servico", servicoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("servico_prestadores")
        .select(`
          prestadores (
            id,
            nome,
            tipo,
            especialidades,
            ativo
          )
        `)
        .eq("servico_id", servicoId)
        .eq("ativo", true);
      
      if (error) throw error;
      return data.map(item => item.prestadores).filter(Boolean);
    },
    enabled: !!servicoId,
  });
}

export function useServicosPorPrestador(prestadorId: string) {
  return useQuery({
    queryKey: ["servicos_por_prestador", prestadorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("servico_prestadores")
        .select(`
          servicos (
            id,
            nome,
            categoria,
            valor_venda,
            descricao,
            ativo
          )
        `)
        .eq("prestador_id", prestadorId)
        .eq("ativo", true);
      
      if (error) throw error;
      return data.map(item => item.servicos).filter(Boolean);
    },
    enabled: !!prestadorId,
  });
}

export function useCreateServicoPrestador() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (relacionamento: NovoServicoPrestador) => {
      const { data, error } = await supabase
        .from("servico_prestadores")
        .insert([relacionamento])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servico_prestadores"] });
      queryClient.invalidateQueries({ queryKey: ["prestadores_por_servico"] });
      queryClient.invalidateQueries({ queryKey: ["servicos_por_prestador"] });
    },
  });
}

export function useDeleteServicoPrestador() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("servico_prestadores")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servico_prestadores"] });
      queryClient.invalidateQueries({ queryKey: ["prestadores_por_servico"] });
      queryClient.invalidateQueries({ queryKey: ["servicos_por_prestador"] });
    },
  });
}
