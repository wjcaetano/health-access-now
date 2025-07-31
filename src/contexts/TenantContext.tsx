
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnidadeById } from '@/hooks/useTenants';
import { Tables } from '@/integrations/supabase/types';

type Unidade = Tables<"unidades">;

interface TenantContextType {
  currentTenant: Unidade | null;
  isLoading: boolean;
  switchTenant: (unidadeId: string) => void;
  hasMultipleTenants: boolean;
  canAccessTenant: (unidadeId: string) => boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(null);
  
  const { data: currentTenant, isLoading } = useUnidadeById(currentTenantId || '');

  useEffect(() => {
    if (profile?.unidade_id && !currentTenantId) {
      setCurrentTenantId(profile.unidade_id);
    }
  }, [profile?.unidade_id, currentTenantId]);

  const switchTenant = (unidadeId: string) => {
    setCurrentTenantId(unidadeId);
    // Store in localStorage for persistence
    localStorage.setItem('current-tenant-id', unidadeId);
  };

  const canAccessTenant = (unidadeId: string) => {
    // Simplified logic - in practice would check user permissions
    return profile?.unidade_id === unidadeId;
  };

  const hasMultipleTenants = false;

  const value: TenantContextType = {
    currentTenant: currentTenant || null,
    isLoading,
    switchTenant,
    hasMultipleTenants,
    canAccessTenant,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
