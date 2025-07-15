
export const APP_CONFIG = {
  name: 'AgendaJá',
  version: '1.0.0',
  description: 'Sistema de gestão para clínicas e prestadores de serviços'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CLIENTES: '/dashboard/clientes',
  PRESTADORES: '/dashboard/prestadores',
  SERVICOS: '/dashboard/servicos',
  ORCAMENTOS: '/dashboard/orcamentos',
  VENDAS: '/dashboard/vendas',
  AGENDAMENTOS: '/dashboard/agendamentos',
  COLABORADORES: '/dashboard/colaboradores',
  FINANCEIRO: '/dashboard/financeiro',
  GUIAS: '/dashboard/guias',
  GESTAO_USUARIOS: '/dashboard/gestao-usuarios',
  MEU_PERFIL: '/dashboard/meu-perfil',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  GERENTE: 'gerente',
  ATENDENTE: 'atendente',
  COLABORADOR: 'colaborador',
} as const;

export const USER_STATUS = {
  PENDENTE: 'pendente',
  AGUARDANDO_APROVACAO: 'aguardando_aprovacao',
  ATIVO: 'ativo',
  SUSPENSO: 'suspenso',
  INATIVO: 'inativo',
} as const;

export const GUIA_STATUS = {
  EMITIDA: 'emitida',
  REALIZADA: 'realizada',
  FATURADA: 'faturada',
  PAGA: 'paga',
  CANCELADA: 'cancelada',
  ESTORNADA: 'estornada',
} as const;

export const VENDA_STATUS = {
  CONCLUIDA: 'concluida',
  CANCELADA: 'cancelada',
  ESTORNADA: 'estornada',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

export const QUERY_KEYS = {
  USERS: 'users',
  CLIENTES: 'clientes',
  PRESTADORES: 'prestadores',
  SERVICOS: 'servicos',
  ORCAMENTOS: 'orcamentos',
  VENDAS: 'vendas',
  AGENDAMENTOS: 'agendamentos',
  GUIAS: 'guias',
  DASHBOARD_STATS: 'dashboard-stats',
} as const;
