/**
 * Utilitários de navegação para rotas dinâmicas baseadas em roles
 */

import { AppRole } from "@/hooks/useUserRoles";

/**
 * Retorna a rota do perfil baseada no role do usuário
 */
export function getProfileRoute(userRole: string | AppRole): string {
  if (['admin', 'gerente', 'atendente', 'colaborador'].includes(userRole)) {
    return '/hub/perfil';
  }
  if (userRole === 'prestador') {
    return '/prestador/perfil';
  }
  if (userRole === 'cliente') {
    return '/cliente/perfil';
  }
  return '/perfil';
}

/**
 * Retorna a rota de configurações baseada no role do usuário
 * Retorna string vazia se o usuário não tem acesso a configurações
 */
export function getSettingsRoute(userRole: string | AppRole): string {
  if (['admin', 'gerente'].includes(userRole)) {
    return '/hub/configuracoes';
  }
  return '';
}

/**
 * Retorna a rota do dashboard baseada no role do usuário
 */
export function getDashboardRoute(userRole: string | AppRole): string {
  if (['admin', 'gerente', 'atendente', 'colaborador'].includes(userRole)) {
    return '/hub/dashboard';
  }
  if (userRole === 'prestador') {
    return '/prestador/portal';
  }
  if (userRole === 'cliente') {
    return '/cliente/dashboard';
  }
  return '/';
}

/**
 * Verifica se o usuário tem acesso a uma rota específica
 */
export function hasRouteAccess(userRole: string | AppRole, route: string): boolean {
  // Rotas do hub
  if (route.startsWith('/hub/')) {
    if (route === '/hub/configuracoes') {
      return ['admin', 'gerente'].includes(userRole);
    }
    if (route.startsWith('/hub/colaboradores') || route.startsWith('/hub/prestadores')) {
      return ['admin', 'gerente'].includes(userRole);
    }
    return ['admin', 'gerente', 'atendente', 'colaborador'].includes(userRole);
  }

  // Rotas do prestador
  if (route.startsWith('/prestador/')) {
    return userRole === 'prestador';
  }

  // Rotas do cliente
  if (route.startsWith('/cliente/')) {
    return userRole === 'cliente';
  }

  return false;
}
