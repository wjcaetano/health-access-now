import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const hoje = new Date();
      const inicioMes = startOfMonth(hoje);
      const fimMes = endOfMonth(hoje);

      // 1. Total de vendas do mês
      const { count: vendasMes, error: vendasError } = await supabase
        .from('vendas')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', inicioMes.toISOString())
        .lte('created_at', fimMes.toISOString())
        .eq('status', 'concluida');

      if (vendasError) throw vendasError;

      // 2. Faturamento do mês
      const { data: vendasData, error: faturamentoError } = await supabase
        .from('vendas')
        .select('valor_total')
        .gte('created_at', inicioMes.toISOString())
        .lte('created_at', fimMes.toISOString())
        .eq('status', 'concluida');

      if (faturamentoError) throw faturamentoError;

      const faturamentoMes = vendasData?.reduce((sum, v) => sum + Number(v.valor_total), 0) || 0;

      // 3. Total de clientes ativos
      const { count: clientesAtivos, error: clientesError } = await supabase
        .from('clientes')
        .select('*', { count: 'exact', head: true });

      if (clientesError) throw clientesError;

      // 4. Orçamentos pendentes
      const { count: orcamentosPendentes, error: orcamentosError } = await supabase
        .from('orcamentos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente');

      if (orcamentosError) throw orcamentosError;

      // 5. Agendamentos de hoje
      const hoje_str = format(hoje, 'yyyy-MM-dd');
      const { count: agendamentosHoje, error: agendamentosError } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true })
        .eq('data_agendamento', hoje_str)
        .in('status', ['confirmado', 'realizado']);

      if (agendamentosError) throw agendamentosError;

      // 6. Guias pendentes
      const { count: guiasPendentes, error: guiasError } = await supabase
        .from('guias')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'emitida');

      if (guiasError) throw guiasError;

      // 7. Total de prestadores
      const { count: totalPrestadores, error: prestadoresError } = await supabase
        .from('prestadores')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', true);

      if (prestadoresError) throw prestadoresError;

      // 8. Total de serviços
      const { count: totalServicos, error: servicosError } = await supabase
        .from('servicos')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', true);

      if (servicosError) throw servicosError;

      return {
        vendasMes: vendasMes || 0,
        faturamentoMes,
        clientesAtivos: clientesAtivos || 0,
        orcamentosPendentes: orcamentosPendentes || 0,
        agendamentosHoje: agendamentosHoje || 0,
        guiasPendentes: guiasPendentes || 0,
        totalPrestadores: totalPrestadores || 0,
        totalServicos: totalServicos || 0,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

export function useDashboardGraficoVendas() {
  return useQuery({
    queryKey: ['dashboard-grafico-vendas'],
    queryFn: async () => {
      const hoje = new Date();
      const inicioMes = startOfMonth(hoje);

      const { data, error } = await supabase
        .from('vendas')
        .select('created_at, valor_total')
        .gte('created_at', inicioMes.toISOString())
        .eq('status', 'concluida')
        .order('created_at');

      if (error) throw error;

      // Agrupar por dia
      const vendasPorDia = data?.reduce((acc, venda) => {
        const dia = format(new Date(venda.created_at), 'dd/MM');
        if (!acc[dia]) {
          acc[dia] = { dia, total: 0, quantidade: 0 };
        }
        acc[dia].total += Number(venda.valor_total);
        acc[dia].quantidade += 1;
        return acc;
      }, {} as Record<string, { dia: string; total: number; quantidade: number }>);

      return Object.values(vendasPorDia || {});
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useDashboardVendasRecentes() {
  return useQuery({
    queryKey: ['dashboard-vendas-recentes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendas')
        .select(`
          id,
          created_at,
          valor_total,
          metodo_pagamento,
          status,
          clientes (
            id,
            nome,
            cpf,
            telefone
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useDashboardOrcamentosRecentes() {
  return useQuery({
    queryKey: ['dashboard-orcamentos-recentes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orcamentos')
        .select(`
          id,
          created_at,
          valor_final,
          status,
          data_validade,
          clientes (
            id,
            nome,
            cpf
          ),
          servicos (
            id,
            nome,
            categoria
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    staleTime: 2 * 60 * 1000,
  });
}
