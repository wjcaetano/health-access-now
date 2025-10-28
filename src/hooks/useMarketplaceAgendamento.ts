import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { addDays } from 'date-fns';

interface AgendamentoData {
  clienteId: string;
  servicoId: string;
  prestadorId: string;
  dataAgendamento: Date;
  horario: string;
}

export function useMarketplaceAgendamento() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AgendamentoData) => {
      // 1. Buscar dados do serviço
      const { data: servico, error: servicoError } = await supabase
        .from('servicos')
        .select('*, prestador:prestadores(*)')
        .eq('id', data.servicoId)
        .single();

      if (servicoError) throw servicoError;

      // 2. Criar orçamento
      const { data: orcamento, error: orcamentoError } = await supabase
        .from('orcamentos')
        .insert({
          cliente_id: data.clienteId,
          servico_id: data.servicoId,
          prestador_id: data.prestadorId,
          valor_custo: servico.valor_custo,
          valor_venda: servico.valor_venda,
          valor_final: servico.valor_venda,
          status: 'pendente',
          data_validade: addDays(new Date(), 7).toISOString(),
          observacoes: `Agendamento solicitado para ${data.dataAgendamento.toLocaleDateString('pt-BR')} às ${data.horario}`
        })
        .select()
        .single();

      if (orcamentoError) throw orcamentoError;

      // 3. Criar notificação para o cliente
      await supabase.rpc('create_notification', {
        target_user_id: data.clienteId,
        notification_title: 'Orçamento criado',
        notification_message: `Seu orçamento para ${servico.nome} foi criado e está aguardando aprovação.`,
        notification_type: 'info'
      });

      return orcamento;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orcamentos'] });
      toast({
        title: 'Solicitação enviada!',
        description: 'Seu orçamento foi criado. Você receberá uma notificação quando for aprovado.',
        variant: 'default'
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar orçamento',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      });
    }
  });
}
