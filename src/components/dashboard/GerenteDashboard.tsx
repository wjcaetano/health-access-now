import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  FileText,
  Briefcase,
  ClipboardList,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardMetrics } from "@/hooks/useDashboardRealData";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export const GerenteDashboard: React.FC = () => {
  const { data: metricas, isLoading } = useDashboardMetrics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-background rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Painel Gerencial</h2>
            <p className="text-muted-foreground">
              Visão estratégica e gestão operacional completa
            </p>
          </div>
          <BarChart3 className="h-12 w-12 text-blue-500 opacity-20" />
        </div>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-auto flex-col gap-2 p-4 hover-scale">
              <Link to="/hub/dashboard-estrategico">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Dashboard Estratégico</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-2 p-4 hover-scale">
              <Link to="/hub/relatorios">
                <ClipboardList className="h-6 w-6" />
                <span className="text-sm">Relatórios</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-2 p-4 hover-scale">
              <Link to="/hub/financeiro">
                <DollarSign className="h-6 w-6" />
                <span className="text-sm">Financeiro</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-2 p-4 hover-scale">
              <Link to="/hub/prestadores">
                <Briefcase className="h-6 w-6" />
                <span className="text-sm">Prestadores</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita do Mês
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(metricas?.faturamentoMes || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {metricas?.vendasMes || 0} vendas concluídas
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vendas do Mês
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas?.vendasMes || 0}</div>
            <p className="text-xs text-muted-foreground">
              Ticket médio: R$ {metricas?.vendasMes ? (metricas.faturamentoMes / metricas.vendasMes).toFixed(2) : '0,00'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Agendamentos
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas?.agendamentosHoje || 0}</div>
            <p className="text-xs text-muted-foreground">
              Hoje
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conversão
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricas?.orcamentosPendentes 
                ? ((metricas.orcamentosPendentes / (metricas.clientesAtivos || 1)) * 100).toFixed(1)
                : '0'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Orçamentos pendentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Insights e Ações */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance da Equipe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Meta de Vendas</span>
                <span className="font-medium">75%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Satisfação do Cliente</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Eficiência Operacional</span>
                <span className="font-medium">88%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas Ações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Users className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">Revisar desempenho de prestadores</p>
                <p className="text-xs text-muted-foreground">Análise mensal pendente</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <DollarSign className="h-5 w-5 text-green-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">Aprovar pagamentos</p>
                <p className="text-xs text-muted-foreground">5 pagamentos aguardando</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <FileText className="h-5 w-5 text-purple-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">Gerar relatório mensal</p>
                <p className="text-xs text-muted-foreground">Para apresentação</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
