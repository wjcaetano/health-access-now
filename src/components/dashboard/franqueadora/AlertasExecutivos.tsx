
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

const AlertasExecutivos = () => {
  const alertas = [
    {
      id: 1,
      tipo: "critico",
      categoria: "financeiro",
      titulo: "Royalties em Atraso",
      descricao: "5 franquias com pagamentos atrasados há mais de 15 dias",
      valor: 125000,
      prazo: "Imediato",
      franquias: ["Unidade SP-01", "Unidade RJ-03", "Unidade MG-02"],
      acao: "Entrar em contato"
    },
    {
      id: 2,
      tipo: "alerta",
      categoria: "performance",
      titulo: "Queda de Performance",
      descricao: "3 unidades com faturamento 20% abaixo da meta",
      valor: null,
      prazo: "7 dias",
      franquias: ["Unidade PR-01", "Unidade BA-01", "Unidade CE-01"],
      acao: "Plano de ação"
    },
    {
      id: 3,
      tipo: "info",
      categoria: "expansao",
      titulo: "Novos Leads Qualificados",
      descricao: "8 novos leads qualificados para franquias",
      valor: null,
      prazo: "5 dias",
      franquias: [],
      acao: "Agendar reuniões"
    },
    {
      id: 4,
      tipo: "sucesso",
      categoria: "meta",
      titulo: "Meta Mensal Atingida",
      descricao: "Região Sudeste atingiu 105% da meta mensal",
      valor: 950000,
      prazo: null,
      franquias: ["Região Sudeste"],
      acao: "Parabenizar equipe"
    }
  ];

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case 'critico': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'alerta': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info': return <Info className="h-5 w-5 text-blue-600" />;
      case 'sucesso': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getAlertColor = (tipo: string) => {
    switch (tipo) {
      case 'critico': return 'border-red-200 bg-red-50';
      case 'alerta': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      case 'sucesso': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'critico': return 'bg-red-100 text-red-800';
      case 'alerta': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'sucesso': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const metricas = {
    criticos: alertas.filter(a => a.tipo === 'critico').length,
    alertas: alertas.filter(a => a.tipo === 'alerta').length,
    info: alertas.filter(a => a.tipo === 'info').length,
    sucessos: alertas.filter(a => a.tipo === 'sucesso').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Alertas Executivos</h2>
          <p className="text-muted-foreground">Monitoramento em tempo real da rede</p>
        </div>
        <Button variant="outline">
          Configurar Alertas
        </Button>
      </div>

      {/* Resumo dos Alertas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticos</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metricas.criticos}</div>
            <p className="text-xs text-muted-foreground">Ação imediata necessária</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{metricas.alertas}</div>
            <p className="text-xs text-muted-foreground">Monitoramento necessário</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Informativos</CardTitle>
            <Info className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metricas.info}</div>
            <p className="text-xs text-muted-foreground">Para conhecimento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sucessos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metricas.sucessos}</div>
            <p className="text-xs text-muted-foreground">Resultados positivos</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Alertas */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas Ativos</CardTitle>
          <CardDescription>Situações que requerem atenção da gestão</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alertas.map((alerta) => (
              <Alert key={alerta.id} className={getAlertColor(alerta.tipo)}>
                <div className="flex items-start gap-3">
                  {getAlertIcon(alerta.tipo)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{alerta.titulo}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getBadgeColor(alerta.tipo)} variant="outline">
                          {alerta.tipo}
                        </Badge>
                        {alerta.prazo && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {alerta.prazo}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <AlertDescription className="mb-3">
                      {alerta.descricao}
                    </AlertDescription>

                    {alerta.valor && (
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{formatCurrency(alerta.valor)}</span>
                      </div>
                    )}

                    {alerta.franquias.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {alerta.franquias.map((franquia, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {franquia}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button size="sm" variant="outline">
                      {alerta.acao}
                    </Button>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertasExecutivos;
