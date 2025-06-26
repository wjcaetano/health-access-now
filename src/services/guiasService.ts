
import { supabase } from "@/integrations/supabase/client";
import { GuiaComVendas, GuiaStatus, UserType } from "@/types/guias";

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
    status: GuiaStatus, 
    currentStatus: GuiaStatus,
    dataEmissao: string,
    userType: UserType = 'unidade'
  ) {
    // Verificar se a transição é permitida
    const { STATUS_TRANSITIONS } = await import("@/types/guias");
    const transicoesPossíveis = STATUS_TRANSITIONS[userType][currentStatus];
    
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

  // Método específico para cancelar guias
  static async cancelarGuia(guiaId: string, userType: UserType = 'unidade') {
    console.log(`Cancelando guia ${guiaId} pelo usuário tipo ${userType}`);
    
    // Buscar o status atual da guia
    const { data: guiaAtual, error: fetchError } = await supabase
      .from("guias")
      .select("status, data_emissao")
      .eq("id", guiaId)
      .single();
    
    if (fetchError) {
      console.error('Erro ao buscar guia atual:', fetchError);
      throw fetchError;
    }

    const currentStatus = guiaAtual.status as GuiaStatus;
    
    // Verificar se pode cancelar
    const { STATUS_TRANSITIONS } = await import("@/types/guias");
    const transicoesPossíveis = STATUS_TRANSITIONS[userType][currentStatus];
    
    if (!transicoesPossíveis?.includes('cancelada')) {
      throw new Error(`Não é possível cancelar uma guia com status '${currentStatus}' para usuário tipo '${userType}'`);
    }

    const { data, error } = await supabase
      .from("guias")
      .update({ 
        status: 'cancelada',
        data_cancelamento: new Date().toISOString()
      })
      .eq("id", guiaId)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao cancelar guia:', error);
      throw error;
    }
    
    console.log('Guia cancelada com sucesso:', data);
    return data;
  }

  // Método específico para estornar guias
  static async estornarGuia(guiaId: string, userType: UserType = 'unidade') {
    console.log(`Estornando guia ${guiaId} pelo usuário tipo ${userType}`);
    
    // Buscar o status atual da guia
    const { data: guiaAtual, error: fetchError } = await supabase
      .from("guias")
      .select("status, data_emissao")
      .eq("id", guiaId)
      .single();
    
    if (fetchError) {
      console.error('Erro ao buscar guia atual:', fetchError);
      throw fetchError;
    }

    const currentStatus = guiaAtual.status as GuiaStatus;
    
    // Verificar se pode estornar
    const { STATUS_TRANSITIONS } = await import("@/types/guias");
    const transicoesPossíveis = STATUS_TRANSITIONS[userType][currentStatus];
    
    if (!transicoesPossíveis?.includes('estornada')) {
      throw new Error(`Não é possível estornar uma guia com status '${currentStatus}' para usuário tipo '${userType}'`);
    }

    const { data, error } = await supabase
      .from("guias")
      .update({ 
        status: 'estornada',
        data_estorno: new Date().toISOString()
      })
      .eq("id", guiaId)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao estornar guia:', error);
      throw error;
    }
    
    console.log('Guia estornada com sucesso:', data);
    return data;
  }
}
