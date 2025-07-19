
import React, { useRef, useEffect } from 'react';
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
  const hasRedirected = useRef(false);

  // Reset redirect flag when location changes
  useEffect(() => {
    hasRedirected.current = false;
  }, [location.pathname]);

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user || !isActive) {
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return null;
  }

  // Check admin requirement
  if (requireAdmin && profile?.nivel_acesso !== 'admin') {
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      return <Navigate to="/unidade/dashboard" replace />;
    }
    return null;
  }

  // Check specific level requirement
  if (requiredLevel && profile?.nivel_acesso !== requiredLevel) {
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      const redirectPath = profile?.nivel_acesso === 'prestador' ? '/prestador/portal' : '/unidade/dashboard';
      return <Navigate to={redirectPath} replace />;
    }
    return null;
  }

  return <>{children}</>;
}
