import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle, MessageSquare, DollarSign, Calendar, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Orcamento {
  id: string;
  cliente_id: string;
  servico_id: string;
  prestador_id: string;
  valor_final: number;
  valor_custo: number;
  valor_venda: number;
  status: string;
  data_validade: string;
  observacoes: string;
  created_at: string;
  servico?: {
    nome: string;
    descricao: string;
  };
  prestador?: {
    nome: string;
    tipo: string;
  };
}

interface AprovarOrcamentoModalProps {
  orcamento: Orcamento;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AprovarOrcamentoModal: React.FC<AprovarOrcamentoModalProps> = ({
  orcamento,
  open,
  onOpenChange
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [motivoRecusa, setMotivoRecusa] = useState('');
  const [mensagemNegociacao, setMensagemNegociacao] = useState('');

  // Aprovar orçamento
  const aprovarMutation = useMutation({
    mutationFn: async () => {
      // 1. Criar venda
      const { data: venda, error: vendaError } = await supabase
        .from('vendas')
        .insert({
          cliente_id: orcamento.cliente_id,
          valor_total: orcamento.valor_final,
          metodo_pagamento: 'pendente',
          status: 'pendente_pagamento',
          observacoes: `Convertido do orçamento ${orcamento.id}`
        })
        .select()
        .single();

      if (vendaError) throw vendaError;

      // 2. Criar vendas_servicos
      const { error: vendaServicoError } = await supabase
        .from('vendas_servicos')
        .insert({
          venda_id: venda.id,
          servico_id: orcamento.servico_id,
          prestador_id: orcamento.prestador_id,
          valor: orcamento.valor_final,
          status: 'pendente'
        });

      if (vendaServicoError) throw vendaServicoError;

      // 3. Atualizar orçamento
      const { error: orcamentoError } = await supabase
        .from('orcamentos')
        .update({
          status: 'aprovado',
          venda_id: venda.id
        })
        .eq('id', orcamento.id);

      if (orcamentoError) throw orcamentoError;

      // 4. Criar guia
      const { error: guiaError } = await supabase
        .from('guias')
        .insert({
          cliente_id: orcamento.cliente_id,
          prestador_id: orcamento.prestador_id,
          servico_id: orcamento.servico_id,
          valor: orcamento.valor_final,
          status: 'emitida',
          codigo_autenticacao: `GUIA-${Date.now()}`
        });

      if (guiaError) throw guiaError;

      return venda;
    },
    onSuccess: (venda) => {
      queryClient.invalidateQueries({ queryKey: ['cliente-orcamentos'] });
      toast({
        title: 'Orçamento aprovado!',
        description: 'Você será redirecionado para a página de pagamento.',
        variant: 'default'
      });
      onOpenChange(false);
      navigate(`/cliente/pagamento/${venda.id}`);
    },
    onError: (error) => {
      toast({
        title: 'Erro ao aprovar orçamento',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      });
    }
  });

  // Recusar orçamento
  const recusarMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('orcamentos')
        .update({
          status: 'recusado',
          observacoes: orcamento.observacoes + `\n\nMotivo da recusa: ${motivoRecusa}`
        })
        .eq('id', orcamento.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cliente-orcamentos'] });
      toast({
        title: 'Orçamento recusado',
        description: 'O prestador foi notificado.',
        variant: 'default'
      });
      onOpenChange(false);
      setMotivoRecusa('');
    },
    onError: (error) => {
      toast({
        title: 'Erro ao recusar orçamento',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      });
    }
  });

  // Negociar orçamento
  const negociarMutation = useMutation({
    mutationFn: async () => {
      // Criar mensagem para atendente
      const { error } = await supabase
        .from('mensagens')
        .insert({
          cliente_id: orcamento.cliente_id,
          tipo: 'enviada',
          texto: `Negociação do orçamento ${orcamento.id}: ${mensagemNegociacao}`
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Mensagem enviada',
        description: 'Nossa equipe entrará em contato em breve.',
        variant: 'default'
      });
      onOpenChange(false);
      setMensagemNegociacao('');
    },
    onError: (error) => {
      toast({
        title: 'Erro ao enviar mensagem',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      });
    }
  });

  const isLoading = aprovarMutation.isPending || recusarMutation.isPending || negociarMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Orçamento</DialogTitle>
          <DialogDescription>
            Revise as informações e escolha uma ação
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo do Orçamento */}
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div>
              <h3 className="font-semibold">{orcamento.servico?.nome}</h3>
              {orcamento.servico?.descricao && (
                <p className="text-sm text-muted-foreground mt-1">
                  {orcamento.servico.descricao}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Prestador:</span>
                <p className="font-medium mt-1">{orcamento.prestador?.nome}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Tipo:</span>
                <p className="font-medium mt-1 capitalize">{orcamento.prestador?.tipo}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="text-sm text-muted-foreground">Valor Total</div>
              <div className="flex items-center gap-1 text-primary font-semibold text-lg">
                <DollarSign className="h-5 w-5" />
                {formatCurrency(orcamento.valor_final)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-border">
              <div>
                <span className="text-muted-foreground">Data de Criação:</span>
                <p className="font-medium mt-1">
                  {format(new Date(orcamento.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Válido até:</span>
                <p className="font-medium mt-1">
                  {format(new Date(orcamento.data_validade), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
            </div>

            {orcamento.observacoes && (
              <div className="pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Observações:</span>
                <p className="text-sm mt-1">{orcamento.observacoes}</p>
              </div>
            )}
          </div>

          {/* Ações */}
          {orcamento.status === 'pendente' && (
            <Tabs defaultValue="aprovar" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="aprovar">Aprovar</TabsTrigger>
                <TabsTrigger value="recusar">Recusar</TabsTrigger>
                <TabsTrigger value="negociar">Negociar</TabsTrigger>
              </TabsList>

              <TabsContent value="aprovar" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Ao aprovar, uma venda será criada e você será redirecionado para o pagamento.
                </p>
                <Button
                  className="w-full"
                  onClick={() => aprovarMutation.mutate()}
                  disabled={isLoading}
                >
                  {aprovarMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Aprovar e Prosseguir para Pagamento
                </Button>
              </TabsContent>

              <TabsContent value="recusar" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="motivo">Motivo da Recusa (opcional)</Label>
                  <Textarea
                    id="motivo"
                    value={motivoRecusa}
                    onChange={(e) => setMotivoRecusa(e.target.value)}
                    placeholder="Explique o motivo da recusa..."
                    rows={4}
                  />
                </div>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => recusarMutation.mutate()}
                  disabled={isLoading}
                >
                  {recusarMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <XCircle className="mr-2 h-4 w-4" />
                  Recusar Orçamento
                </Button>
              </TabsContent>

              <TabsContent value="negociar" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mensagem">Mensagem para Negociação</Label>
                  <Textarea
                    id="mensagem"
                    value={mensagemNegociacao}
                    onChange={(e) => setMensagemNegociacao(e.target.value)}
                    placeholder="Descreva o que gostaria de negociar..."
                    rows={4}
                  />
                </div>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => negociarMutation.mutate()}
                  disabled={!mensagemNegociacao.trim() || isLoading}
                >
                  {negociarMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Enviar Proposta de Negociação
                </Button>
              </TabsContent>
            </Tabs>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
