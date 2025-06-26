
import { supabase } from "@/integrations/supabase/client";
import { GuiaComVendas } from "@/types/guias";

export class GuiasService {
  static async fetchGuiasWithRelations(): Promise<GuiaComVendas[]> {
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
          endereco,
          data_cadastro,
          id_associado
        ),
        servicos (
          id,
          nome,
          categoria,
          valor_venda,
          valor_custo,
          descricao,
          tempo_estimado,
          created_at,
          ativo,
          prestador_id
        ),
        prestadores (
          id,
          nome,
          tipo,
          especialidades,
          cnpj,
          endereco,
          telefone,
          email,
          banco,
          agencia,
          conta,
          tipo_conta,
          ativo,
          data_cadastro,
          comissao
        )
      `)
      .order("data_emissao", { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar guias:', error);
      throw error;
    }
    
    return data as GuiaComVendas[];
  }

  static async fetchVendasServicos(vendaId: string) {
    const { data, error } = await supabase
      .from("vendas_servicos")
      .select(`
        venda_id,
        vendas (
          id,
          created_at,
          valor_total,
          metodo_pagamento
        )
      `)
      .eq("venda_id", vendaId);
      
    if (error) {
      console.error('Erro ao buscar vendas_servicos:', error);
      return null;
    }
    
    return data;
  }

  static async updateGuiaStatus(
    guiaId: string, 
    status: string, 
    currentStatus: string,
    dataEmissao: string,
    userType: 'prestador' | 'unidade' = 'unidade'
  ) {
    // Verificar se a transição é permitida
    const { STATUS_TRANSITIONS } = await import("@/types/guias");
    const transicoesPossíveis = STATUS_TRANSITIONS[userType][currentStatus as keyof typeof STATUS_TRANSITIONS[typeof userType]];
    
    if (!transicoesPossíveis?.includes(status)) {
      throw new Error(`Transição de status não permitida: ${currentStatus} → ${status} para ${userType}`);
    }
    
    // Verificar se a guia não está expirada (exceto para cancelamento)
    if (status !== 'cancelada') {
      const dataEmissaoObj = new Date(dataEmissao);
      const dataExpiracao = new Date(dataEmissaoObj.getTime() + (30 * 24 * 60 * 60 * 1000));
      const hoje = new Date();
      
      if (hoje > dataExpiracao && currentStatus === 'emitida') {
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
  }
}
