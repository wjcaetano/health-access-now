
/**
 * Constantes do sistema
 */

// Status dos agendamentos
export const AGENDAMENTO_STATUS = {
  AGENDADO: 'agendado',
  CONFIRMADO: 'confirmado',
  CANCELADO: 'cancelado',
  REALIZADO: 'realizado'
} as const;

// Status dos orçamentos
export const ORCAMENTO_STATUS = {
  PENDENTE: 'pendente',
  APROVADO: 'aprovado',
  RECUSADO: 'recusado',
  EXPIRADO: 'expirado'
} as const;

// Status das guias
export const GUIA_STATUS = {
  EMITIDA: 'emitida',
  REALIZADA: 'realizada',
  FATURADA: 'faturada',
  PAGA: 'paga'
} as const;

// Status das contas
export const CONTA_STATUS = {
  PENDENTE: 'pendente',
  PAGO: 'pago',
  CANCELADO: 'cancelado'
} as const;

// Tipos de prestadores
export const PRESTADOR_TIPOS = {
  CLINICA: 'clinica',
  LABORATORIO: 'laboratorio',
  PROFISSIONAL: 'profissional'
} as const;

// Níveis de acesso
export const NIVEL_ACESSO = {
  COLABORADOR: 'colaborador',
  ATENDENTE: 'atendente',
  GERENTE: 'gerente',
  ADMIN: 'admin'
} as const;

// Métodos de pagamento
export const METODOS_PAGAMENTO = {
  PIX: 'pix',
  CARTAO: 'cartao',
  DINHEIRO: 'dinheiro',
  BOLETO: 'boleto'
} as const;

// Tipos de conta bancária
export const TIPOS_CONTA = {
  CORRENTE: 'corrente',
  POUPANCA: 'poupanca'
} as const;

// Mensagens de erro padrão
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_EMAIL: 'Email inválido',
  INVALID_CPF: 'CPF inválido',
  INVALID_CNPJ: 'CNPJ inválido',
  INVALID_PHONE: 'Telefone inválido',
  INVALID_DATE: 'Data inválida',
  INVALID_CURRENCY: 'Valor monetário inválido',
  NETWORK_ERROR: 'Erro de conexão. Tente novamente.',
  UNAUTHORIZED: 'Você não tem permissão para esta ação',
  NOT_FOUND: 'Registro não encontrado'
} as const;

// Configurações de paginação
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
} as const;

// Configurações de data
export const DATE_CONFIG = {
  LOCALE: 'pt-BR',
  TIMEZONE: 'America/Sao_Paulo',
  DATE_FORMAT: 'dd/MM/yyyy',
  DATETIME_FORMAT: 'dd/MM/yyyy HH:mm'
} as const;
