
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

  // Método específico para cancelar guias individuais (usado internamente)
  static async cancelarGuiaIndividual(guiaId: string) {
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
      console.error('Erro ao cancelar guia individual:', error);
      throw error;
    }
    
    return data;
  }

  // Método principal para cancelar pedido completo
  static async cancelarPedidoCompleto(guiaId: string, userType: UserType = 'unidade') {
    console.log(`Cancelando pedido completo a partir da guia ${guiaId}`);
    
    // 1. Buscar a guia e seu agendamento_id (venda_id)
    const { data: guiaOriginal, error: guiaError } = await supabase
      .from("guias")
      .select("agendamento_id, status")
      .eq("id", guiaId)
      .single();
    
    if (guiaError) {
      console.error('Erro ao buscar guia original:', guiaError);
      throw guiaError;
    }

    if (!guiaOriginal.agendamento_id) {
      throw new Error('Guia não está vinculada a nenhum pedido.');
    }

    // 2. Buscar todas as guias relacionadas ao mesmo pedido
    const { data: guiasRelacionadas, error: guiasError } = await supabase
      .from("guias")
      .select("id, status, valor")
      .eq("agendamento_id", guiaOriginal.agendamento_id)
      .neq("status", "cancelada");
    
    if (guiasError) {
      console.error('Erro ao buscar guias relacionadas:', guiasError);
      throw guiasError;
    }

    // 3. Cancelar todas as guias relacionadas
    if (guiasRelacionadas && guiasRelacionadas.length > 0) {
      console.log(`Cancelando ${guiasRelacionadas.length} guias relacionadas`);
      
      for (const guia of guiasRelacionadas) {
        try {
          await this.cancelarGuiaIndividual(guia.id);
        } catch (error) {
          console.error(`Erro ao cancelar guia ${guia.id}:`, error);
          // Continua com as outras guias mesmo se uma falhar
        }
      }
    }

    // 4. Cancelar a venda
    const { data: vendaCancelada, error: vendaError } = await supabase
      .from("vendas")
      .update({ status: 'cancelada' })
      .eq("id", guiaOriginal.agendamento_id)
      .select()
      .single();
    
    if (vendaError) {
      console.error('Erro ao cancelar venda:', vendaError);
      throw vendaError;
    }

    console.log('Pedido cancelado com sucesso:', {
      vendaId: vendaCancelada.id,
      guiasCanceladas: guiasRelacionadas?.length || 0
    });

    return {
      venda: vendaCancelada,
      guiasCanceladas: guiasRelacionadas || []
    };
  }

  // Buscar guias relacionadas a um pedido
  static async buscarGuiasRelacionadas(guiaId: string) {
    // Buscar a guia original
    const { data: guiaOriginal, error: guiaError } = await supabase
      .from("guias")
      .select("agendamento_id")
      .eq("id", guiaId)
      .single();
    
    if (guiaError) throw guiaError;
    if (!guiaOriginal.agendamento_id) return [];

    // Buscar todas as guias do mesmo pedido
    const { data: guiasRelacionadas, error: guiasError } = await supabase
      .from("guias")
      .select(`
        *,
        servicos (nome, categoria),
        prestadores (nome),
        clientes (nome)
      `)
      .eq("agendamento_id", guiaOriginal.agendamento_id)
      .neq("status", "cancelada");
    
    if (guiasError) throw guiasError;
    return guiasRelacionadas || [];
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
