
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export type ReportType = 
  | 'revenue'
  | 'appointments'
  | 'customers'
  | 'services'
  | 'financial'
  | 'performance';

export type ReportFormat = 'pdf' | 'excel' | 'csv';

export interface ReportConfig {
  type: ReportType;
  dateRange: { from: Date; to: Date };
  filters?: Record<string, any>;
  format: ReportFormat;
  includeCharts?: boolean;
}

export interface ReportData {
  id: string;
  title: string;
  type: ReportType;
  status: 'generating' | 'completed' | 'failed';
  downloadUrl?: string;
  createdAt: string;
  expiresAt: string;
}

export function useReports() {
  const generateReport = useMutation({
    mutationFn: async (config: ReportConfig): Promise<ReportData> => {
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: config
      });

      if (error) throw error;
      return data;
    }
  });

  const getReports = useQuery({
    queryKey: ['reports'],
    queryFn: async (): Promise<ReportData[]> => {
      // In a real implementation, this would fetch from a reports table
      // For now, return mock data
      return [
        {
          id: '1',
          title: 'Relatório de Receitas - Janeiro 2024',
          type: 'revenue',
          status: 'completed',
          downloadUrl: '#',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    }
  });

  const downloadReport = async (reportId: string) => {
    // Implementation would depend on your storage solution
    console.log('Downloading report:', reportId);
  };

  return {
    generateReport,
    getReports,
    downloadReport
  };
}

// Utility functions for report generation
export const reportUtils = {
  generateRevenueReport: async (dateRange: { from: Date; to: Date }) => {
    const { data: salesData } = await supabase
      .from('vendas')
      .select(`
        valor_total,
        created_at,
        clientes (nome),
        vendas_servicos (
          valor,
          servicos (nome, categoria)
        )
      `)
      .gte('created_at', dateRange.from.toISOString())
      .lte('created_at', dateRange.to.toISOString());

    return salesData;
  },

  generateCustomerReport: async (dateRange: { from: Date; to: Date }) => {
    const { data: customersData } = await supabase
      .from('clientes')
      .select('*')
      .gte('data_cadastro', dateRange.from.toISOString())
      .lte('data_cadastro', dateRange.to.toISOString());

    return customersData;
  },

  exportToCsv: (data: any[], filename: string) => {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          typeof row[header] === 'string' ? `"${row[header]}"` : row[header]
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
};
