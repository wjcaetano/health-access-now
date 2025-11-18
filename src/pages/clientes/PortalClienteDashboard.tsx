import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, Clock, Star, DollarSign, TrendingUp } from 'lucide-react';
import { useClienteDashboard } from '@/hooks/useClienteDashboard';
import { useClienteFinanceiro, useClienteGuias } from '@/hooks/useClientePortalData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/formatters';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

/**
 * Dashboard do Portal do Cliente
 * Mostra resumo dos agendamentos e histórico com dados reais
 */
export const PortalClienteDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { proximosAgendamentos, historicoGuias, metricas } = useClienteDashboard(profile?.cliente_id);
  const { data: financeiro, isLoading: isLoadingFinanceiro } = useClienteFinanceiro(profile?.cliente_id);
  const { data: guias = [], isLoading: isLoadingGuias } = useClienteGuias(profile?.cliente_id);

  if (proximosAgendamentos.isLoading || historicoGuias.isLoading || isLoadingFinanceiro || isLoadingGuias) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const guiasRealizadas = guias.filter((g: any) => 
    ['realizada', 'faturada', 'paga'].includes(g.status)
  ).length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Bem-vindo, {profile?.nome || 'Cliente'}</h1>
        <p className="text-muted-foreground">
          Gerencie seus agendamentos e histórico de serviços
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Próximos Agendamentos
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.totalAgendamentosFuturos}</div>
            <p className="text-xs text-muted-foreground">
              agendamentos futuros
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Guias Realizadas
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guiasRealizadas}</div>
            <p className="text-xs text-muted-foreground">
              serviços completos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Investido
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(financeiro?.totalGasto || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              em serviços
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avaliação Média
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricas.ultimaAvaliacao ? `${metricas.ultimaAvaliacao}/5` : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {metricas.ultimaAvaliacao ? 'estrelas' : 'sem avaliações'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Agendamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Próximos Agendamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {proximosAgendamentos.data.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Você não possui agendamentos futuros
            </p>
          ) : (
            <div className="space-y-4">
              {proximosAgendamentos.data.slice(0, 5).map((agendamento: any) => (
                <div key={agendamento.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{agendamento.servico?.nome}</h4>
                    <p className="text-sm text-muted-foreground">
                      {agendamento.prestador?.nome}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span className="text-xs">
                        {format(new Date(agendamento.data_agendamento), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                      <Clock className="h-3 w-3 ml-2" />
                      <span className="text-xs">{agendamento.horario}</span>
                    </div>
                  </div>
                  <Badge>{agendamento.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Histórico de Serviços */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Histórico de Serviços
          </CardTitle>
        </CardHeader>
        <CardContent>
          {historicoGuias.data.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum serviço realizado ainda
            </p>
          ) : (
            <div className="space-y-4">
              {historicoGuias.data.slice(0, 5).map((guia: any) => (
                <div key={guia.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{guia.servico?.nome}</h4>
                    <p className="text-sm text-muted-foreground">
                      {guia.prestador?.nome}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span className="text-xs">
                        {guia.data_realizacao && format(new Date(guia.data_realizacao), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline">{guia.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
