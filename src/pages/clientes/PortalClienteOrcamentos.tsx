import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, CheckCircle, XCircle, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { AprovarOrcamentoModal } from '@/components/marketplace/AprovarOrcamentoModal';

interface Orcamento {
  id: string;
  cliente_id: string;
  servico_id: string;
  prestador_id: string;
  valor_custo: number;
  valor_venda: number;
  valor_final: number;
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

export default function PortalClienteOrcamentos() {
  const { profile } = useAuth();
  const [selectedOrcamento, setSelectedOrcamento] = useState<Orcamento | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data: orcamentos, isLoading } = useQuery({
    queryKey: ['cliente-orcamentos', profile?.cliente_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orcamentos')
        .select(`
          *,
          servico:servicos(nome, descricao),
          prestador:prestadores(nome, tipo)
        `)
        .eq('cliente_id', profile?.cliente_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Orcamento[];
    },
    enabled: !!profile?.cliente_id
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; label: string }> = {
      pendente: { variant: 'secondary', label: 'Pendente' },
      aprovado: { variant: 'default', label: 'Aprovado' },
      recusado: { variant: 'destructive', label: 'Recusado' },
      expirado: { variant: 'outline', label: 'Expirado' }
    };

    const statusInfo = statusMap[status] || statusMap.pendente;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const handleViewOrcamento = (orcamento: Orcamento) => {
    setSelectedOrcamento(orcamento);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Meus Orçamentos</h2>
        <p className="text-muted-foreground mt-1">
          Visualize e aprove seus orçamentos de serviços
        </p>
      </div>

      {!orcamentos?.length ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Você ainda não possui orçamentos
            </p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Explore o marketplace e solicite serviços para receber orçamentos
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orcamentos.map((orcamento) => (
            <Card key={orcamento.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {orcamento.servico?.nome || 'Serviço'}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {orcamento.prestador?.nome}
                    </p>
                  </div>
                  {getStatusBadge(orcamento.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orcamento.servico?.descricao && (
                    <p className="text-sm text-muted-foreground">
                      {orcamento.servico.descricao}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Valor:</span>
                      <div className="flex items-center gap-1 font-semibold text-primary mt-1">
                        <DollarSign className="h-4 w-4" />
                        {formatCurrency(orcamento.valor_final)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Validade:</span>
                      <p className="font-medium mt-1">
                        {format(new Date(orcamento.data_validade), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                  </div>

                  {orcamento.observacoes && (
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-xs font-medium mb-1">Observações:</p>
                      <p className="text-sm">{orcamento.observacoes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewOrcamento(orcamento)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>

                    {orcamento.status === 'pendente' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleViewOrcamento(orcamento)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Aprovar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedOrcamento && (
        <AprovarOrcamentoModal
          orcamento={selectedOrcamento}
          open={showModal}
          onOpenChange={setShowModal}
        />
      )}
    </div>
  );
}
