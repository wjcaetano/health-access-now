
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

type UnidadeInvite = Tables<"unidade_invites">;
type NovoUnidadeInvite = TablesInsert<"unidade_invites">;

export function useTenantInvites(unidadeId?: string) {
  return useQuery({
    queryKey: ["unidade-invites", unidadeId],
    queryFn: async () => {
      let query = supabase
        .from("unidade_invites")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (unidadeId) {
        query = query.eq("unidade_id", unidadeId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as UnidadeInvite[];
    },
  });
}

export function useCreateTenantInvite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (invite: NovoUnidadeInvite) => {
      const { data, error } = await supabase
        .from("unidade_invites")
        .insert([invite])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ["unidade-invites", data.unidade_id] 
      });
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
        .from("unidade_invites")
        .update({ status: 'cancelado' })
        .eq("id", inviteId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ["unidade-invites", data.unidade_id] 
      });
    },
  });
}
