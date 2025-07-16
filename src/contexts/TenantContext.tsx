
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTenantById } from '@/hooks/useTenants';
import { Tables } from '@/integrations/supabase/types';

type Tenant = Tables<"tenants">;

interface TenantContextType {
  currentTenant: Tenant | null;
  isLoading: boolean;
  switchTenant: (tenantId: string) => void;
  hasMultipleTenants: boolean;
  canAccessTenant: (tenantId: string) => boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(null);
  
  const { data: currentTenant, isLoading } = useTenantById(currentTenantId || '');

  useEffect(() => {
    if (profile?.tenant_id && !currentTenantId) {
      setCurrentTenantId(profile.tenant_id);
    }
  }, [profile?.tenant_id, currentTenantId]);

  const switchTenant = (tenantId: string) => {
    setCurrentTenantId(tenantId);
    // Store in localStorage for persistence
    localStorage.setItem('current-tenant-id', tenantId);
  };

  const canAccessTenant = (tenantId: string) => {
    // Simplified logic - in practice would check user permissions
    return profile?.nivel_acesso === 'admin' || profile?.tenant_id === tenantId;
  };

  const hasMultipleTenants = profile?.nivel_acesso === 'admin';

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
