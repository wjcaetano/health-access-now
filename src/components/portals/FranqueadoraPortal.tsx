
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";

// Páginas específicas da franqueadora
import DashboardFranqueadora from "@/pages/franqueadora/DashboardFranqueadora";
import GestaoFranquias from "@/pages/franqueadora/GestaoFranquias";
import LeadsFranqueados from "@/pages/franqueadora/LeadsFranqueados";
import CRMFranqueados from "@/pages/franqueadora/CRMFranqueados";
import FinanceiroMatriz from "@/pages/franqueadora/FinanceiroMatriz";
import GestaoRoyalties from "@/pages/franqueadora/GestaoRoyalties";
import GestaoContratos from "@/pages/franqueadora/GestaoContratos";
import RelatoriosExecutivos from "@/pages/franqueadora/RelatoriosExecutivos";
import MetasKPIs from "@/pages/franqueadora/MetasKPIs";
import ExpansaoFranquias from "@/pages/franqueadora/ExpansaoFranquias";
import MeuPerfil from "@/pages/MeuPerfil";

const FranqueadoraPortal: React.FC = () => {
  const { profile, isActive, isAdmin } = useAuth();

  // Apenas admins da franqueadora têm acesso
  if (!isActive || !isAdmin || profile?.nivel_acesso !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardFranqueadora />} />
        <Route path="franquias" element={<GestaoFranquias />} />
        <Route path="leads" element={<LeadsFranqueados />} />
        <Route path="franqueados" element={<CRMFranqueados />} />
        <Route path="financeiro" element={<FinanceiroMatriz />} />
        <Route path="royalties" element={<GestaoRoyalties />} />
        <Route path="contratos" element={<GestaoContratos />} />
        <Route path="relatorios" element={<RelatoriosExecutivos />} />
        <Route path="metas" element={<MetasKPIs />} />
        <Route path="expansao" element={<ExpansaoFranquias />} />
        <Route path="perfil" element={<MeuPerfil />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

export default FranqueadoraPortal;
