
import { GuiaComVendas, STATUS_TRANSITIONS, UserType, GuiaStatus } from "@/types/guias";

export const isStatusTransitionAllowed = (
  currentStatus: GuiaStatus, 
  newStatus: string, 
  userType: UserType
): boolean => {
  const allowedTransitions = STATUS_TRANSITIONS[userType][currentStatus];
  return allowedTransitions?.includes(newStatus as GuiaStatus) || false;
};

export const calcularDiasParaExpiracao = (dataEmissao: string): number => {
  const emissao = new Date(dataEmissao);
  const expiracao = new Date(emissao.getTime() + (30 * 24 * 60 * 60 * 1000));
  const hoje = new Date();
  
  return Math.ceil((expiracao.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
};

export const processGuiasWithExpiration = (guias: GuiaComVendas[]): GuiaComVendas[] => {
  return guias.map(guia => {
    const dataEmissao = new Date(guia.data_emissao);
    const dataExpiracao = new Date(dataEmissao.getTime() + (30 * 24 * 60 * 60 * 1000));
    const hoje = new Date();
    
    // Se a guia está emitida e passou de 30 dias, marcar como expirada
    if (guia.status === 'emitida' && hoje > dataExpiracao) {
      return { ...guia, status: 'expirada', data_expiracao: dataExpiracao.toISOString() };
    }
    
    return { ...guia, data_expiracao: dataExpiracao.toISOString() };
  });
};

export const processGuiasWithVendas = async (guias: GuiaComVendas[]): Promise<GuiaComVendas[]> => {
  const { GuiasService } = await import("@/services/guiasService");
  
  return Promise.all(
    guias.map(async (guia): Promise<GuiaComVendas> => {
      if (guia.agendamento_id) {
        const vendasServicos = await GuiasService.fetchVendasServicos(guia.agendamento_id);
        
        if (vendasServicos && Array.isArray(vendasServicos)) {
          return {
            ...guia,
            vendas_servicos: vendasServicos
          } as GuiaComVendas;
        }
      }
      
      return guia as GuiaComVendas;
    })
  );
};
