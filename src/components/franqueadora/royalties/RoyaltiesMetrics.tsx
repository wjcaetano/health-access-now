
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, Clock, CheckCircle } from "lucide-react";

interface MetricsData {
  totalRoyalties: number;
  royaltiesPagos: number;
  royaltiesPendentes: number;
  royaltiesAtrasados: number;
  valorTotalRecebido: number;
  valorTotalPendente: number;
  valorTotalAtrasado: number;
  percentualRecebimento: number;
  crescimentoMensal: number;
}

interface RoyaltiesMetricsProps {
  metrics: MetricsData;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`;
};

export const RoyaltiesMetrics: React.FC<RoyaltiesMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(metrics.valorTotalRecebido)}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CheckCircle className="h-3 w-3" />
            {metrics.royaltiesPagos} royalties pagos
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendente</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {formatCurrency(metrics.valorTotalPendente)}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {metrics.royaltiesPendentes} royalties pendentes
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(metrics.valorTotalAtrasado)}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <AlertTriangle className="h-3 w-3" />
            {metrics.royaltiesAtrasados} royalties atrasados
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Recebimento</CardTitle>
          {metrics.crescimentoMensal >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPercentage(metrics.percentualRecebimento)}
          </div>
          <div className="flex items-center gap-1 text-xs">
            {metrics.crescimentoMensal >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-600" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600" />
            )}
            <span className={metrics.crescimentoMensal >= 0 ? "text-green-600" : "text-red-600"}>
              {metrics.crescimentoMensal >= 0 ? '+' : ''}{formatPercentage(Math.abs(metrics.crescimentoMensal))} vs mês anterior
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
