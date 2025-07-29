
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import QualityDashboard from '@/components/quality/QualityDashboard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

export default function QualityPage() {
  const { isManager } = useAuth();

  if (!isManager) {
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
    <div className="container mx-auto p-6">
      <QualityDashboard />
    </div>
  );
}
