import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Guia = Tables<"guias">;

// Definição dos status permitidos e suas transições
export const GUIA_STATUS = {
  emitida: 'emitida',
  realizada: 'realizada', 
  faturada: 'faturada',
  paga: 'paga',
  cancelada: 'cancelada',
  estornada: 'estornada',
  expirada: 'expirada'
} as const;

// Transições permitidas por tipo de usuário
export const STATUS_TRANSITIONS = {
  prestador: {
    emitida: ['realizada', 'cancelada'],
    realizada: ['faturada', 'cancelada'],
    faturada: ['cancelada']
  },
  unidade: {
    emitida: ['cancelada'],
    realizada: ['cancelada'],
    faturada: ['paga', 'cancelada', 'estornada'],
    paga: ['estornada']
  }
};

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
          ),
          vendas_servicos!inner (
            venda_id,
            vendas (
              id,
              created_at,
              valor_total,
              metodo_pagamento
            )
          )
        `)
        .order("data_emissao", { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar guias:', error);
        throw error;
      }
      
      // Verificar e marcar guias expiradas (30 dias)
      const guiasComExpiracao = data?.map(guia => {
        const dataEmissao = new Date(guia.data_emissao);
        const dataExpiracao = new Date(dataEmissao.getTime() + (30 * 24 * 60 * 60 * 1000));
        const hoje = new Date();
        
        // Se a guia está emitida e passou de 30 dias, marcar como expirada
        if (guia.status === 'emitida' && hoje > dataExpiracao) {
          return { ...guia, status: 'expirada', data_expiracao: dataExpiracao.toISOString() };
        }
        
        return { ...guia, data_expiracao: dataExpiracao.toISOString() };
      }) || [];
      
      console.log('Guias carregadas do banco:', guiasComExpiracao);
      return guiasComExpiracao;
    },
  });
}

export function useUpdateGuiaStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      guiaId, 
      status, 
      userType = 'unidade' 
    }: { 
      guiaId: string; 
      status: string;
      userType?: 'prestador' | 'unidade';
    }) => {
      // Primeiro, buscar o status atual da guia
      const { data: guiaAtual, error: fetchError } = await supabase
        .from("guias")
        .select("status, data_emissao")
        .eq("id", guiaId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Verificar se a transição é permitida
      const transicoesPossíveis = STATUS_TRANSITIONS[userType][guiaAtual.status as keyof typeof STATUS_TRANSITIONS[typeof userType]];
      
      if (!transicoesPossíveis?.includes(status)) {
        throw new Error(`Transição de status não permitida: ${guiaAtual.status} → ${status} para ${userType}`);
      }
      
      // Verificar se a guia não está expirada (exceto para cancelamento)
      if (status !== 'cancelada') {
        const dataEmissao = new Date(guiaAtual.data_emissao);
        const dataExpiracao = new Date(dataEmissao.getTime() + (30 * 24 * 60 * 60 * 1000));
        const hoje = new Date();
        
        if (hoje > dataExpiracao && guiaAtual.status === 'emitida') {
          throw new Error('Esta guia está expirada e não pode ter seu status alterado. Emita uma nova guia.');
        }
      }
      
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
          ),
          vendas_servicos!inner (
            venda_id,
            vendas (
              id,
              created_at,
              valor_total,
              metodo_pagamento
            )
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

// Hook para obter guias próximas do vencimento
export function useGuiasProximasVencimento() {
  return useQuery({
    queryKey: ["guias", "proximas-vencimento"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guias")
        .select(`
          *,
          clientes (nome),
          servicos (nome),
          vendas_servicos!inner (
            venda_id,
            vendas (
              id,
              created_at
            )
          )
        `)
        .eq('status', 'emitida');
      
      if (error) throw error;
      
      // Filtrar guias que vencem em 5 dias ou menos
      const hoje = new Date();
      const proximasVencimento = data?.filter(guia => {
        const dataEmissao = new Date(guia.data_emissao);
        const dataExpiracao = new Date(dataEmissao.getTime() + (30 * 24 * 60 * 60 * 1000));
        const diasRestantes = Math.ceil((dataExpiracao.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
        return diasRestantes <= 5 && diasRestantes > 0;
      }) || [];
      
      return proximasVencimento;
    },
  });
}

// Função para validar se uma transição de status é permitida
export function isStatusTransitionAllowed(
  currentStatus: string, 
  newStatus: string, 
  userType: 'prestador' | 'unidade'
): boolean {
  const allowedTransitions = STATUS_TRANSITIONS[userType][currentStatus as keyof typeof STATUS_TRANSITIONS[typeof userType]];
  return allowedTransitions?.includes(newStatus) || false;
}

// Função para calcular dias até expiração
export function calcularDiasParaExpiracao(dataEmissao: string): number {
  const emissao = new Date(dataEmissao);
  const expiracao = new Date(emissao.getTime() + (30 * 24 * 60 * 60 * 1000));
  const hoje = new Date();
  
  return Math.ceil((expiracao.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
}
