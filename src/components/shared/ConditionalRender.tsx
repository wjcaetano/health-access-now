
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ConditionalRenderProps {
  children: React.ReactNode;
  roles?: string[];
  condition?: boolean;
  fallback?: React.ReactNode;
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = React.memo(({ 
  children, 
  roles, 
  condition = true,
  fallback = null 
}) => {
  const { profile } = useAuth();

  if (!condition) {
    return <>{fallback}</>;
  }

  if (roles && profile) {
    const hasRole = roles.includes(profile.nivel_acesso);
    if (!hasRole) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
});

ConditionalRender.displayName = "ConditionalRender";
