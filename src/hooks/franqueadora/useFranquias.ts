
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useErrorHandler } from "../shared/useErrorHandler";
import { Franquia } from "@/types/franqueadora";
import { useToast } from "@/hooks/use-toast";

export const useFranquias = () => {
  const { handleError } = useErrorHandler();

  return useQuery({
    queryKey: ["franquias"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("franquias")
          .select(`
            *,
            franqueado_responsavel:franqueados(nome_completo, email)
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
      } catch (error) {
        handleError(error, { title: "Erro ao carregar franquias" });
        throw error;
      }
    },
  });
};

export const useFranquiasResumo = () => {
  const { handleError } = useErrorHandler();

  return useQuery({
    queryKey: ["franquias-resumo"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("view_franquias_resumo")
          .select("*")
          .order("faturamento_total", { ascending: false });

        if (error) throw error;
        return data;
      } catch (error) {
        handleError(error, { title: "Erro ao carregar resumo das franquias" });
        throw error;
      }
    },
  });
};

export const useCreateFranquia = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  return useMutation({
    mutationFn: async (data: Omit<Franquia, "id" | "created_at" | "updated_at">) => {
      try {
        const { data: result, error } = await supabase
          .from("franquias")
          .insert([data])
          .select()
          .single();

        if (error) throw error;
        return result;
      } catch (error) {
        handleError(error, { title: "Erro ao criar franquia" });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["franquias"] });
      queryClient.invalidateQueries({ queryKey: ["franquias-resumo"] });
      toast({
        title: "Franquia criada",
        description: "Nova franquia criada com sucesso!",
      });
    },
  });
};
