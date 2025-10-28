/**
 * Mapeamento de redirecionamentos para compatibilidade com rotas antigas
 * Garante que links antigos continuem funcionando
 */

import { HUB_ROUTES, PROVIDER_ROUTES, CLIENT_ROUTES } from './routes';

export const routeMigrations: Record<string, string> = {
  // ========== HUB MIGRATIONS ==========
  '/hub/dashboard': HUB_ROUTES.ROOT,
  '/hub/dashboard-estrategico': HUB_ROUTES.ANALYTICS,
  '/hub/buscar-prestadores': HUB_ROUTES.PROVIDERS_SEARCH,
  '/hub/marketplace': HUB_ROUTES.SERVICES_MARKETPLACE,
  '/hub/clientes': HUB_ROUTES.CUSTOMERS,
  '/hub/prestadores': HUB_ROUTES.PROVIDERS,
  '/hub/servicos': HUB_ROUTES.SERVICES,
  '/hub/orcamentos': HUB_ROUTES.QUOTES,
  '/hub/agendamentos': HUB_ROUTES.APPOINTMENTS,
  '/hub/vendas': HUB_ROUTES.SALES,
  '/hub/financeiro': HUB_ROUTES.FINANCE,
  '/hub/colaboradores': HUB_ROUTES.TEAM,
  '/hub/organizacoes': HUB_ROUTES.ORGANIZATIONS,
  '/hub/relatorios': HUB_ROUTES.REPORTS,
  '/hub/configuracoes': HUB_ROUTES.SETTINGS,
  '/hub/meu-perfil': HUB_ROUTES.PROFILE,
  '/hub/usuarios': HUB_ROUTES.USERS,

  // Specific pages
  '/novo-agendamento': HUB_ROUTES.APPOINTMENTS_NEW,
  '/novo-cliente': HUB_ROUTES.CUSTOMERS_NEW,
  '/novo-servico': HUB_ROUTES.SERVICES_NEW,
  '/novo-prestador': HUB_ROUTES.PROVIDERS_NEW,
  '/checkout-vendas': HUB_ROUTES.SALES_CHECKOUT,
  '/agenda-pagamentos': HUB_ROUTES.FINANCE_RECEIVABLES,
  '/relatorios-centralizados': HUB_ROUTES.REPORTS,
  '/aprovacoes': HUB_ROUTES.APPROVALS,
  '/backup': HUB_ROUTES.BACKUP,
  '/seguranca': HUB_ROUTES.SECURITY,
  '/qualidade': HUB_ROUTES.QUALITY,
  '/analise-sistema': HUB_ROUTES.SYSTEM_ANALYSIS,

  // ========== PROVIDER MIGRATIONS ==========
  '/prestador/portal': PROVIDER_ROUTES.ROOT,
  '/prestador/guias': PROVIDER_ROUTES.GUIDES,
  '/prestador/faturamento': PROVIDER_ROUTES.BILLING,
  '/prestador/perfil': PROVIDER_ROUTES.PROFILE,

  // ========== CLIENT MIGRATIONS ==========
  '/cliente/dashboard': CLIENT_ROUTES.ROOT,
  '/cliente/agendamentos': CLIENT_ROUTES.APPOINTMENTS,
  '/cliente/orcamentos': CLIENT_ROUTES.QUOTES,

  // ========== LEGACY SYSTEM MIGRATIONS ==========
  '/sistema': HUB_ROUTES.ROOT,
  '/sistema/dashboard': HUB_ROUTES.ROOT,
  '/sistema/prestador/portal': PROVIDER_ROUTES.ROOT,
  '/sistema/prestador/guias': PROVIDER_ROUTES.GUIDES,
  '/sistema/prestador/faturamento': PROVIDER_ROUTES.BILLING,
  '/unidade': HUB_ROUTES.ROOT,
  '/unidade/perfil': HUB_ROUTES.PROFILE,
  '/unidade/configuracoes': HUB_ROUTES.SETTINGS,
  '/dashboard': HUB_ROUTES.ROOT,

  // ========== AUTH MIGRATIONS ==========
  '/cadastro/cliente': '/register/client',
  '/cadastro/prestador': '/register/provider',
  '/recuperar-senha': '/recovery',
} as const;

/**
 * Função para obter a nova rota baseada na rota legada
 * @param oldRoute - Rota antiga a ser migrada
 * @returns Nova rota ou a própria rota se não houver migração
 */
export function getMigratedRoute(oldRoute: string): string {
  // Busca exata
  if (routeMigrations[oldRoute]) {
    return routeMigrations[oldRoute];
  }

  // Busca por padrão (para rotas com IDs)
  for (const [pattern, newRoute] of Object.entries(routeMigrations)) {
    if (oldRoute.startsWith(pattern)) {
      const id = oldRoute.replace(pattern, '').replace(/^\//, '');
      if (id) {
        return `${newRoute}/${id}`;
      }
    }
  }

  return oldRoute;
}

/**
 * Verifica se uma rota é legada e precisa de redirecionamento
 * @param route - Rota a ser verificada
 * @returns true se for uma rota legada
 */
export function isLegacyRoute(route: string): boolean {
  return Object.keys(routeMigrations).some(legacy => route.startsWith(legacy));
}

/**
 * Lista de rotas que devem ser removidas gradualmente
 * (após período de transição)
 */
export const deprecatedRoutes = [
  '/hub/dashboard',
  '/hub/dashboard-estrategico',
  '/hub/buscar-prestadores',
  '/hub/marketplace',
  '/prestador/portal',
  '/cliente/dashboard',
  '/sistema',
  '/unidade',
] as const;
