import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, User, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useClienteGuias } from '@/hooks/useClientePortalData';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { formatCurrency } from '@/lib/formatters';

/**
 * Página de Guias e Histórico de Serviços do Cliente
 * Exibe todas as guias emitidas para o cliente
 */
export const PortalClienteGuias: React.FC = () => {
  const { profile } = useAuth();
  const { data: guias = [], isLoading } = useClienteGuias(profile?.cliente_id);

  const getStatusColor = (status: string) => {
    const colors = {
      'emitida': 'bg-blue-500',
      'realizada': 'bg-green-500',
      'faturada': 'bg-purple-500',
      'paga': 'bg-emerald-500',
      'cancelada': 'bg-red-500',
      'estornada': 'bg-orange-500',
      'expirada': 'bg-gray-500',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'emitida': 'Emitida',
      'realizada': 'Realizada',
      'faturada': 'Faturada',
      'paga': 'Paga',
      'cancelada': 'Cancelada',
      'estornada': 'Estornada',
      'expirada': 'Expirada',
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Minhas Guias e Histórico</h1>
        <p className="text-muted-foreground">
          Acompanhe todas as guias de serviços emitidas para você
        </p>
      </div>

      {guias.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Nenhuma guia encontrada</p>
            <p className="text-sm text-muted-foreground">
              Suas guias de serviços aparecerão aqui
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {guias.map((guia: any) => (
            <Card key={guia.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {guia.servico?.nome || 'Serviço'}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {guia.servico?.categoria || ''}
                    </p>
                    {guia.servico?.descricao && (
                      <p className="text-sm text-muted-foreground">
                        {guia.servico.descricao}
                      </p>
                    )}
                  </div>
                  <Badge className={getStatusColor(guia.status)}>
                    {getStatusLabel(guia.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Código: {guia.codigo_autenticacao}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {guia.prestador?.nome || 'Prestador'}
                      {guia.prestador?.tipo && ` (${guia.prestador.tipo})`}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Emitida em: {format(new Date(guia.data_emissao), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  
                  {guia.data_realizacao && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Realizada em: {format(new Date(guia.data_realizacao), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">
                      Valor: {formatCurrency(guia.valor)}
                    </span>
                  </div>

                  {guia.agendamento?.data_agendamento && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Agendado para: {format(new Date(guia.agendamento.data_agendamento), "dd/MM/yyyy", { locale: ptBR })}
                        {guia.agendamento.horario && ` às ${guia.agendamento.horario}`}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortalClienteGuias;
