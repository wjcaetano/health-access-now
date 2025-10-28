import React from 'react';
import { RouteGuard } from './RouteGuard';

interface ClientGuardProps {
  children: React.ReactNode;
}

/**
 * Guard para proteger rotas de clientes
 */
export const ClientGuard: React.FC<ClientGuardProps> = ({ children }) => {
  return (
    <RouteGuard requiredLevel="cliente">
      {children}
    </RouteGuard>
  );
};
