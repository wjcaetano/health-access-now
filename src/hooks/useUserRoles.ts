import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = 'admin' | 'gerente' | 'atendente' | 'colaborador' | 'prestador' | 'cliente';

interface UserRole {
  role: AppRole;
  organizacao_id: string | null;
}

/**
 * Hook para buscar os roles do usuário atual
 * IMPORTANTE: Roles são armazenados em tabela separada por segurança
 */
export function useUserRoles(userId?: string) {
  return useQuery({
    queryKey: ['user-roles', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, organizacao_id')
        .eq('user_id', userId);

      if (error) throw error;
      return data as UserRole[];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para verificar se o usuário tem um role específico
 */
export function useHasRole(userId: string | undefined, role: AppRole) {
  const { data: roles = [] } = useUserRoles(userId);
  return roles.some(r => r.role === role);
}

/**
 * Hook para verificar se o usuário é admin ou gerente
 */
export function useIsAdminOrManager(userId: string | undefined) {
  const { data: roles = [] } = useUserRoles(userId);
  return roles.some(r => r.role === 'admin' || r.role === 'gerente');
}

/**
 * Hook para obter o role primário do usuário (para compatibilidade com nivel_acesso)
 * Ordem de prioridade: admin > gerente > atendente > colaborador > prestador > cliente
 */
export function usePrimaryRole(userId: string | undefined): AppRole | null {
  const { data: roles = [] } = useUserRoles(userId);
  
  if (roles.length === 0) return null;
  
  const priority: AppRole[] = ['admin', 'gerente', 'atendente', 'colaborador', 'prestador', 'cliente'];
  
  for (const role of priority) {
    if (roles.some(r => r.role === role)) {
      return role;
    }
  }
  
  return roles[0]?.role || null;
}
