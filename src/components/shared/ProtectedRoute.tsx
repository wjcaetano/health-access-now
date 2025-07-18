
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requiredLevel?: 'atendente' | 'gerente' | 'admin' | 'prestador';
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  requiredLevel,
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const { user, profile, loading, initialized, isActive } = useAuth();
  const location = useLocation();

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user || !isActive) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && profile?.nivel_acesso !== 'admin') {
    return <Navigate to="/unidade/dashboard" replace />;
  }

  // Check specific level requirement
  if (requiredLevel && profile?.nivel_acesso !== requiredLevel) {
    const redirectPath = profile?.nivel_acesso === 'prestador' ? '/prestador/portal' : '/unidade/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
