import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

export type TipoRelatorio = 
  | 'vendas'
  | 'agendamentos'
  | 'prestadores'
  | 'clientes'
  | 'avaliacoes'
  | 'financeiro';

export interface FiltrosRelatorio {
  tipo: TipoRelatorio;
  dataInicio: Date;
  dataFim: Date;
  organizacaoId?: string;
  prestadorId?: string;
  formato?: 'csv' | 'pdf' | 'excel';
}

export function useGerarRelatorio() {
  return useMutation({
    mutationFn: async (filtros: FiltrosRelatorio) => {
      let data: any[] = [];

      switch (filtros.tipo) {
        case 'vendas':
          const vendas = await supabase
            .from('vendas')
            .select(`
              *,
              cliente:clientes(nome, cpf),
              vendas_servicos(
                servico:servicos(nome, categoria),
                prestador:prestadores(nome)
              )
            `)
            .gte('created_at', filtros.dataInicio.toISOString())
            .lte('created_at', filtros.dataFim.toISOString());
          data = vendas.data || [];
          break;

        case 'agendamentos':
          const agendamentos = await supabase
            .from('agendamentos')
            .select(`
              *,
              cliente:clientes(nome, cpf, telefone),
              servico:servicos(nome, categoria),
              prestador:prestadores(nome, tipo)
            `)
            .gte('data_agendamento', filtros.dataInicio.toISOString())
            .lte('data_agendamento', filtros.dataFim.toISOString());
          data = agendamentos.data || [];
          break;

        case 'prestadores':
          const prestadores = await supabase
            .from('prestadores')
            .select(`
              *,
              organizacao:organizacoes(nome, tipo_organizacao)
            `)
            .eq('ativo', true);
          data = prestadores.data || [];
          break;

        case 'clientes':
          const clientes = await supabase
            .from('clientes')
            .select('*')
            .gte('data_cadastro', filtros.dataInicio.toISOString())
            .lte('data_cadastro', filtros.dataFim.toISOString());
          data = clientes.data || [];
          break;

        case 'avaliacoes':
          const avaliacoes = await supabase
            .from('avaliacoes')
            .select(`
              *,
              cliente:clientes(nome),
              prestador:prestadores(nome, tipo)
            `)
            .gte('created_at', filtros.dataInicio.toISOString())
            .lte('created_at', filtros.dataFim.toISOString());
          data = avaliacoes.data || [];
          break;

        case 'financeiro':
          const [vendasFin, contasPagar, contasReceber] = await Promise.all([
            supabase
              .from('vendas')
              .select('valor_total, created_at, metodo_pagamento')
              .gte('created_at', filtros.dataInicio.toISOString())
              .lte('created_at', filtros.dataFim.toISOString()),
            supabase
              .from('contas_pagar')
              .select('valor, data_vencimento, data_pagamento, status')
              .gte('data_vencimento', filtros.dataInicio.toISOString())
              .lte('data_vencimento', filtros.dataFim.toISOString()),
            supabase
              .from('contas_receber')
              .select('valor, data_vencimento, data_pagamento, status')
              .gte('data_vencimento', filtros.dataInicio.toISOString())
              .lte('data_vencimento', filtros.dataFim.toISOString())
          ]);

          // Combinar todos os dados em um único array
          data = [
            ...(vendasFin.data || []).map(v => ({ ...v, tipo: 'venda' })),
            ...(contasPagar.data || []).map(c => ({ ...c, tipo: 'conta_pagar' })),
            ...(contasReceber.data || []).map(c => ({ ...c, tipo: 'conta_receber' }))
          ];
          break;
      }

      return { data, filtros };
    },
    onSuccess: () => {
      toast.success('Relatório gerado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao gerar relatório');
    }
  });
}

export function useExportarCSV() {
  return useMutation({
    mutationFn: async ({ data, tipo }: { data: any[]; tipo: TipoRelatorio }) => {
      if (!data.length) {
        throw new Error('Nenhum dado para exportar');
      }

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            if (typeof value === 'object') return JSON.stringify(value);
            if (typeof value === 'string') return `"${value}"`;
            return value;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-${tipo}-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      return true;
    },
    onSuccess: () => {
      toast.success('Relatório exportado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao exportar relatório');
    }
  });
}
