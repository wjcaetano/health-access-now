
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useInvites() {
  return useQuery({
    queryKey: ["invites"],
    queryFn: async () => {
      // Primeiro buscar os convites
      const { data: invites, error: invitesError } = await supabase
        .from("user_invites")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (invitesError) throw invitesError;
      
      if (!invites || invites.length === 0) return [];
      
      // Buscar os perfis dos usuários que criaram os convites
      const inviterIds = Array.from(new Set(invites.map(invite => invite.invited_by)));
      
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, nome, email")
        .in("id", inviterIds);
      
      if (profilesError) {
        console.warn("Erro ao buscar perfis dos convidadores:", profilesError);
        // Retornar convites sem informações do convidador em caso de erro
        return invites.map(invite => ({
          ...invite,
          invited_by_user: null
        }));
      }
      
      // Mapear os convites com as informações dos convidadores
      return invites.map(invite => ({
        ...invite,
        invited_by_user: profiles?.find(p => p.id === invite.invited_by) || null
      }));
    },
  });
}

export function useCreateInvite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      email, 
      nome, 
      nivel_acesso 
    }: { 
      email: string; 
      nome: string; 
      nivel_acesso: string; 
    }) => {
      // Gerar token único
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expira em 7 dias
      
      const { data, error } = await supabase
        .from("user_invites")
        .insert({
          email,
          nome,
          nivel_acesso,
          token,
          expires_at: expiresAt.toISOString(),
          invited_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
    },
  });
}

export function useRevokeInvite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (inviteId: string) => {
      const { error } = await supabase
        .from("user_invites")
        .delete()
        .eq("id", inviteId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
    },
  });
}
