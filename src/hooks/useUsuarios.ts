
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
      console.log("=== INICIANDO CRIAÇÃO DE USUÁRIO ===");
      console.log("Dados recebidos:", { nome, email, cargo, nivel_acesso });
      
      try {
        // 1. Verificar se o email já existe nas tabelas
        console.log("1. Verificando se email já existe...");
        
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("email")
          .eq("email", email)
          .maybeSingle();
        
        if (existingProfile) {
          console.error("Email já existe na tabela profiles");
          throw new Error(`O email ${email} já está cadastrado no sistema.`);
        }
        
        const { data: existingColaborador } = await supabase
          .from("colaboradores")
          .select("email")
          .eq("email", email)
          .maybeSingle();
        
        if (existingColaborador) {
          console.error("Email já existe na tabela colaboradores");
          throw new Error(`O email ${email} já está cadastrado como colaborador.`);
        }
        
        // 2. Verificar se já existe na tabela auth.users (usando função RPC)
        console.log("2. Verificando auth.users...");
        const { data: authUsers, error: authCheckError } = await supabase.rpc('check_user_exists', {
          user_email: email
        });
        
        if (authCheckError) {
          console.log("Função RPC não existe, continuando...", authCheckError);
        } else if (authUsers) {
          console.error("Email já existe na tabela auth.users");
          throw new Error(`O email ${email} já possui conta de acesso no sistema.`);
        }
        
        // 3. Gerar senha provisória
        console.log("3. Gerando senha provisória...");
        const senhaProvisoria = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
        console.log("Senha gerada (tamanho):", senhaProvisoria.length);
        
        // 4. Criar usuário no Supabase Auth
        console.log("4. Criando usuário no auth...");
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: email.toLowerCase().trim(),
          password: senhaProvisoria,
          email_confirm: true,
          user_metadata: {
            nome: nome.trim(),
            nivel_acesso,
            senha_provisoria: true
          }
        });
        
        console.log("Resultado auth:", { 
          success: !!authData?.user, 
          userId: authData?.user?.id,
          error: authError?.message 
        });
        
        if (authError) {
          console.error("Erro detalhado do auth:", authError);
          
          // Erros específicos mais claros
          if (authError.message.includes('rate_limit')) {
            throw new Error("Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.");
          }
          if (authError.message.includes('email_address_invalid')) {
            throw new Error("Email inválido. Verifique o formato do email.");
          }
          if (authError.message.includes('password')) {
            throw new Error("Erro na senha gerada. Tente novamente.");
          }
          if (authError.message.includes('user_already_exists')) {
            throw new Error(`O email ${email} já possui uma conta no sistema.`);
          }
          
          throw new Error(`Erro ao criar conta de acesso: ${authError.message}`);
        }
        
        if (!authData?.user?.id) {
          throw new Error("Falha ao criar usuário - ID não retornado");
        }
        
        console.log("5. Usuário auth criado com ID:", authData.user.id);
        
        // 5. Criar colaborador na tabela colaboradores
        console.log("6. Criando colaborador...");
        const { data: colaboradorData, error: colaboradorError } = await supabase
          .from("colaboradores")
          .insert({
            nome: nome.trim(),
            email: email.toLowerCase().trim(),
            cargo: cargo?.trim() || '',
            nivel_acesso
          })
          .select()
          .single();
        
        console.log("Resultado colaborador:", { 
          success: !!colaboradorData, 
          error: colaboradorError?.message 
        });
        
        if (colaboradorError) {
          console.error("Erro ao criar colaborador:", colaboradorError);
          
          // Rollback: excluir usuário criado
          console.log("7. Fazendo rollback do usuário auth...");
          try {
            await supabase.auth.admin.deleteUser(authData.user.id);
            console.log("Rollback concluído");
          } catch (rollbackError) {
            console.error("Erro no rollback:", rollbackError);
          }
          
          // Erro específico para colaborador
          if (colaboradorError.code === '23505') {
            throw new Error(`O email ${email} já está cadastrado como colaborador.`);
          }
          
          throw new Error(`Erro ao criar colaborador: ${colaboradorError.message}`);
        }
        
        console.log("=== USUÁRIO CRIADO COM SUCESSO ===");
        console.log("Auth ID:", authData.user.id);
        console.log("Colaborador ID:", colaboradorData.id);
        
        return { 
          user: authData.user, 
          colaborador: colaboradorData,
          senha_provisoria: senhaProvisoria 
        };
        
      } catch (error) {
        console.error("=== ERRO COMPLETO NA CRIAÇÃO ===");
        console.error("Tipo do erro:", typeof error);
        console.error("Erro:", error);
        
        if (error instanceof Error) {
          throw error;
        } else {
          throw new Error(`Erro desconhecido: ${String(error)}`);
        }
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
