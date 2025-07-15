
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Franquia {
  id: string;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco_completo: string;
  cep: string;
  cidade: string;
  estado: string;
  data_inauguracao?: string;
  status: 'ativa' | 'inativa' | 'suspensa' | 'em_implantacao';
  tipo_franquia: 'tradicional' | 'master' | 'microfranquia';
  valor_investimento?: number;
  taxa_royalty: number;
  taxa_marketing: number;
  meta_mensal?: number;
  territorio_exclusivo?: string;
  franqueado_responsavel_id?: string;
  created_at?: string;
  updated_at?: string;
}

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

export interface LeadFranqueado {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cidade_interesse?: string | null;
  estado_interesse?: string | null;
  capital_disponivel?: number | null;
  experiencia_empresarial?: string | null;
  origem?: string | null; // Changed from union type to string | null to match database
  status: string; // Changed from union type to string to match database
  score: number | null;
  data_primeiro_contato?: string | null;
  responsavel_id?: string | null;
  observacoes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Royalty {
  id: string;
  franquia_id: string;
  mes_referencia: number;
  ano_referencia: number;
  faturamento_bruto: number;
  valor_royalty: number;
  valor_marketing: number;
  valor_total: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: 'pendente' | 'pago' | 'atrasado' | 'isento';
  observacoes?: string;
  created_at?: string;
}

// Hook para buscar todas as franquias
export const useFranquias = () => {
  return useQuery({
    queryKey: ["franquias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("franquias")
        .select(`
          *,
          franqueado_responsavel:franqueados(nome_completo, email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Hook para buscar resumo das franquias
export const useFranquiasResumo = () => {
  return useQuery({
    queryKey: ["franquias-resumo"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("view_franquias_resumo")
        .select("*")
        .order("faturamento_total", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Hook para buscar franqueados
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

// Hook para buscar leads de franqueados
export const useLeadsFranqueados = () => {
  return useQuery({
    queryKey: ["leads-franqueados"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads_franqueados")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Hook para buscar royalties
export const useRoyalties = () => {
  return useQuery({
    queryKey: ["royalties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("royalties")
        .select(`
          *,
          franquia:franquias(nome_fantasia, cidade, estado)
        `)
        .order("data_vencimento", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Hook para criar nova franquia
export const useCreateFranquia = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<Franquia, "id" | "created_at" | "updated_at">) => {
      const { data: result, error } = await supabase
        .from("franquias")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["franquias"] });
      queryClient.invalidateQueries({ queryKey: ["franquias-resumo"] });
      toast({
        title: "Franquia criada",
        description: "Nova franquia criada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar franquia. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao criar franquia:", error);
    },
  });
};

// Hook para criar novo lead
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

// Hook para atualizar lead
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

// Hook para métricas da franqueadora
export const useMetricasFranqueadora = () => {
  return useQuery({
    queryKey: ["metricas-franqueadora"],
    queryFn: async () => {
      // Buscar métricas consolidadas
      const { data: franquias } = await supabase
        .from("franquias")
        .select("*");

      const { data: leads } = await supabase
        .from("leads_franqueados")
        .select("*");

      const { data: royalties } = await supabase
        .from("royalties")
        .select("*")
        .gte("data_vencimento", new Date().toISOString().split('T')[0]);

      return {
        totalFranquias: franquias?.length || 0,
        franquiasAtivas: franquias?.filter(f => f.status === 'ativa').length || 0,
        totalLeads: leads?.length || 0,
        leadsQualificados: leads?.filter(l => l.status === 'qualificado').length || 0,
        royaltiesPendentes: royalties?.filter(r => r.status === 'pendente').length || 0,
        valorRoyaltiesPendentes: royalties?.filter(r => r.status === 'pendente')
          .reduce((sum, r) => sum + (r.valor_total || 0), 0) || 0,
      };
    },
  });
};
