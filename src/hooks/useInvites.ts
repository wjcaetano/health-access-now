
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useInvites() {
  return useQuery({
    queryKey: ["invites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_invites")
        .select(`
          *,
          invited_by_user:profiles!user_invites_invited_by_fkey(nome, email)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
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
