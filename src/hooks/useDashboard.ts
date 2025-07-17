
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      // Buscar total de clientes
      const { data: clientesData, error: clientesError } = await supabase
        .from("clientes")
        .select("id", { count: "exact" });
      
      if (clientesError) throw clientesError;

      // Buscar agendamentos por status
      const { data: agendamentosData, error: agendamentosError } = await supabase
        .from("agendamentos")
        .select("id, status, data_agendamento");
      
      if (agendamentosError) throw agendamentosError;

      // Buscar mensagens não lidas
      const { data: mensagensData, error: mensagensError } = await supabase
        .from("mensagens")
        .select("id, lida")
        .eq("lida", false);
      
      if (mensagensError) throw mensagensError;

      // Calcular agendamentos confirmados
      const agendamentosConfirmados = agendamentosData?.filter(a => a.status === 'confirmado' || a.status === 'agendado').length || 0;

      // Calcular agendamentos de hoje
      const hoje = new Date();
      const agendamentosHoje = agendamentosData?.filter(a => {
        const dataAgendamento = new Date(a.data_agendamento);
        return dataAgendamento.getDate() === hoje.getDate() &&
               dataAgendamento.getMonth() === hoje.getMonth() &&
               dataAgendamento.getFullYear() === hoje.getFullYear();
      }).length || 0;

      return {
        totalClientes: clientesData?.length || 0,
        agendamentosConfirmados,
        agendamentosHoje,
        mensagensNaoLidas: mensagensData?.length || 0
      };
    },
  });
}

export function useAgendamentosRecentes() {
  return useQuery({
    queryKey: ["agendamentos-recentes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agendamentos")
        .select(`
          *,
          clientes (nome, cpf, telefone),
          servicos (nome, categoria),
          prestadores (nome, tipo)
        `)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useOrcamentosRecentes() {
  return useQuery({
    queryKey: ["orcamentos-recentes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orcamentos")
        .select(`
          *,
          clientes (
            id,
            nome,
            cpf
          ),
          servicos (
            id,
            nome,
            categoria
          ),
          prestadores (
            id,
            nome
          )
        `)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useMensagensRecentes() {
  return useQuery({
    queryKey: ["mensagens-recentes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mensagens")
        .select(`
          *,
          clientes (nome, telefone)
        `)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      // Transformar os dados para o formato esperado
      return data?.map(msg => ({
        id: msg.id,
        nome: msg.clientes?.nome || 'Cliente Desconhecido',
        telefone: msg.clientes?.telefone || 'N/A',
        mensagem: msg.texto,
        horario: new Date(msg.created_at).toLocaleDateString('pt-BR'),
        naoLida: !msg.lida,
      })) || [];
    },
  });
}
