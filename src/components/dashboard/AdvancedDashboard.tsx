
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CalendarDateRangePicker } from '@/components/ui/date-range-picker';
import { useAdvancedMetrics } from '@/hooks/useAdvancedMetrics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, Activity } from 'lucide-react';
import { subDays } from 'date-fns';

const COLORS = ['#8B5CF6', '#6E59A5', '#9b87f5', '#E5DEFF'];

export default function AdvancedDashboard() {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const { data: metrics, isLoading, error } = useAdvancedMetrics(dateRange);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Erro ao carregar métricas</p>
        </CardContent>
      </Card>
    );
  }

  const MetricCard = ({ title, value, icon, growth, format = 'number' }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    growth?: number;
    format?: 'number' | 'currency' | 'percentage';
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case 'currency':
          return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
        case 'percentage':
          return `${val.toFixed(1)}%`;
        default:
          return val.toLocaleString('pt-BR');
      }
    };

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold">{formatValue(value)}</p>
              {growth !== undefined && (
                <div className="flex items-center mt-2">
                  {growth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {Math.abs(growth).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
            <div className="text-agendaja-primary">
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Date Range Picker */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard Avançado</h2>
        <CalendarDateRangePicker
          date={dateRange}
          onDateChange={setDateRange}
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Receita Total"
          value={metrics.revenue.total}
          icon={<DollarSign className="h-6 w-6" />}
          growth={metrics.revenue.growth}
          format="currency"
        />
        <MetricCard
          title="Agendamentos"
          value={metrics.appointments.total}
          icon={<Calendar className="h-6 w-6" />}
        />
        <MetricCard
          title="Novos Clientes"
          value={metrics.customers.new}
          icon={<Users className="h-6 w-6" />}
        />
        <MetricCard
          title="Taxa de Conversão"
          value={metrics.appointments.conversionRate}
          icon={<Activity className="h-6 w-6" />}
          format="percentage"
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolução Temporal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={metrics.timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" name="Receita" />
                  <Line type="monotone" dataKey="appointments" stroke="#6E59A5" name="Agendamentos" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Serviços Mais Populares</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={metrics.services.mostPopular}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {metrics.services.mostPopular.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receita por Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.services.mostPopular}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Taxa de Conclusão"
              value={metrics.performance.completionRate}
              icon={<Activity className="h-6 w-6" />}
              format="percentage"
            />
            <MetricCard
              title="Taxa de Retenção"
              value={metrics.customers.retentionRate}
              icon={<Users className="h-6 w-6" />}
              format="percentage"
            />
            <MetricCard
              title="Valor Médio por Serviço"
              value={metrics.services.averageValue}
              icon={<DollarSign className="h-6 w-6" />}
              format="currency"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
