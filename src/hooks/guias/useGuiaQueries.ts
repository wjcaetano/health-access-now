
import { useQuery } from "@tanstack/react-query";
import { GuiasService } from "@/services/guiasService";
import { processGuiasWithExpiration, processGuiasWithVendas } from "@/utils/guiaUtils";
import { GuiaComVendas } from "@/types/guias";

export function useGuias() {
  return useQuery({
    queryKey: ["guias"],
    queryFn: async (): Promise<GuiaComVendas[]> => {
      try {
        const guias = await GuiasService.fetchGuiasWithRelations();
        const guiasComVendas = await processGuiasWithVendas(guias);
        const guiasComExpiracao = processGuiasWithExpiration(guiasComVendas);
        
        console.log('Guias carregadas do banco:', guiasComExpiracao);
        return guiasComExpiracao;
      } catch (error) {
        console.error('Erro ao carregar guias:', error);
        throw error;
      }
    },
  });
}

export function useGuiasPorStatus(status?: string) {
  return useQuery({
    queryKey: ["guias", "status", status],
    queryFn: async (): Promise<GuiaComVendas[]> => {
      const { supabase } = await import("@/integrations/supabase/client");
      
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
      
      return (data || []) as GuiaComVendas[];
    },
    enabled: !!status,
  });
}

export function useGuiasProximasVencimento() {
  return useQuery({
    queryKey: ["guias", "proximas-vencimento"],
    queryFn: async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { data, error } = await supabase
        .from("guias")
        .select(`
          *,
          clientes (nome),
          servicos (nome)
        `)
        .eq('status', 'emitida');
      
      if (error) throw error;
      
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

export function useGuiasPorPedido(vendaId: string) {
  return useQuery({
    queryKey: ["guias", "pedido", vendaId],
    queryFn: async (): Promise<GuiaComVendas[]> => {
      if (!vendaId) return [];
      
      const { supabase } = await import("@/integrations/supabase/client");
      
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
        .eq('agendamento_id', vendaId)
        .order("data_emissao", { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar guias por pedido:', error);
        throw error;
      }
      
      return (data || []) as GuiaComVendas[];
    },
    enabled: !!vendaId,
  });
}
