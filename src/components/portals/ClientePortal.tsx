import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import PortalErrorBoundary from "@/components/shared/PortalErrorBoundary";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import { PortalClienteDashboard } from "@/pages/clientes/PortalClienteDashboard";
import { PortalClienteAgendamentos } from "@/pages/clientes/PortalClienteAgendamentos";

/**
 * Portal do Cliente
 * Permite que clientes visualizem seus agendamentos e histórico
 */
const ClientePortal: React.FC = () => {
  const { profile, isActive } = useAuth();

  if (!isActive || profile?.nivel_acesso !== 'cliente') {
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
          <Route path="agendamentos" element={
            <SuspenseWrapper>
              <PortalClienteAgendamentos />
            </SuspenseWrapper>
          } />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Layout>
    </PortalErrorBoundary>
  );
};

export default ClientePortal;
