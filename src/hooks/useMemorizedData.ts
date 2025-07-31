import { useMemo } from 'react';
import { formatCurrency } from '@/lib/formatters';

// Hook para memorizar cálculos pesados
export function useMemorizedCalculations(data: any[]) {
  return useMemo(() => {
    if (!data?.length) return null;

    const totals = data.reduce((acc, item) => {
      acc.total += Number(item.valor_total || 0);
      acc.count += 1;
      return acc;
    }, { total: 0, count: 0 });

    return {
      total: totals.total,
      count: totals.count,
      average: totals.count > 0 ? totals.total / totals.count : 0,
      formattedTotal: formatCurrency(totals.total),
      formattedAverage: formatCurrency(totals.count > 0 ? totals.total / totals.count : 0)
    };
  }, [data]);
}

// Hook para memorizar filtros de dados
export function useMemorizedFilters<T>(
  data: T[],
  filters: {
    search?: string;
    status?: string;
    dateRange?: { start: string; end: string };
  }
) {
  return useMemo(() => {
    if (!data?.length) return [];

    return data.filter((item: any) => {
      // Filtro de busca
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableFields = [
          item.nome,
          item.email,
          item.cpf,
          item.telefone,
          item.observacoes
        ].filter(Boolean);
        
        const matches = searchableFields.some(field => 
          field?.toString().toLowerCase().includes(searchTerm)
        );
        
        if (!matches) return false;
      }

      // Filtro de status
      if (filters.status && item.status !== filters.status) {
        return false;
      }

      // Filtro de data
      if (filters.dateRange) {
        const itemDate = new Date(item.created_at || item.data_agendamento);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        
        if (itemDate < startDate || itemDate > endDate) {
          return false;
        }
      }

      return true;
    });
  }, [data, filters.search, filters.status, filters.dateRange]);
}

// Hook para memorizar agrupamentos de dados
export function useMemorizedGroupBy<T>(
  data: T[],
  groupByKey: keyof T
) {
  return useMemo(() => {
    if (!data?.length) return {};

    return data.reduce((groups: Record<string, T[]>, item) => {
      const key = String(item[groupByKey] || 'undefined');
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  }, [data, groupByKey]);
}

// Hook para memorizar ordenação de dados
export function useMemorizedSort<T>(
  data: T[],
  sortConfig: { key: keyof T; direction: 'asc' | 'desc' }
) {
  return useMemo(() => {
    if (!data?.length) return [];

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' 
          ? aVal - bVal
          : bVal - aVal;
      }

      // Para datas
      const aDate = new Date(aVal as any);
      const bDate = new Date(bVal as any);
      
      return sortConfig.direction === 'asc'
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    });
  }, [data, sortConfig.key, sortConfig.direction]);
}