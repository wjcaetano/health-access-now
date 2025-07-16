
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, UserProfile } from './auth/types';
import * as authOps from './auth/authOperations';
import { fetchUserProfile } from './auth/profileService';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Verificar se é senha provisória
  const requiresPasswordChange = user?.user_metadata?.senha_provisoria === true;

  const loadUserProfile = useCallback(async (userId: string) => {
    const userProfile = await fetchUserProfile(userId);
    setProfile(userProfile);
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Setup auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;

            console.log('Auth state change:', event, session?.user?.id);
            
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              // Verificar se precisa trocar senha
              const senhaProvisoria = session.user.user_metadata?.senha_provisoria;
              if (senhaProvisoria) {
                console.log('Usuário com senha provisória detectado');
              }
              
              // Defer profile fetching to prevent deadlocks
              setTimeout(() => {
                if (mounted) {
                  loadUserProfile(session.user.id);
                }
              }, 100);
            } else {
              setProfile(null);
            }
            
            if (!initialized) {
              setLoading(false);
              setInitialized(true);
            }
          }
        );

        // Check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            loadUserProfile(session.user.id);
          }
          
          setLoading(false);
          setInitialized(true);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [loadUserProfile, initialized]);

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    const result = await authOps.updateProfile(user?.id || '', updates);
    if (!result.error && user) {
      await loadUserProfile(user.id);
    }
    return result;
  };

  const handleUpdatePassword = async (newPassword: string) => {
    const result = await authOps.updatePassword(newPassword);
    if (!result.error && user) {
      setUser({
        ...user,
        user_metadata: {
          ...user.user_metadata,
          senha_provisoria: false,
          senha_alterada_em: new Date().toISOString()
        }
      });
    }
    return result;
  };

  const isAdmin = profile?.nivel_acesso === 'admin';
  const isManager = profile?.nivel_acesso === 'gerente' || isAdmin;
  const isPrestador = !!profile?.prestador_id;
  const isActive = profile?.status === 'ativo';
  const hasMultiTenantAccess = isAdmin || profile?.nivel_acesso === 'gerente';

  const value = {
    user,
    session,
    profile,
    loading,
    initialized,
    signIn: authOps.signIn,
    signUp: authOps.signUp,
    signOut: authOps.signOut,
    updateProfile: handleUpdateProfile,
    updatePassword: handleUpdatePassword,
    sendPasswordReset: authOps.sendPasswordReset,
    isAdmin,
    isManager,
    isPrestador,
    isActive,
    requiresPasswordChange,
    hasMultiTenantAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
