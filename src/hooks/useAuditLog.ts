
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAuditLog() {
  return useQuery({
    queryKey: ["auditLog"],
    queryFn: async () => {
      // Primeiro buscar os logs de auditoria
      const { data: logs, error: logsError } = await supabase
        .from("user_audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      
      if (logsError) throw logsError;
      
      if (!logs || logs.length === 0) return [];
      
      // Buscar os perfis dos usuários relacionados
      const userIds = Array.from(new Set([
        ...logs.map(log => log.user_id),
        ...logs.map(log => log.performed_by)
      ]));
      
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, nome, email")
        .in("id", userIds);
      
      if (profilesError) {
        console.warn("Erro ao buscar perfis:", profilesError);
        // Retornar logs sem informações de perfil em caso de erro
        return logs.map(log => ({
          ...log,
          user: null,
          performed_by_user: null
        }));
      }
      
      // Mapear os logs com as informações dos usuários
      return logs.map(log => ({
        ...log,
        user: profiles?.find(p => p.id === log.user_id) || null,
        performed_by_user: profiles?.find(p => p.id === log.performed_by) || null
      }));
    },
  });
}

export async function createAuditLog(
  userId: string, 
  action: string, 
  details?: Record<string, any>
) {
  const { data, error } = await supabase.rpc('create_audit_log', {
    target_user_id: userId,
    action_type: action,
    action_details: details || {}
  });
  
  if (error) throw error;
  return data;
}
