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
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
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


        if (error) {
          throw new Error(`Erro na Edge Function: ${error.message}`);
        }

        if (!data || !data.success) {
          const errorMessage = data?.error || 'Erro desconhecido na criação do usuário';
          throw new Error(errorMessage);
        }

        return data;

      } catch (error) {
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
      
      try {
        const { data, error } = await supabase.functions.invoke('reset-user-password', {
          body: { email }
        });

        if (error) {
          throw new Error(`Erro na Edge Function: ${error.message}`);
        }

        if (!data || !data.success) {
          const errorMessage = data?.error || 'Erro desconhecido no reset de senha';
          throw new Error(errorMessage);
        }
        return data;

      } catch (error) {
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
