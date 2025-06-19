
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SystemAnalysis from '@/components/system/SystemAnalysis';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

export default function AnaliseDoSistema() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Acesso negado. Esta página é restrita a administradores.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Análise do Sistema</h1>
      </div>
      
      <SystemAnalysis />
    </div>
  );
}
