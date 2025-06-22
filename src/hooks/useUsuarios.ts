
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesUpdate } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type ProfileUpdate = TablesUpdate<"profiles">;

export function useUsuarios() {
  return useQuery({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          colaboradores(nome),
          prestadores(nome)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateUsuarioStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update({ status })
        .eq("id", userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
}

export function useUpdateUsuario() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: ProfileUpdate }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
}

export function useCreateUsuario() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      nome, 
      email, 
      cargo, 
      nivel_acesso 
    }: { 
      nome: string; 
      email: string; 
      cargo?: string; 
      nivel_acesso: string; 
    }) => {
      console.log("Iniciando criação de usuário:", { nome, email, nivel_acesso });
      
      // Gerar senha provisória
      const senhaProvisoria = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      
      try {
        // Criar usuário no Supabase Auth usando o service role key
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          password: senhaProvisoria,
          email_confirm: true,
          user_metadata: {
            nome,
            nivel_acesso,
            senha_provisoria: true
          }
        });
        
        console.log("Resultado da criação do usuário auth:", { authData, authError });
        
        if (authError) {
          console.error("Erro ao criar usuário auth:", authError);
          throw new Error(`Erro ao criar usuário: ${authError.message}`);
        }
        
        if (!authData?.user) {
          throw new Error("Usuário não foi criado corretamente");
        }
        
        // Criar colaborador na tabela colaboradores
        const { error: colaboradorError } = await supabase
          .from("colaboradores")
          .insert({
            nome,
            email,
            cargo: cargo || '',
            nivel_acesso
          });
        
        console.log("Resultado da criação do colaborador:", { colaboradorError });
        
        if (colaboradorError) {
          console.error("Erro ao criar colaborador:", colaboradorError);
          // Se falhou ao criar colaborador, tentar excluir o usuário criado
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw new Error(`Erro ao criar colaborador: ${colaboradorError.message}`);
        }
        
        return { 
          user: authData.user, 
          senha_provisoria: senhaProvisoria 
        };
      } catch (error) {
        console.error("Erro completo na criação:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      queryClient.invalidateQueries({ queryKey: ["colaboradores"] });
    },
  });
}

export function useDeleteUsuario() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userEmail: string) => {
      const { error } = await supabase.rpc('delete_user_and_colaborador', {
        user_email: userEmail
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      queryClient.invalidateQueries({ queryKey: ["colaboradores"] });
    },
  });
}
