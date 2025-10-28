
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import PortalErrorBoundary from "@/components/shared/PortalErrorBoundary";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import { useHasRole } from "@/hooks/useUserRoles";
import { PROVIDER_ROUTES } from "@/lib/routes";

// Páginas específicas do prestador
import { 
  LazyPortalPrestador as PortalPrestador,
  LazyGuiasPrestador as GuiasPrestador,
  LazyFaturamentoPrestador as FaturamentoPrestador,
  LazyMeuPerfil as MeuPerfil
} from "@/components/layout/LazyPages";

const PrestadorPortal: React.FC = () => {
  const { user, isActive } = useAuth();
  const isPrestador = useHasRole(user?.id, 'prestador');

  if (!isActive || !isPrestador) {
    return <Navigate to="/login" replace />;
  }

  return (
    <PortalErrorBoundary portalType="prestador">
      <Layout>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={
            <SuspenseWrapper>
              <PortalPrestador />
            </SuspenseWrapper>
          } />
          <Route path="guides" element={
            <SuspenseWrapper>
              <GuiasPrestador />
            </SuspenseWrapper>
          } />
          <Route path="billing" element={
            <SuspenseWrapper>
              <FaturamentoPrestador />
            </SuspenseWrapper>
          } />
          <Route path="profile" element={
            <SuspenseWrapper>
              <MeuPerfil />
            </SuspenseWrapper>
          } />
          
          {/* Legacy redirects */}
          <Route path="portal" element={<Navigate to={PROVIDER_ROUTES.ROOT} replace />} />
          <Route path="guias" element={<Navigate to={PROVIDER_ROUTES.GUIDES} replace />} />
          <Route path="faturamento" element={<Navigate to={PROVIDER_ROUTES.BILLING} replace />} />
          <Route path="perfil" element={<Navigate to={PROVIDER_ROUTES.PROFILE} replace />} />
          
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Layout>
    </PortalErrorBoundary>
  );
};

export default PrestadorPortal;
