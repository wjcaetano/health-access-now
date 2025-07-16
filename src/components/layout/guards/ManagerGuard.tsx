
import React from 'react';
import { RouteGuard } from './RouteGuard';

interface ManagerGuardProps {
  children: React.ReactNode;
}

export const ManagerGuard: React.FC<ManagerGuardProps> = ({ children }) => {
  return (
    <RouteGuard requiredLevel="gerente">
      {children}
    </RouteGuard>
  );
};
