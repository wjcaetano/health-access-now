import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  Users, 
  Stethoscope, 
  Calendar, 
  Star,
  TrendingUp,
  Building2
} from 'lucide-react';
import { 
  useMetricasGlobais, 
  useFaturamentoPorMes,
  useTopPrestadores,
  useDistribuicaoServicos,
  useOrganizacoesPorTipo
} from '@/hooks/useDashboardCentralizado';
import { formatCurrency } from '@/lib/formatters';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export const DashboardEstrategico: React.FC = () => {
  const { data: metricas, isLoading: loadingMetricas } = useMetricasGlobais();
  const { data: faturamento } = useFaturamentoPorMes();
  const { data: topPrestadores } = useTopPrestadores(5);
  const { data: distribuicaoServicos } = useDistribuicaoServicos();
  const { data: organizacoesPorTipo } = useOrganizacoesPorTipo();

  if (loadingMetricas) {
    return <div className="text-center py-8">Carregando dashboard...</div>;
  }

  const metricCards = [
    {
      title: 'Faturamento Mensal',
      value: formatCurrency(metricas?.faturamentoMensal || 0),
      icon: DollarSign,
      trend: '+12.5%'
    },
    {
      title: 'Total de Clientes',
      value: metricas?.totalClientes || 0,
      icon: Users,
      trend: '+5.2%'
    },
    {
      title: 'Prestadores Ativos',
      value: metricas?.totalPrestadores || 0,
      icon: Stethoscope,
      trend: '+8.1%'
    },
    {
      title: 'Agendamentos/Mês',
      value: metricas?.agendamentosMes || 0,
      icon: Calendar,
      trend: '+15.3%'
    },
    {
      title: 'Média de Avaliações',
      value: metricas?.mediaAvaliacoes.toFixed(1) || '0.0',
      icon: Star,
      subtitle: `${metricas?.totalAvaliacoes || 0} avaliações`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {metricCards.map((card, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                  {card.subtitle && (
                    <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                  )}
                  {card.trend && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      {card.trend}
                    </div>
                  )}
                </div>
                <card.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faturamento por mês */}
        <Card>
          <CardHeader>
            <CardTitle>Faturamento por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={faturamento || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="faturamento" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de serviços */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribuicaoServicos || []}
                  dataKey="quantidade"
                  nameKey="categoria"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {(distribuicaoServicos || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Prestadores e Organizações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Prestadores */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Prestadores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPrestadores?.map((prestador, index) => (
                <div key={prestador.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{prestador.nome}</p>
                      <p className="text-sm text-muted-foreground">{prestador.tipo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{prestador.media_avaliacoes.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">
                      ({prestador.total_avaliacoes})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Organizações por tipo */}
        <Card>
          <CardHeader>
            <CardTitle>Organizações Parceiras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {organizacoesPorTipo?.map((org) => (
                <div key={org.tipo} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span className="font-medium capitalize">
                      {org.tipo.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-2xl font-bold">{org.quantidade}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
