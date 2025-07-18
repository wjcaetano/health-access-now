
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";

// Páginas específicas do prestador
import PortalPrestador from "@/pages/prestador/Portal";
import GuiasPrestador from "@/pages/prestador/Guias";
import FaturamentoPrestador from "@/pages/prestador/Faturamento";
import MeuPerfil from "@/pages/MeuPerfil";

const PrestadorPortal: React.FC = () => {
  const { profile, isActive, isPrestador } = useAuth();

  if (!isActive || !isPrestador) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Routes>
        <Route index element={<Navigate to="portal" replace />} />
        <Route path="portal" element={<PortalPrestador />} />
        <Route path="guias" element={<GuiasPrestador />} />
        <Route path="faturamento" element={<FaturamentoPrestador />} />
        <Route path="perfil" element={<MeuPerfil />} />
        <Route path="*" element={<Navigate to="portal" replace />} />
      </Routes>
    </Layout>
  );
};

export default PrestadorPortal;
