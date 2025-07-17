
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Franqueado {
  id: string;
  nome_completo: string;
  cpf: string;
  rg?: string;
  data_nascimento?: string;
  email: string;
  telefone: string;
  endereco_completo?: string;
  experiencia_empresarial?: string;
  capital_disponivel?: number;
  referencias?: string;
  status: 'prospecto' | 'qualificado' | 'em_negociacao' | 'aprovado' | 'ativo' | 'inativo';
  score_credito?: number;
  data_primeiro_contato?: string;
  origem_lead?: 'site' | 'indicacao' | 'feira' | 'marketing_digital' | 'telemarketing' | 'outros';
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
}

export const useFranqueados = () => {
  return useQuery({
    queryKey: ["franqueados"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("franqueados")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
