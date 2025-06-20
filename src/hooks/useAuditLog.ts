
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAuditLog() {
  return useQuery({
    queryKey: ["auditLog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_audit_log")
        .select(`
          *,
          user:profiles!user_audit_log_user_id_fkey(nome, email),
          performed_by_user:profiles!user_audit_log_performed_by_fkey(nome, email)
        `)
        .order("created_at", { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
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
