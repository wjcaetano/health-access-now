import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Página de Agendamentos do Cliente
 * Lista todos os agendamentos do cliente logado
 */
export const PortalClienteAgendamentos: React.FC = () => {
  const { profile } = useAuth();

  const { data: agendamentos = [], isLoading } = useQuery({
    queryKey: ['meus-agendamentos', profile?.cliente_id],
    queryFn: async () => {
      if (!profile?.cliente_id) return [];
      
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          servico:servicos(nome, categoria),
          prestador:prestadores(nome, tipo),
          cliente:clientes(nome)
        `)
        .eq('cliente_id', profile.cliente_id)
        .order('data_agendamento', { ascending: true })
        .order('horario', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.cliente_id,
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'confirmado': 'bg-green-500',
      'pendente': 'bg-yellow-500',
      'cancelado': 'bg-red-500',
      'realizado': 'bg-blue-500',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Meus Agendamentos</h1>
        <p className="text-muted-foreground">
          Visualize todos os seus agendamentos
        </p>
      </div>

      {agendamentos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Nenhum agendamento encontrado</p>
            <p className="text-sm text-muted-foreground">
              Entre em contato para agendar seus serviços
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {agendamentos.map((agendamento) => (
            <Card key={agendamento.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {agendamento.servico?.nome || 'Serviço'}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {agendamento.servico?.categoria || ''}
                    </p>
                  </div>
                  <Badge className={getStatusColor(agendamento.status)}>
                    {agendamento.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(new Date(agendamento.data_agendamento), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{agendamento.horario}</span>
                  </div>
                  {agendamento.prestador && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {agendamento.prestador.nome} - {agendamento.prestador.tipo}
                      </span>
                    </div>
                  )}
                  {agendamento.observacoes && (
                    <div className="mt-2 p-3 bg-muted rounded-md">
                      <p className="text-sm">{agendamento.observacoes}</p>
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
