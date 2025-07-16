
import React from 'react';
import { TenantProvider } from '@/contexts/TenantContext';
import { TenantSelector } from '@/components/auth/TenantSelector';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

interface TenantAwareLayoutProps {
  children: React.ReactNode;
}

export const TenantAwareLayout: React.FC<TenantAwareLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute>
      <TenantProvider>
        <div className="min-h-screen bg-background">
          <header className="border-b">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <h1 className="text-2xl font-bold">AgendaJá</h1>
              <TenantSelector />
            </div>
          </header>
          <main className="container mx-auto px-4 py-6">
            {children}
          </main>
        </div>
      </TenantProvider>
    </ProtectedRoute>
  );
};
