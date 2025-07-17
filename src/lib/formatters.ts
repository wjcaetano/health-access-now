
/**
 * Utilities para formatação de dados
 */

// Formatação de moeda em Real brasileiro
export const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
};

// Formatação de data no padrão brasileiro
export const formatDate = (date: string | Date, includeTime: boolean = false): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Data inválida';
  
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo'
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return new Intl.DateTimeFormat('pt-BR', options).format(dateObj);
};

// Formatação de CPF
export const formatCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) return cpf;
  
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Formatação de CNPJ
export const formatCNPJ = (cnpj: string): string => {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  if (cleanCNPJ.length !== 14) return cnpj;
  
  return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

// Formatação de telefone
export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

// Formatação de percentual
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  }).format(value / 100);
};

// Formatação de status com cores
export const getStatusBadgeColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'ativo': 'bg-green-50 text-green-700',
    'inativo': 'bg-red-50 text-red-700',
    'pendente': 'bg-yellow-50 text-yellow-700',
    'aprovado': 'bg-blue-50 text-blue-700',
    'cancelado': 'bg-gray-50 text-gray-700',
    'pago': 'bg-green-50 text-green-700',
    'agendado': 'bg-blue-50 text-blue-700',
    'realizado': 'bg-green-50 text-green-700',
    'confirmado': 'bg-green-50 text-green-700'
  };
  
  return statusColors[status.toLowerCase()] || 'bg-gray-50 text-gray-700';
};

// Capitalizar primeira letra
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncar texto
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Formatação de método de pagamento
export const formatarMetodoPagamento = (metodo: string): string => {
  const metodos: Record<string, string> = {
    'dinheiro': 'Dinheiro',
    'cartao_credito': 'Cartão de Crédito',
    'cartao_debito': 'Cartão de Débito',
    'pix': 'PIX',
    'transferencia': 'Transferência',
    'boleto': 'Boleto'
  };
  return metodos[metodo] || metodo.replace('_', ' ');
};
