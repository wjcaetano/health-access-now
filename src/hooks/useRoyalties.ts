
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface RoyaltyData {
  id: string;
  franquia_id: string;
  mes_referencia: number;
  ano_referencia: number;
  faturamento_bruto: number;
  valor_royalty: number;
  valor_marketing: number;
  valor_total: number;
  data_vencimento: string;
  data_pagamento?: string | null;
  status: string; // Changed from union type to string
  observacoes?: string | null;
  created_at: string | null; // Changed to match database type
  franquia?: {
    nome_fantasia: string;
    razao_social: string;
    cnpj: string;
    cidade: string;
    estado: string;
    endereco_completo: string;
  };
}

export interface RoyaltiesFilters {
  periodo?: string;
  status?: string;
  franquia?: string;
  vencimento?: string;
}

// Hook para buscar royalties com filtros
export const useRoyalties = (filters?: RoyaltiesFilters) => {
  return useQuery({
    queryKey: ["royalties", filters],
    queryFn: async () => {
      let query = supabase
        .from("royalties")
        .select(`
          *,
          franquia:franquias(
            nome_fantasia,
            razao_social,
            cnpj,
            cidade,
            estado,
            endereco_completo
          )
        `);

      // Aplicar filtros
      if (filters?.periodo && filters.periodo !== 'todos') {
        const [ano, mes] = filters.periodo.split('-');
        query = query.eq('ano_referencia', parseInt(ano)).eq('mes_referencia', parseInt(mes));
      }

      if (filters?.status && filters.status !== 'todos') {
        if (filters.status === 'atrasado') {
          query = query.eq('status', 'pendente').lt('data_vencimento', new Date().toISOString().split('T')[0]);
        } else {
          query = query.eq('status', filters.status);
        }
      }

      if (filters?.franquia && filters.franquia !== 'todas') {
        query = query.eq('franquia_id', filters.franquia);
      }

      if (filters?.vencimento && filters.vencimento !== 'todos') {
        const hoje = new Date();
        const hojeFmt = hoje.toISOString().split('T')[0];
        
        switch (filters.vencimento) {
          case 'vencido':
            query = query.lt('data_vencimento', hojeFmt);
            break;
          case 'hoje':
            query = query.eq('data_vencimento', hojeFmt);
            break;
          case '7dias':
            const em7dias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
            query = query.gte('data_vencimento', hojeFmt).lte('data_vencimento', em7dias.toISOString().split('T')[0]);
            break;
          case '30dias':
            const em30dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);
            query = query.gte('data_vencimento', hojeFmt).lte('data_vencimento', em30dias.toISOString().split('T')[0]);
            break;
        }
      }

      const { data, error } = await query.order("data_vencimento", { ascending: false });

      if (error) throw error;

      // Atualizar status de royalties vencidos
      const royaltiesComStatus = data?.map(royalty => {
        const isOverdue = new Date(royalty.data_vencimento) < new Date() && royalty.status === 'pendente';
        return {
          ...royalty,
          status: isOverdue ? 'atrasado' : royalty.status
        };
      });

      return royaltiesComStatus || [];
    },
  });
};

// Hook para buscar métricas de royalties
export const useRoyaltiesMetrics = () => {
  return useQuery({
    queryKey: ["royalties-metrics"],
    queryFn: async () => {
      const { data: royalties, error } = await supabase
        .from("royalties")
        .select("*");

      if (error) throw error;

      const hoje = new Date();
      const mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1);

      // Calcular métricas
      const totalRoyalties = royalties?.length || 0;
      const royaltiesPagos = royalties?.filter(r => r.status === 'pago').length || 0;
      const royaltiesPendentes = royalties?.filter(r => r.status === 'pendente').length || 0;
      const royaltiesAtrasados = royalties?.filter(r => 
        r.status === 'pendente' && new Date(r.data_vencimento) < hoje
      ).length || 0;

      const valorTotalRecebido = royalties?.filter(r => r.status === 'pago')
        .reduce((sum, r) => sum + (r.valor_total || 0), 0) || 0;
      
      const valorTotalPendente = royalties?.filter(r => r.status === 'pendente')
        .reduce((sum, r) => sum + (r.valor_total || 0), 0) || 0;
      
      const valorTotalAtrasado = royalties?.filter(r => 
        r.status === 'pendente' && new Date(r.data_vencimento) < hoje
      ).reduce((sum, r) => sum + (r.valor_total || 0), 0) || 0;

      const percentualRecebimento = totalRoyalties > 0 ? (royaltiesPagos / totalRoyalties) * 100 : 0;

      // Crescimento mensal (simulado)
      const crescimentoMensal = Math.random() * 20 - 10; // Entre -10% e +10%

      return {
        totalRoyalties,
        royaltiesPagos,
        royaltiesPendentes,
        royaltiesAtrasados,
        valorTotalRecebido,
        valorTotalPendente,
        valorTotalAtrasado,
        percentualRecebimento,
        crescimentoMensal
      };
    },
  });
};

// Hook para confirmar pagamento
export const useConfirmPayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (royaltyId: string) => {
      const { data, error } = await supabase
        .from("royalties")
        .update({
          status: 'pago',
          data_pagamento: new Date().toISOString().split('T')[0]
        })
        .eq("id", royaltyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["royalties"] });
      queryClient.invalidateQueries({ queryKey: ["royalties-metrics"] });
      toast({
        title: "Pagamento confirmado",
        description: "O pagamento do royalty foi confirmado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao confirmar pagamento. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao confirmar pagamento:", error);
    },
  });
};

// Hook para enviar lembrete
export const useSendReminder = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (royaltyId: string) => {
      // Aqui você implementaria a lógica para enviar e-mail/SMS
      // Por enquanto, simularemos o envio
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Lembrete enviado para royalty: ${royaltyId}`);
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Lembrete enviado",
        description: "O lembrete de pagamento foi enviado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao enviar lembrete. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro ao enviar lembrete:", error);
    },
  });
};

// Hook para buscar um royalty específico
export const useRoyalty = (royaltyId: string) => {
  return useQuery({
    queryKey: ["royalty", royaltyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("royalties")
        .select(`
          *,
          franquia:franquias(
            nome_fantasia,
            razao_social,
            cnpj,
            cidade,
            estado,
            endereco_completo
          )
        `)
        .eq("id", royaltyId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!royaltyId,
  });
};
