
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useHoldingMetrics } from "@/hooks/tenant-specific/useHolding";
import { formatCurrency } from "@/lib/formatters";
import { TrendingUp, TrendingDown, Building2, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const MetricasConsolidadas = () => {
  const { data: metrics, loading } = useHoldingMetrics();

  const performanceData = [
    { mes: "Jan", faturamento: 85000, meta: 90000 },
    { mes: "Fev", faturamento: 92000, meta: 90000 },
    { mes: "Mar", faturamento: 88000, meta: 95000 },
    { mes: "Abr", faturamento: 96000, meta: 95000 },
    { mes: "Mai", faturamento: 103000, meta: 100000 },
    { mes: "Jun", faturamento: 98000, meta: 100000 },
  ];

  const regionData = [
    { regiao: "Sudeste", valor: 45, cor: "#0088FE" },
    { regiao: "Sul", valor: 25, cor: "#00C49F" },
    { regiao: "Nordeste", valor: 20, cor: "#FFBB28" },
    { regiao: "Norte", valor: 10, cor: "#FF8042" },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Franquias</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalFranquias || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2 este mês
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics?.faturamentoTotal || 0)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% vs mês anterior
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Royalties Pendentes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(250000)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                5 unidades em atraso
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Geral</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">96.2%</div>
            <p className="text-xs text-muted-foreground">
              Meta mensal atingida
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance vs Meta</CardTitle>
            <CardDescription>Faturamento mensal comparado com metas</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                faturamento: { label: "Faturamento", color: "#0088FE" },
                meta: { label: "Meta", color: "#00C49F" }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="faturamento" fill="#0088FE" />
                  <Bar dataKey="meta" fill="#00C49F" opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Região</CardTitle>
            <CardDescription>Participação no faturamento total</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                valor: { label: "Valor", color: "#0088FE" }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ regiao, valor }) => `${regiao}: ${valor}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="valor"
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MetricasConsolidadas;
