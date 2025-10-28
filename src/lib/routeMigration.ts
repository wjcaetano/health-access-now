/**
 * Mapeamento de redirecionamentos para compatibilidade com rotas antigas
 * Garante que links antigos continuem funcionando
 */

import { HUB_ROUTES, PROVIDER_ROUTES, CLIENT_ROUTES } from './routes';

export const routeMigrations: Record<string, string> = {
  // ========== AUTH MIGRATIONS ==========
  '/cadastro/cliente': '/register/client',
  '/cadastro/prestador': '/register/provider',
  '/recuperar-senha': '/recovery',

  // ========== PORTAL MIGRATIONS ==========
  '/prestador': '/provider',
  '/prestador/portal': PROVIDER_ROUTES.ROOT,
  '/prestador/guias': PROVIDER_ROUTES.GUIDES,
  '/prestador/faturamento': PROVIDER_ROUTES.BILLING,
  '/prestador/perfil': PROVIDER_ROUTES.PROFILE,

  '/cliente': '/client',
  '/cliente/dashboard': CLIENT_ROUTES.ROOT,
  '/cliente/agendamentos': CLIENT_ROUTES.APPOINTMENTS,
  '/cliente/orcamentos': CLIENT_ROUTES.QUOTES,

  // ========== HUB MIGRATIONS (Portuguese to English) ==========
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
  '/hub/relatorios': HUB_ROUTES.REPORTS,
  '/hub/configuracoes': HUB_ROUTES.SETTINGS,
  '/hub/meu-perfil': HUB_ROUTES.PROFILE,
  '/hub/perfil': HUB_ROUTES.PROFILE,

  // ========== LEGACY SYSTEM MIGRATIONS (Deprecated) ==========
  '/unidade': HUB_ROUTES.ROOT,
  '/sistema': HUB_ROUTES.ROOT,
  '/portal': '/',
  '/dashboard': HUB_ROUTES.ROOT,
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
 * (após período de transição de 6 meses)
 * Data de criação: 2024-10-28
 * Data prevista de remoção: 2025-04-28
 */
export const deprecatedRoutes = [
  // Hub routes (PT → EN)
  '/hub/dashboard',
  '/hub/dashboard-estrategico',
  '/hub/buscar-prestadores',
  '/hub/marketplace',
  '/hub/clientes',
  '/hub/prestadores',
  '/hub/servicos',
  '/hub/orcamentos',
  '/hub/agendamentos',
  '/hub/vendas',
  '/hub/financeiro',
  '/hub/colaboradores',
  '/hub/relatorios',
  '/hub/configuracoes',
  '/hub/meu-perfil',
  '/hub/perfil',

  // Portal routes (PT → EN)
  '/prestador',
  '/prestador/portal',
  '/prestador/guias',
  '/prestador/faturamento',
  '/prestador/perfil',
  '/cliente',
  '/cliente/dashboard',
  '/cliente/agendamentos',
  '/cliente/orcamentos',

  // Legacy systems (will be removed after transition)
  '/unidade',
  '/sistema',
  '/portal',
  '/dashboard',
] as const;
