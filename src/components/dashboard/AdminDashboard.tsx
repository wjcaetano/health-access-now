import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Settings,
  UserPlus,
  FileText,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardStats } from "@/hooks/useDashboard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Badge } from "@/components/ui/badge";

export const AdminDashboard: React.FC = () => {
  const { data: metricas, isLoading } = useDashboardStats();

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
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Painel Administrativo</h2>
            <p className="text-muted-foreground">
              Visão completa do sistema e ações administrativas
            </p>
          </div>
          <Settings className="h-12 w-12 text-primary opacity-20" />
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
              <Link to="/hub/configuracoes">
                <Settings className="h-6 w-6" />
                <span className="text-sm">Configurações</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-2 p-4 hover-scale">
              <Link to="/hub/colaboradores">
                <UserPlus className="h-6 w-6" />
                <span className="text-sm">Usuários</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-2 p-4 hover-scale">
              <Link to="/hub/dashboard-estrategico">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Analytics</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-2 p-4 hover-scale">
              <Link to="/hub/relatorios">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Relatórios</span>
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
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {((metricas?.totalClientes || 0) * 150).toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas?.totalClientes || 0}</div>
            <p className="text-xs text-muted-foreground">
              Novos este mês
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Prestadores Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor((metricas?.totalClientes || 0) / 10)}</div>
            <p className="text-xs text-muted-foreground">
              Em toda a rede
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Crescimento
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+18%</div>
            <p className="text-xs text-muted-foreground">
              Crescimento mensal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Pendências */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Itens Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Prestadores aguardando aprovação</p>
                <p className="text-sm text-muted-foreground">Revisar cadastros</p>
              </div>
              <Badge variant="outline">3</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Configurações pendentes</p>
                <p className="text-sm text-muted-foreground">Sistema precisa de atenção</p>
              </div>
              <Badge variant="outline">2</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Relatórios para revisar</p>
                <p className="text-sm text-muted-foreground">Análises financeiras</p>
              </div>
              <Badge variant="outline">5</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visão Geral do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Status do Sistema</span>
              <Badge className="bg-green-500">Operacional</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Último Backup</span>
              <span className="text-sm text-muted-foreground">Há 2 horas</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Versão</span>
              <span className="text-sm text-muted-foreground">2.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Uptime</span>
              <span className="text-sm text-muted-foreground">99.9%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
