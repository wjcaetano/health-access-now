
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";

// Páginas específicas da unidade/franquia
import Index from "@/pages/Index";
import Vendas from "@/pages/Vendas";
import Clientes from "@/pages/Clientes";
import Agendamentos from "@/pages/Agendamentos";
import Orcamentos from "@/pages/Orcamentos";
import Servicos from "@/pages/Servicos";
import Prestadores from "@/pages/Prestadores";
import Financeiro from "@/pages/Financeiro";
import Colaboradores from "@/pages/Colaboradores";
import MeuPerfil from "@/pages/MeuPerfil";
import SystemSettings from "@/pages/SystemSettings";

const UnidadePortal: React.FC = () => {
  const { profile, isActive } = useAuth();

  // Verificar se é um usuário da unidade/franquia
  const isUnidadeUser = ['atendente', 'gerente', 'admin'].includes(profile?.nivel_acesso || '');

  if (!isActive || !isUnidadeUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Index />} />
        <Route path="vendas" element={<Vendas />} />
        <Route path="clientes/*" element={<Clientes />} />
        <Route path="agendamentos/*" element={<Agendamentos />} />
        <Route path="orcamentos/*" element={<Orcamentos />} />
        <Route path="servicos/*" element={<Servicos />} />
        <Route path="prestadores/*" element={<Prestadores />} />
        <Route path="financeiro" element={<Financeiro />} />
        {(profile?.nivel_acesso === 'gerente' || profile?.nivel_acesso === 'admin') && (
          <Route path="colaboradores" element={<Colaboradores />} />
        )}
        <Route path="perfil" element={<MeuPerfil />} />
        {profile?.nivel_acesso === 'admin' && (
          <Route path="configuracoes" element={<SystemSettings />} />
        )}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

export default UnidadePortal;
