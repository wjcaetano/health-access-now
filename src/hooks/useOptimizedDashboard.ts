import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

// Hook otimizado que combina múltiplas queries em uma única
export function useOptimizedDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats-optimized"],
    queryFn: async () => {
      // Usar uma única query com counts para reduzir requests
      const [clientesCount, agendamentosData, mensagensCount] = await Promise.all([
        // Count otimizado para clientes
        supabase
          .from("clientes")
          .select("*", { count: "exact", head: true }),
        
        // Buscar agendamentos com filtro de data mais eficiente
        supabase
          .from("agendamentos")
          .select("status, data_agendamento")
          .gte("data_agendamento", new Date().toISOString().split('T')[0])
          .lte("data_agendamento", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
        
        // Count otimizado para mensagens não lidas
        supabase
          .from("mensagens")
          .select("*", { count: "exact", head: true })
          .eq("lida", false)
      ]);

      const hoje = new Date().toISOString().split('T')[0];
      
      // Processar dados no cliente para reduzir queries
      const agendamentosConfirmados = agendamentosData.data?.filter(a => 
        ['confirmado', 'agendado'].includes(a.status)
      ).length || 0;

      const agendamentosHoje = agendamentosData.data?.filter(a => 
        a.data_agendamento === hoje
      ).length || 0;

      return {
        totalClientes: clientesCount.count || 0,
        agendamentosConfirmados,
        agendamentosHoje,
        mensagensNaoLidas: mensagensCount.count || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });
}

export function useOptimizedRecentData() {
  return useQuery({
    queryKey: ["recent-data-optimized"],
    queryFn: async () => {
      // Uma única query com todas as relações necessárias
      const [agendamentos, orcamentos, mensagens] = await Promise.all([
        supabase
          .from("agendamentos")
          .select(`
            id, status, data_agendamento, horario, observacoes, created_at,
            clientes!inner(nome, cpf, telefone),
            servicos!inner(nome, categoria),
            prestadores!inner(nome, tipo)
          `)
          .order("created_at", { ascending: false })
          .limit(5),
        
        supabase
          .from("orcamentos")
          .select(`
            id, status, valor_final, data_validade, created_at,
            clientes!inner(id, nome, cpf),
            servicos!inner(id, nome, categoria),
            prestadores!inner(id, nome)
          `)
          .order("created_at", { ascending: false })
          .limit(5),
        
        supabase
          .from("mensagens")
          .select(`
            id, texto, lida, created_at,
            clientes!inner(nome, telefone)
          `)
          .order("created_at", { ascending: false })
          .limit(5)
      ]);

      return {
        agendamentos: agendamentos.data || [],
        orcamentos: orcamentos.data || [],
        mensagens: mensagens.data?.map(msg => ({
          id: msg.id,
          nome: msg.clientes?.nome || 'Cliente Desconhecido',
          telefone: msg.clientes?.telefone || 'N/A',
          mensagem: msg.texto,
          horario: new Date(msg.created_at).toLocaleDateString('pt-BR'),
          naoLida: !msg.lida,
        })) || []
      };
    },
    staleTime: 3 * 60 * 1000, // 3 minutos
    gcTime: 8 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// Hook que combina estatísticas da unidade em uma query
export function useOptimizedUnitDashboard() {
  return useQuery({
    queryKey: ["unit-dashboard-optimized"],
    queryFn: async () => {
      const hoje = new Date().toISOString().split('T')[0];
      
      // Fallback para queries individuais otimizadas
      const [vendas, agendamentos, clientes, prestadores] = await Promise.all([
          supabase
            .from("vendas")
            .select("valor_total")
            .gte("created_at", hoje),
          
          supabase
            .from("agendamentos")
            .select("id")
            .eq("data_agendamento", hoje),
          
          supabase
            .from("clientes")
            .select("id", { count: "exact", head: true }),
          
          supabase
            .from("prestadores")
            .select("id", { count: "exact", head: true })
            .eq("ativo", true)
      ]);

      const vendasHoje = vendas.data?.length || 0;
      const faturamentoHoje = vendas.data?.reduce((sum, v) => sum + Number(v.valor_total), 0) || 0;
      const agendamentosHoje = agendamentos.data?.length || 0;
      const totalClientes = clientes.count || 0;
      const prestadoresAtivos = prestadores.count || 0;

      return {
        vendasHoje,
        faturamentoHoje,
        agendamentosHoje,
        totalClientes,
        prestadoresAtivos,
        metaDiaria: 3000,
        percentualMeta: faturamentoHoje > 0 ? (faturamentoHoje / 3000) * 100 : 0
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}