
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import PortalErrorBoundary from "@/components/shared/PortalErrorBoundary";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";

// Páginas específicas do prestador
import { 
  LazyPortalPrestador as PortalPrestador,
  LazyGuiasPrestador as GuiasPrestador,
  LazyFaturamentoPrestador as FaturamentoPrestador,
  LazyMeuPerfil as MeuPerfil
} from "@/components/layout/LazyPages";

const PrestadorPortal: React.FC = () => {
  const { profile, isActive, isPrestador } = useAuth();

  if (!isActive || !isPrestador) {
    return <Navigate to="/login" replace />;
  }

  return (
    <PortalErrorBoundary portalType="prestador">
      <Layout>
        <Routes>
          <Route index element={<Navigate to="portal" replace />} />
          <Route path="portal" element={
            <SuspenseWrapper>
              <PortalPrestador />
            </SuspenseWrapper>
          } />
          <Route path="guias" element={
            <SuspenseWrapper>
              <GuiasPrestador />
            </SuspenseWrapper>
          } />
          <Route path="faturamento" element={
            <SuspenseWrapper>
              <FaturamentoPrestador />
            </SuspenseWrapper>
          } />
          <Route path="perfil" element={
            <SuspenseWrapper>
              <MeuPerfil />
            </SuspenseWrapper>
          } />
          <Route path="*" element={<Navigate to="portal" replace />} />
        </Routes>
      </Layout>
    </PortalErrorBoundary>
  );
};

export default PrestadorPortal;
