
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

type TenantInvite = Tables<"tenant_invites">;
type NovoTenantInvite = TablesInsert<"tenant_invites">;

export function useTenantInvites(tenantId?: string) {
  return useQuery({
    queryKey: ["tenant-invites", tenantId],
    queryFn: async () => {
      let query = supabase
        .from("tenant_invites")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (tenantId) {
        query = query.eq("tenant_id", tenantId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as TenantInvite[];
    },
  });
}

export function useCreateTenantInvite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (invite: NovoTenantInvite) => {
      const { data, error } = await supabase
        .from("tenant_invites")
        .insert([invite])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-invites"] });
    },
  });
}

export function useAcceptTenantInvite() {
  return useMutation({
    mutationFn: async ({ token, password }: { token: string; password: string }) => {
      const { data, error } = await supabase.rpc('accept_tenant_invite', {
        invite_token: token,
        user_password: password
      });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useCancelTenantInvite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (inviteId: string) => {
      const { data, error } = await supabase
        .from("tenant_invites")
        .update({ status: 'cancelado' })
        .eq("id", inviteId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-invites"] });
    },
  });
}
