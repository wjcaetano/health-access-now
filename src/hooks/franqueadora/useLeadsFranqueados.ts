
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Use the database table type directly
export interface LeadFranqueado {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cidade_interesse?: string | null;
  estado_interesse?: string | null;
  capital_disponivel?: number | null;
  experiencia_empresarial?: string | null;
  origem?: string | null;
  status: string; // Database stores as text, not enum
  score: number | null;
  data_primeiro_contato?: string | null;
  responsavel_id?: string | null;
  observacoes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export const useLeadsFranqueados = () => {
  return useQuery({
    queryKey: ["leads-franqueados"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads_franqueados")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as LeadFranqueado[];
    },
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<LeadFranqueado, "id" | "created_at" | "updated_at">) => {
      const { data: result, error } = await supabase
        .from("leads_franqueados")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads-franqueados"] });
      toast({
        title: "Lead criado",
        description: "Novo lead adicionado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar lead. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao criar lead:", error);
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<LeadFranqueado> }) => {
      const { data: result, error } = await supabase
        .from("leads_franqueados")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads-franqueados"] });
      toast({
        title: "Lead atualizado",
        description: "Lead atualizado com sucesso!",
      });
    },
  });
};
