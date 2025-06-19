
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

type UserInvite = Tables<"user_invites">;
type UserInviteInsert = TablesInsert<"user_invites">;

export function useInvites() {
  return useQuery({
    queryKey: ["user-invites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_invites")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateInvite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ email, nome, nivel_acesso }: { 
      email: string; 
      nome: string; 
      nivel_acesso: string;
    }) => {
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias para aceitar

      const { data, error } = await supabase
        .from("user_invites")
        .insert({
          email,
          nome,
          nivel_acesso,
          token,
          expires_at: expiresAt.toISOString(),
          invited_by: (await supabase.auth.getUser()).data.user!.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Enviar email de convite (implementação futura)
      console.log(`Convite enviado para ${email} com token: ${token}`);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-invites"] });
    },
  });
}

export function useAcceptInvite() {
  return useMutation({
    mutationFn: async ({ token, password }: { token: string; password: string }) => {
      // Buscar convite válido
      const { data: invite, error: inviteError } = await supabase
        .from("user_invites")
        .select("*")
        .eq("token", token)
        .is("used_at", null)
        .gt("expires_at", new Date().toISOString())
        .single();
      
      if (inviteError || !invite) {
        throw new Error("Convite inválido ou expirado");
      }

      // Criar usuário
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: invite.email,
        password,
        options: {
          data: {
            nome: invite.nome,
            nivel_acesso: invite.nivel_acesso
          }
        }
      });

      if (authError) throw authError;

      // Marcar convite como usado
      const { error: updateError } = await supabase
        .from("user_invites")
        .update({ used_at: new Date().toISOString() })
        .eq("id", invite.id);

      if (updateError) throw updateError;

      return authData;
    },
  });
}
