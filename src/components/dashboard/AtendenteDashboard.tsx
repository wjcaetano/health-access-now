import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Users, 
  Calendar,
  FileText,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardMetrics } from "@/hooks/useDashboardRealData";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Badge } from "@/components/ui/badge";

export const AtendenteDashboard: React.FC = () => {
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
      <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-background rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Painel de Atendimento</h2>
            <p className="text-muted-foreground">
              Suas ferramentas para atender clientes e gerenciar vendas
            </p>
          </div>
          <ShoppingCart className="h-12 w-12 text-green-500 opacity-20" />
        </div>
      </div>

      {/* Ações Rápidas - DESTAQUE */}
      <Card className="border-primary/50 shadow-lg">
        <CardHeader className="bg-primary/5">
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild size="lg" className="h-auto flex-col gap-3 p-6 hover-scale">
              <Link to="/hub/vendas">
                <ShoppingCart className="h-8 w-8" />
                <span className="font-semibold">Nova Venda</span>
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-auto flex-col gap-3 p-6 hover-scale">
              <Link to="/hub/agendamentos">
                <Calendar className="h-8 w-8" />
                <span className="font-semibold">Agendar</span>
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-auto flex-col gap-3 p-6 hover-scale">
              <Link to="/hub/clientes">
                <Users className="h-8 w-8" />
                <span className="font-semibold">Clientes</span>
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-auto flex-col gap-3 p-6 hover-scale">
              <Link to="/hub/marketplace">
                <FileText className="h-8 w-8" />
                <span className="font-semibold">Marketplace</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Métricas do Dia */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vendas Hoje
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas?.vendasMes || 0}</div>
            <p className="text-xs text-muted-foreground">
              Do mês atual
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Agendamentos Hoje
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas?.agendamentosHoje || 0}</div>
            <p className="text-xs text-muted-foreground">
              Confirmados
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Orçamentos Pendentes
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas?.orcamentosPendentes || 0}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando aprovação
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Atendimentos
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas?.agendamentosHoje || 0}</div>
            <p className="text-xs text-muted-foreground">
              Hoje
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tarefas e Agenda do Dia */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Tarefas Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="font-medium text-sm">Confirmar agendamento</p>
                  <p className="text-xs text-muted-foreground">Cliente: João Silva - 14h</p>
                </div>
              </div>
              <Badge variant="outline">Urgente</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="font-medium text-sm">Enviar orçamento</p>
                  <p className="text-xs text-muted-foreground">Cliente: Maria Santos</p>
                </div>
              </div>
              <Badge variant="outline">Hoje</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-green-500" />
                <div>
                  <p className="font-medium text-sm">Follow-up cliente</p>
                  <p className="text-xs text-muted-foreground">Após conclusão do serviço</p>
                </div>
              </div>
              <Badge variant="outline">Amanhã</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Agenda de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="flex flex-col items-center min-w-[60px]">
                <span className="text-xs text-muted-foreground">10:00</span>
                <div className="h-1 w-1 bg-green-500 rounded-full my-1" />
                <span className="text-xs text-muted-foreground">10:30</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Atendimento - Ana Costa</p>
                <p className="text-xs text-muted-foreground">Consulta médica</p>
              </div>
              <Badge className="bg-green-500">Em andamento</Badge>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="flex flex-col items-center min-w-[60px]">
                <span className="text-xs text-muted-foreground">14:00</span>
                <div className="h-1 w-1 bg-blue-500 rounded-full my-1" />
                <span className="text-xs text-muted-foreground">15:00</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Agendamento - João Silva</p>
                <p className="text-xs text-muted-foreground">Exame de sangue</p>
              </div>
              <Badge variant="outline">Próximo</Badge>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="flex flex-col items-center min-w-[60px]">
                <span className="text-xs text-muted-foreground">16:30</span>
                <div className="h-1 w-1 bg-purple-500 rounded-full my-1" />
                <span className="text-xs text-muted-foreground">17:00</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Reunião de equipe</p>
                <p className="text-xs text-muted-foreground">Alinhamento semanal</p>
              </div>
              <Badge variant="outline">Agendado</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
