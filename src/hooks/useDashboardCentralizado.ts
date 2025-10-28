import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, startOfYear, subMonths } from 'date-fns';

export function useMetricasGlobais() {
  return useQuery({
    queryKey: ['metricas-globais'],
    queryFn: async () => {
      const hoje = new Date();
      const inicioMes = startOfMonth(hoje);
      const fimMes = endOfMonth(hoje);

      const [vendas, clientes, prestadores, agendamentos, avaliacoes] = await Promise.all([
        supabase
          .from('vendas')
          .select('valor_total, created_at')
          .gte('created_at', inicioMes.toISOString())
          .lte('created_at', fimMes.toISOString()),
        
        supabase
          .from('clientes')
          .select('id'),
        
        supabase
          .from('prestadores')
          .select('id')
          .eq('ativo', true),
        
        supabase
          .from('agendamentos')
          .select('id, status')
          .gte('data_agendamento', inicioMes.toISOString())
          .lte('data_agendamento', fimMes.toISOString()),
        
        supabase
          .from('avaliacoes')
          .select('nota')
      ]);

      const faturamentoMensal = vendas.data?.reduce((sum, v) => sum + Number(v.valor_total), 0) || 0;
      const totalClientes = clientes.data?.length || 0;
      const totalPrestadores = prestadores.data?.length || 0;
      const agendamentosMes = agendamentos.data?.length || 0;
      const agendamentosConfirmados = agendamentos.data?.filter(a => a.status === 'confirmado').length || 0;
      
      const mediaAvaliacoes = avaliacoes.data?.length 
        ? avaliacoes.data.reduce((sum, a) => sum + a.nota, 0) / avaliacoes.data.length
        : 0;

      return {
        faturamentoMensal,
        totalClientes,
        totalPrestadores,
        agendamentosMes,
        agendamentosConfirmados,
        mediaAvaliacoes: Number(mediaAvaliacoes.toFixed(2)),
        totalAvaliacoes: avaliacoes.data?.length || 0
      };
    }
  });
}

export function useFaturamentoPorMes() {
  return useQuery({
    queryKey: ['faturamento-por-mes'],
    queryFn: async () => {
      const hoje = new Date();
      const ultimos6Meses = subMonths(hoje, 6);

      const { data, error } = await supabase
        .from('vendas')
        .select('valor_total, created_at')
        .gte('created_at', ultimos6Meses.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Agrupar por mês
      const faturamentoPorMes = new Map<string, number>();
      
      data.forEach(venda => {
        const mes = new Date(venda.created_at).toLocaleDateString('pt-BR', { 
          month: 'short', 
          year: 'numeric' 
        });
        const atual = faturamentoPorMes.get(mes) || 0;
        faturamentoPorMes.set(mes, atual + Number(venda.valor_total));
      });

      return Array.from(faturamentoPorMes.entries()).map(([mes, faturamento]) => ({
        mes,
        faturamento
      }));
    }
  });
}

export function useTopPrestadores(limit: number = 10) {
  return useQuery({
    queryKey: ['top-prestadores', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prestadores')
        .select('id, nome, tipo, media_avaliacoes, total_avaliacoes')
        .eq('ativo', true)
        .order('media_avaliacoes', { ascending: false })
        .order('total_avaliacoes', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    }
  });
}

export function useDistribuicaoServicos() {
  return useQuery({
    queryKey: ['distribuicao-servicos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('servicos')
        .select('categoria')
        .eq('ativo', true);

      if (error) throw error;

      const distribuicao = new Map<string, number>();
      data.forEach(servico => {
        const atual = distribuicao.get(servico.categoria) || 0;
        distribuicao.set(servico.categoria, atual + 1);
      });

      return Array.from(distribuicao.entries()).map(([categoria, quantidade]) => ({
        categoria,
        quantidade
      }));
    }
  });
}

export function useOrganizacoesPorTipo() {
  return useQuery({
    queryKey: ['organizacoes-por-tipo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizacoes')
        .select('tipo_organizacao')
        .eq('status', 'ativo');

      if (error) throw error;

      const distribuicao = new Map<string, number>();
      data.forEach(org => {
        const atual = distribuicao.get(org.tipo_organizacao) || 0;
        distribuicao.set(org.tipo_organizacao, atual + 1);
      });

      return Array.from(distribuicao.entries()).map(([tipo, quantidade]) => ({
        tipo,
        quantidade
      }));
    }
  });
}
