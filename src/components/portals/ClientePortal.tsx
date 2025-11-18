import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import PortalErrorBoundary from "@/components/shared/PortalErrorBoundary";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import { PortalClienteDashboard } from "@/pages/clientes/PortalClienteDashboard";
import { PortalClienteAgendamentos } from "@/pages/clientes/PortalClienteAgendamentos";
import { useHasRole } from "@/hooks/useUserRoles";
import { CLIENT_ROUTES } from "@/lib/routes";

const LazyPortalClienteOrcamentos = lazy(() => import("@/pages/clientes/PortalClienteOrcamentos"));
const LazyPortalClienteGuias = lazy(() => import("@/pages/clientes/PortalClienteGuias"));

/**
 * Portal do Cliente
 * Permite que clientes visualizem seus agendamentos e histórico
 */
const ClientePortal: React.FC = () => {
  const { user, isActive } = useAuth();
  const isCliente = useHasRole(user?.id, 'cliente');

  if (!isActive || !isCliente) {
    return <Navigate to="/login" replace />;
  }

  return (
    <PortalErrorBoundary portalType="cliente">
      <Layout>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={
            <SuspenseWrapper>
              <PortalClienteDashboard />
            </SuspenseWrapper>
          } />
          <Route path="appointments" element={
            <SuspenseWrapper>
              <PortalClienteAgendamentos />
            </SuspenseWrapper>
          } />
          <Route path="quotes" element={
            <SuspenseWrapper>
              <LazyPortalClienteOrcamentos />
            </SuspenseWrapper>
          } />
          <Route path="guides" element={
            <SuspenseWrapper>
              <LazyPortalClienteGuias />
            </SuspenseWrapper>
          } />
          
          {/* Legacy redirects */}
          <Route path="agendamentos" element={<Navigate to={CLIENT_ROUTES.APPOINTMENTS} replace />} />
          <Route path="orcamentos" element={<Navigate to={CLIENT_ROUTES.QUOTES} replace />} />
          
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Layout>
    </PortalErrorBoundary>
  );
};

export default ClientePortal;
