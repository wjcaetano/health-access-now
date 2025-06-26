import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GuiasService } from "@/services/guiasService";
import { processGuiasWithExpiration, processGuiasWithVendas } from "@/utils/guiaUtils";
import { GuiaComVendas, GuiaStatus, UserType } from "@/types/guias";

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

export function useUpdateGuiaStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      guiaId, 
      status, 
      userType = 'unidade' 
    }: { 
      guiaId: string; 
      status: GuiaStatus;
      userType?: UserType;
    }) => {
      // Buscar o status atual da guia
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { data: guiaAtual, error: fetchError } = await supabase
        .from("guias")
        .select("status, data_emissao")
        .eq("id", guiaId)
        .single();
      
      if (fetchError) throw fetchError;
      
      return GuiasService.updateGuiaStatus(
        guiaId, 
        status, 
        guiaAtual.status as GuiaStatus, 
        guiaAtual.data_emissao, 
        userType
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guias"] });
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

// Re-exportar utilitários para manter compatibilidade
export { isStatusTransitionAllowed, calcularDiasParaExpiracao } from "@/utils/guiaUtils";
export { GUIA_STATUS, STATUS_TRANSITIONS } from "@/types/guias";
