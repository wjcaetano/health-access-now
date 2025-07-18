
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

// Importar os portais específicos
import UnidadePortal from "@/components/portals/UnidadePortal";
import PrestadorPortal from "@/components/portals/PrestadorPortal";
import FranqueadoraPortal from "@/components/portals/FranqueadoraPortal";

const PortalRouter: React.FC = () => {
  const { user, profile, loading, isActive, isPrestador, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user || !isActive) {
    return <Navigate to="/login" replace />;
  }

  // Redirecionar para o portal específico baseado no perfil do usuário
  if (isPrestador) {
    return <PrestadorPortal />;
  }

  // Verificar se é admin da franqueadora (tem acesso total)
  if (isAdmin && profile?.tenant_id && profile?.nivel_acesso === 'admin') {
    // Se for admin e estiver tentando acessar a franqueadora
    if (window.location.pathname.startsWith('/franqueadora')) {
      return <FranqueadoraPortal />;
    }
    // Caso contrário, redireciona para unidade
    return <UnidadePortal />;
  }

  // Usuários da unidade/franquia (atendente, gerente, admin_franqueado)
  if (['atendente', 'gerente', 'admin'].includes(profile?.nivel_acesso || '')) {
    return <UnidadePortal />;
  }

  // Fallback para login se não se encaixar em nenhum perfil
  return <Navigate to="/login" replace />;
};

export default PortalRouter;
