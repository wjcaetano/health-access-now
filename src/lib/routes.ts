/**
 * Constantes de rotas padronizadas (RESTful)
 * Padrão: /[portal]/[recurso]/[ação]/[id]
 */

// ========== HUB ROUTES ==========
export const HUB_ROUTES = {
  // Main
  ROOT: '/hub',
  ANALYTICS: '/hub/analytics',

  // Operacional (todos os roles do hub)
  SALES: '/hub/sales',
  SALES_NEW: '/hub/sales/new',
  SALES_DETAIL: (id: string) => `/hub/sales/${id}`,
  SALES_CHECKOUT: '/hub/sales/checkout',
  SALE_COMPLETED: (id: string) => `/hub/sales/${id}/completed`,
  
  APPOINTMENTS: '/hub/appointments',
  APPOINTMENTS_NEW: '/hub/appointments/new',
  APPOINTMENTS_DETAIL: (id: string) => `/hub/appointments/${id}`,
  APPOINTMENTS_CALENDAR: '/hub/appointments/calendar',
  
  QUOTES: '/hub/quotes',
  QUOTES_DETAIL: (id: string) => `/hub/quotes/${id}`,

  // Gestão (gerente/admin)
  CUSTOMERS: '/hub/customers',
  CUSTOMERS_NEW: '/hub/customers/new',
  CUSTOMERS_DETAIL: (id: string) => `/hub/customers/${id}`,
  
  PROVIDERS: '/hub/providers',
  PROVIDERS_NEW: '/hub/providers/new',
  PROVIDERS_SEARCH: '/hub/providers/search',
  PROVIDERS_DETAIL: (id: string) => `/hub/providers/${id}`,
  
  SERVICES: '/hub/services',
  SERVICES_NEW: '/hub/services/new',
  SERVICES_MARKETPLACE: '/hub/services/marketplace',
  SERVICES_DETAIL: (id: string) => `/hub/services/${id}`,
  SERVICES_CATALOG: '/hub/services/catalog',
  
  FINANCE: '/hub/finance',
  FINANCE_RECEIVABLES: '/hub/finance/receivables',
  FINANCE_PAYABLES: '/hub/finance/payables',

  // Administração (admin)
  TEAM: '/hub/team',
  TEAM_DETAIL: (id: string) => `/hub/team/${id}`,
  
  PLATFORM_CONFIG: '/hub/platform-config',
  REPORTS: '/hub/reports',
  SETTINGS: '/hub/settings',
  APPROVALS: '/hub/approvals',
  
  // Outros
  PROFILE: '/hub/profile',
} as const;

// ========== PROVIDER ROUTES ==========
export const PROVIDER_ROUTES = {
  ROOT: '/provider',
  GUIDES: '/provider/guides',
  GUIDES_DETAIL: (id: string) => `/provider/guides/${id}`,
  BILLING: '/provider/billing',
  PROFILE: '/provider/profile',
} as const;

// ========== CLIENT ROUTES ==========
export const CLIENT_ROUTES = {
  ROOT: '/client',
  APPOINTMENTS: '/client/appointments',
  APPOINTMENTS_DETAIL: (id: string) => `/client/appointments/${id}`,
  QUOTES: '/client/quotes',
  QUOTES_DETAIL: (id: string) => `/client/quotes/${id}`,
  PROFILE: '/client/profile',
} as const;

// ========== PUBLIC ROUTES ==========
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER_CLIENT: '/register/client',
  REGISTER_PROVIDER: '/register/provider',
  RECOVERY: '/recovery',
  LANDING: '/landing',
  NOT_FOUND: '/404',
} as const;

// ========== LEGACY ROUTES (para compatibilidade) ==========
export const LEGACY_ROUTES = {
  // Hub legacy
  HUB_DASHBOARD: '/hub/dashboard',
  HUB_DASHBOARD_ESTRATEGICO: '/hub/dashboard-estrategico',
  HUB_BUSCAR_PRESTADORES: '/hub/buscar-prestadores',
  HUB_MARKETPLACE: '/hub/marketplace',
  HUB_CLIENTES: '/hub/clientes',
  HUB_PRESTADORES: '/hub/prestadores',
  HUB_SERVICOS: '/hub/servicos',
  HUB_ORCAMENTOS: '/hub/orcamentos',
  HUB_AGENDAMENTOS: '/hub/agendamentos',
  HUB_VENDAS: '/hub/vendas',
  HUB_FINANCEIRO: '/hub/financeiro',
  HUB_COLABORADORES: '/hub/colaboradores',
  HUB_ORGANIZACOES: '/hub/organizacoes',
  HUB_RELATORIOS: '/hub/relatorios',
  HUB_CONFIGURACOES: '/hub/configuracoes',
  HUB_MEU_PERFIL: '/hub/meu-perfil',

  // Provider legacy
  PRESTADOR_PORTAL: '/prestador/portal',
  PRESTADOR_GUIAS: '/prestador/guias',
  PRESTADOR_FATURAMENTO: '/prestador/faturamento',
  PRESTADOR_PERFIL: '/prestador/perfil',

  // Client legacy
  CLIENTE_DASHBOARD: '/cliente/dashboard',
  CLIENTE_AGENDAMENTOS: '/cliente/agendamentos',
  CLIENTE_ORCAMENTOS: '/cliente/orcamentos',

  // Sistema legacy
  SISTEMA: '/sistema',
  UNIDADE: '/unidade',
  DASHBOARD: '/dashboard',
} as const;

// Helper type para rotas
export type RouteConfig = typeof HUB_ROUTES | typeof PROVIDER_ROUTES | typeof CLIENT_ROUTES | typeof PUBLIC_ROUTES;
