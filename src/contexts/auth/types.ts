
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  nome?: string;
  nivel_acesso: 'atendente' | 'gerente' | 'admin' | 'prestador';
  status: 'pendente' | 'aguardando_aprovacao' | 'ativo' | 'suspenso' | 'inativo';
  tenant_id?: string;
  colaborador_id?: string;
  prestador_id?: string;
  foto_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  sendPasswordReset: (email: string) => Promise<{ error: any }>;
  isAdmin: boolean;
  isManager: boolean;
  isPrestador: boolean;
  isActive: boolean;
  requiresPasswordChange: boolean;
  hasMultiTenantAccess: boolean;
  isUnidadeUser: boolean;
  isFranqueadoraUser: boolean;
}
