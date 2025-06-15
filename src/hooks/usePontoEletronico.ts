
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

type PontoEletronico = Tables<"ponto_eletronico">;
type NovoPonto = TablesInsert<"ponto_eletronico">;

export function usePontosColaborador(colaboradorId: string) {
  return useQuery({
    queryKey: ["pontos", colaboradorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ponto_eletronico")
        .select("*")
        .eq("colaborador_id", colaboradorId)
        .order("data_ponto", { ascending: false })
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as PontoEletronico[];
    },
    enabled: !!colaboradorId,
  });
}

export function useUltimoPonto(colaboradorId: string) {
  return useQuery({
    queryKey: ["ultimo-ponto", colaboradorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc("get_ultimo_ponto_colaborador", { colaborador_uuid: colaboradorId });
      
      if (error) throw error;
      return data[0] || null;
    },
    enabled: !!colaboradorId,
  });
}

export function useJaBateuPontoHoje(colaboradorId: string) {
  return useQuery({
    queryKey: ["ja-bateu-ponto", colaboradorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc("ja_bateu_ponto_hoje", { colaborador_uuid: colaboradorId });
      
      if (error) throw error;
      return data;
    },
    enabled: !!colaboradorId,
  });
}

export function useRegistrarPonto() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ponto: NovoPonto) => {
      const { data, error } = await supabase
        .from("ponto_eletronico")
        .insert([ponto])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pontos", variables.colaborador_id] });
      queryClient.invalidateQueries({ queryKey: ["ultimo-ponto", variables.colaborador_id] });
      queryClient.invalidateQueries({ queryKey: ["ja-bateu-ponto", variables.colaborador_id] });
      queryClient.invalidateQueries({ queryKey: ["colaboradores"] });
    },
  });
}
