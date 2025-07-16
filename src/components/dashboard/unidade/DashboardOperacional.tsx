
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";
import { useUnitMetrics } from "@/hooks/tenant-specific/useUnit";
import { formatCurrency } from "@/lib/formatters";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Stethoscope
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardOperacional = () => {
  const { data: metrics, loading } = useUnitMetrics();

  const vendasDiarias = [
    { dia: "Seg", vendas: 12, valor: 3500 },
    { dia: "Ter", vendas: 15, valor: 4200 },
    { dia: "Qua", vendas: 8, valor: 2800 },
    { dia: "Qui", vendas: 18, valor: 5100 },
    { dia: "Sex", vendas: 22, valor: 6300 },
    { dia: "Sáb", vendas: 25, valor: 7200 },
    { dia: "Dom", vendas: 10, valor: 2900 },
  ];

  const agendamentosPorHora = [
    { hora: "08:00", agendamentos: 2 },
    { hora: "09:00", agendamentos: 5 },
    { hora: "10:00", agendamentos: 8 },
    { hora: "11:00", agendamentos: 6 },
    { hora: "12:00", agendamentos: 3 },
    { hora: "13:00", agendamentos: 2 },
    { hora: "14:00", agendamentos: 7 },
    { hora: "15:00", agendamentos: 9 },
    { hora: "16:00", agendamentos: 6 },
    { hora: "17:00", agendamentos: 4 },
    { hora: "18:00", agendamentos: 3 },
  ];

  const servicosPopulares = [
    { servico: "Consulta Médica", quantidade: 45, receita: 13500 },
    { servico: "Exames Laboratoriais", quantidade: 32, receita: 9600 },
    { servico: "Ultrassom", quantidade: 28, receita: 8400 },
    { servico: "Raio-X", quantidade: 22, receita: 4400 },
    { servico: "Eletrocardiograma", quantidade: 18, receita: 2700 },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalVendas || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> vs ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">12</span> pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics?.faturamentoMensal || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Meta: {formatCurrency(85000)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prestadores Ativos</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.prestadoresAtivos || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">2</span> online agora
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Operacional */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Status dos Sistemas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Agendamento Online</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Operacional</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Sistema de Vendas</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Operacional</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Conexão Prestadores</span>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-600">Instável</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Próximos Agendamentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">09:30 - Maria Silva</p>
                <p className="text-xs text-muted-foreground">Consulta Cardiológica</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">10:00 - João Santos</p>
                <p className="text-xs text-muted-foreground">Exame de Sangue</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">10:30 - Ana Costa</p>
                <p className="text-xs text-muted-foreground">Ultrassom</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Alertas Operacionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Estoque Baixo</p>
                <p className="text-xs text-muted-foreground">5 itens precisam reposição</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Meta Diária</p>
                <p className="text-xs text-muted-foreground">85% da meta atingida</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Operacionais */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vendas da Semana</CardTitle>
            <CardDescription>Quantidade e valor por dia</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                vendas: { label: "Vendas", color: "#0088FE" },
                valor: { label: "Valor", color: "#00C49F" }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vendasDiarias}>
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="vendas" 
                    stroke="#0088FE" 
                    fill="#0088FE" 
                    fillOpacity={0.6} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agendamentos por Horário</CardTitle>
            <CardDescription>Distribuição ao longo do dia</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                agendamentos: { label: "Agendamentos", color: "#FF8042" }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agendamentosPorHora}>
                  <XAxis dataKey="hora" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="agendamentos" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Serviços Mais Populares */}
      <Card>
        <CardHeader>
          <CardTitle>Serviços Mais Populares</CardTitle>
          <CardDescription>Ranking dos serviços mais procurados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {servicosPopulares.map((servico, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{servico.servico}</p>
                    <p className="text-sm text-muted-foreground">
                      {servico.quantidade} atendimentos
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    {formatCurrency(servico.receita)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(servico.receita / servico.quantidade)} por serviço
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOperacional;
