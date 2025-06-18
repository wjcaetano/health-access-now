
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type UserProfile = {
  id: string;
  email: string;
  nome: string | null;
  nivel_acesso: 'colaborador' | 'atendente' | 'gerente' | 'admin';
  colaborador_id: string | null;
  prestador_id: string | null;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, nome: string, nivel_acesso?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isManager: boolean;
  isPrestador: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      // Garantir que nivel_acesso está tipado corretamente
      const typedProfile: UserProfile = {
        id: data.id,
        email: data.email,
        nome: data.nome,
        nivel_acesso: data.nivel_acesso as 'colaborador' | 'atendente' | 'gerente' | 'admin',
        colaborador_id: data.colaborador_id,
        prestador_id: data.prestador_id,
      };
      
      setProfile(typedProfile);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Setup auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetching to prevent deadlocks
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Clean up any existing state
      localStorage.removeItem("agendaja_authenticated");
      localStorage.removeItem("agendaja_user_type");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, nome: string, nivel_acesso = 'colaborador') => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nome,
            nivel_acesso
          }
        }
      });
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Clean up localStorage
      localStorage.removeItem("agendaja_authenticated");
      localStorage.removeItem("agendaja_user_type");
      
      await supabase.auth.signOut({ scope: 'global' });
      
      // Force page refresh for clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Erro no logout:', error);
      // Force refresh even if logout fails
      window.location.href = '/';
    }
  };

  const isAdmin = profile?.nivel_acesso === 'admin';
  const isManager = profile?.nivel_acesso === 'gerente' || isAdmin;
  const isPrestador = !!profile?.prestador_id;

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isManager,
    isPrestador,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
