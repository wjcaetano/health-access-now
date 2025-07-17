
import React from 'react';
import { RouteGuard } from './RouteGuard';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  return (
    <RouteGuard requiredLevel="admin">
      {children}
    </RouteGuard>
  );
};
