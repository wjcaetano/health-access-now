
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

export interface AdvancedMetrics {
  revenue: {
    total: number;
    monthly: number;
    daily: number;
    growth: number;
  };
  appointments: {
    total: number;
    completed: number;
    cancelled: number;
    conversionRate: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    retentionRate: number;
  };
  services: {
    mostPopular: Array<{ name: string; count: number; revenue: number }>;
    averageValue: number;
  };
  timeline: Array<{
    date: string;
    revenue: number;
    appointments: number;
    newCustomers: number;
  }>;
  performance: {
    averageResponseTime: number;
    customerSatisfaction: number;
    completionRate: number;
  };
}

export function useAdvancedMetrics(dateRange: { from: Date; to: Date }) {
  return useQuery({
    queryKey: ['advanced-metrics', dateRange],
    queryFn: async (): Promise<AdvancedMetrics> => {
      const { from, to } = dateRange;
      
      // Revenue metrics
      const { data: revenueData } = await supabase
        .from('vendas')
        .select('valor_total, created_at')
        .gte('created_at', from.toISOString())
        .lte('created_at', to.toISOString());

      const totalRevenue = revenueData?.reduce((sum, sale) => sum + Number(sale.valor_total), 0) || 0;
      
      // Previous period for growth calculation
      const previousPeriod = {
        from: subDays(from, Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))),
        to: from
      };
      
      const { data: previousRevenueData } = await supabase
        .from('vendas')
        .select('valor_total')
        .gte('created_at', previousPeriod.from.toISOString())
        .lte('created_at', previousPeriod.to.toISOString());

      const previousRevenue = previousRevenueData?.reduce((sum, sale) => sum + Number(sale.valor_total), 0) || 0;
      const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

      // Appointments metrics
      const { data: appointmentsData } = await supabase
        .from('agendamentos')
        .select('status, created_at')
        .gte('created_at', from.toISOString())
        .lte('created_at', to.toISOString());

      const totalAppointments = appointmentsData?.length || 0;
      const completedAppointments = appointmentsData?.filter(a => a.status === 'realizado').length || 0;
      const cancelledAppointments = appointmentsData?.filter(a => a.status === 'cancelado').length || 0;

      // Customers metrics
      const { data: customersData } = await supabase
        .from('clientes')
        .select('data_cadastro')
        .gte('data_cadastro', from.toISOString())
        .lte('data_cadastro', to.toISOString());

      const newCustomers = customersData?.length || 0;

      const { data: totalCustomersData } = await supabase
        .from('clientes')
        .select('id', { count: 'exact' });

      const totalCustomers = totalCustomersData?.length || 0;

      // Services metrics
      const { data: servicesData } = await supabase
        .from('vendas_servicos')
        .select(`
          valor,
          servicos (nome),
          created_at
        `)
        .gte('created_at', from.toISOString())
        .lte('created_at', to.toISOString());

      const serviceStats = servicesData?.reduce((acc, item) => {
        const serviceName = item.servicos?.nome || 'Unknown';
        if (!acc[serviceName]) {
          acc[serviceName] = { count: 0, revenue: 0 };
        }
        acc[serviceName].count++;
        acc[serviceName].revenue += Number(item.valor);
        return acc;
      }, {} as Record<string, { count: number; revenue: number }>) || {};

      const mostPopularServices = Object.entries(serviceStats)
        .map(([name, stats]) => ({ name, ...stats }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Timeline data
      const days = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
      const timeline = [];
      
      for (let i = 0; i < days; i++) {
        const date = subDays(to, days - i - 1);
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);
        
        const dayRevenue = revenueData?.filter(sale => {
          const saleDate = new Date(sale.created_at);
          return saleDate >= dayStart && saleDate <= dayEnd;
        }).reduce((sum, sale) => sum + Number(sale.valor_total), 0) || 0;

        const dayAppointments = appointmentsData?.filter(appointment => {
          const appointmentDate = new Date(appointment.created_at);
          return appointmentDate >= dayStart && appointmentDate <= dayEnd;
        }).length || 0;

        const dayNewCustomers = customersData?.filter(customer => {
          const customerDate = new Date(customer.data_cadastro);
          return customerDate >= dayStart && customerDate <= dayEnd;
        }).length || 0;

        timeline.push({
          date: format(date, 'yyyy-MM-dd'),
          revenue: dayRevenue,
          appointments: dayAppointments,
          newCustomers: dayNewCustomers
        });
      }

      return {
        revenue: {
          total: totalRevenue,
          monthly: totalRevenue, // Simplified for now
          daily: totalRevenue / days,
          growth: revenueGrowth
        },
        appointments: {
          total: totalAppointments,
          completed: completedAppointments,
          cancelled: cancelledAppointments,
          conversionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0
        },
        customers: {
          total: totalCustomers,
          new: newCustomers,
          returning: totalCustomers - newCustomers,
          retentionRate: totalCustomers > 0 ? ((totalCustomers - newCustomers) / totalCustomers) * 100 : 0
        },
        services: {
          mostPopular: mostPopularServices,
          averageValue: servicesData?.length ? 
            servicesData.reduce((sum, item) => sum + Number(item.valor), 0) / servicesData.length : 0
        },
        timeline,
        performance: {
          averageResponseTime: 0, // Would need additional tracking
          customerSatisfaction: 0, // Would need feedback system
          completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0
        }
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000 // 10 minutes
  });
}
