
/**
 * Utilitários de formatação reutilizáveis
 */

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatDate = (date: string | Date, format: 'short' | 'long' | 'datetime' = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'long':
      return dateObj.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'datetime':
      return dateObj.toLocaleString('pt-BR');
    default:
      return dateObj.toLocaleDateString('pt-BR');
  }
};

export const generateAuthCode = (vendaId: string, index: number): string => {
  return `AG${vendaId.slice(0, 6).toUpperCase()}${(index + 1).toString().padStart(2, '0')}`;
};

export const generateOrderCode = (vendaId: string): string => {
  return vendaId.slice(0, 8).toUpperCase();
};
