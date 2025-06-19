
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type AuditLog = Tables<"user_audit_log">;

export function useAuditLog(userId?: string) {
  return useQuery({
    queryKey: ["audit-log", userId],
    queryFn: async () => {
      let query = supabase
        .from("user_audit_log")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (userId) {
        query = query.eq("user_id", userId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
}

export async function createAuditLog(
  userId: string, 
  action: string, 
  details?: any
) {
  const { data, error } = await supabase.rpc("create_audit_log", {
    target_user_id: userId,
    action_type: action,
    action_details: details
  });
  
  if (error) throw error;
  return data;
}
