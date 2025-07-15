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
      console.log("=== INICIANDO CRIAÇÃO DE USUÁRIO VIA EDGE FUNCTION ===");
      console.log("Dados recebidos:", { nome, email, cargo, nivel_acesso });
      
      try {
        // Chamar Edge Function para criar usuário
        const { data, error } = await supabase.functions.invoke('create-user', {
          body: {
            nome: nome.trim(),
            email: email.toLowerCase().trim(),
            cargo: cargo?.trim(),
            nivel_acesso
          }
        });

        console.log("Resposta da Edge Function:", { data, error });

        if (error) {
          console.error("Erro da Edge Function:", error);
          throw new Error(`Erro na Edge Function: ${error.message}`);
        }

        if (!data || !data.success) {
          const errorMessage = data?.error || 'Erro desconhecido na criação do usuário';
          console.error("Edge Function retornou erro:", errorMessage);
          throw new Error(errorMessage);
        }

        console.log("=== USUÁRIO CRIADO COM SUCESSO VIA EDGE FUNCTION ===");
        console.log("Dados retornados:", data);

        return data;

      } catch (error) {
        console.error("=== ERRO COMPLETO NA CRIAÇÃO VIA EDGE FUNCTION ===");
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

export function useResetUsuarioPassword() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (email: string) => {
      console.log("=== INICIANDO RESET DE SENHA VIA EDGE FUNCTION ===");
      console.log("Email:", email);
      
      try {
        const { data, error } = await supabase.functions.invoke('reset-user-password', {
          body: { email }
        });

        console.log("Resposta da Edge Function:", { data, error });

        if (error) {
          console.error("Erro da Edge Function:", error);
          throw new Error(`Erro na Edge Function: ${error.message}`);
        }

        if (!data || !data.success) {
          const errorMessage = data?.error || 'Erro desconhecido no reset de senha';
          console.error("Edge Function retornou erro:", errorMessage);
          throw new Error(errorMessage);
        }

        console.log("=== RESET DE SENHA CONCLUÍDO VIA EDGE FUNCTION ===");
        return data;

      } catch (error) {
        console.error("=== ERRO COMPLETO NO RESET VIA EDGE FUNCTION ===");
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
    },
  });
}
