
import React from 'react';
import { RouteGuard } from './RouteGuard';

interface ProviderGuardProps {
  children: React.ReactNode;
}

export const ProviderGuard: React.FC<ProviderGuardProps> = ({ children }) => {
  return (
    <RouteGuard requiredLevel="prestador">
      {children}
    </RouteGuard>
  );
};
