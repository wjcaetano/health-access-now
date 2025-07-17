
/**
 * Funções auxiliares gerais
 */

// Gerar ID único simples
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Delay para testes/simulações
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Debounce para otimizar pesquisas
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Filtrar array por texto
export const filterByText = <T>(
  items: T[],
  searchTerm: string,
  keys: (keyof T)[]
): T[] => {
  if (!searchTerm.trim()) return items;
  
  const lowerSearch = searchTerm.toLowerCase();
  
  return items.filter(item =>
    keys.some(key => {
      const value = item[key];
      return value && String(value).toLowerCase().includes(lowerSearch);
    })
  );
};

// Ordenar array por campo
export const sortBy = <T>(
  items: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...items].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal === bVal) return 0;
    
    const result = aVal < bVal ? -1 : 1;
    return direction === 'asc' ? result : -result;
  });
};

// Agrupar array por campo
export const groupBy = <T, K extends keyof T>(
  items: T[],
  key: K
): Record<string, T[]> => {
  return items.reduce((groups, item) => {
    const groupKey = String(item[key]);
    groups[groupKey] = groups[groupKey] || [];
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

// Remover duplicatas de array
export const removeDuplicates = <T>(
  items: T[],
  key?: keyof T
): T[] => {
  if (!key) {
    return [...new Set(items)];
  }
  
  const seen = new Set();
  return items.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

// Calcular porcentagem
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

// Gerar código de autenticação
export const generateAuthCode = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Verificar se é ambiente de desenvolvimento
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

// Limpar objeto removendo valores null/undefined
export const cleanObject = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const cleaned: Partial<T> = {};
  
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      cleaned[key] = obj[key];
    }
  }
  
  return cleaned;
};
