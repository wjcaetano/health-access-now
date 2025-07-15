
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

// Pages
import Index from "@/pages/Index";
import Clientes from "@/pages/Clientes";
import NovoCliente from "@/pages/NovoCliente";
import Prestadores from "@/pages/Prestadores";
import NovoPrestador from "@/pages/NovoPrestador";
import Servicos from "@/pages/Servicos";
import NovoServico from "@/pages/NovoServico";
import Orcamentos from "@/pages/Orcamentos";
import VisualizarOrcamento from "@/pages/VisualizarOrcamento";
import Vendas from "@/pages/Vendas";
import VendaFinalizada from "@/pages/VendaFinalizada";
import Agendamentos from "@/pages/Agendamentos";
import NovoAgendamento from "@/pages/NovoAgendamento";
import Colaboradores from "@/pages/Colaboradores";
import Financeiro from "@/pages/Financeiro";
import AgendaPagamentos from "@/pages/AgendaPagamentos";
import Guias from "@/pages/Guias";
import Conversas from "@/pages/Conversas";
import GestaoUsuarios from "@/pages/GestaoUsuarios";
import MeuPerfil from "@/pages/MeuPerfil";
import AnaliseDoSistema from "@/pages/AnaliseDoSistema";

const Layout: React.FC = () => {
  const { loading, isActive, profile } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Determine user profile type
  const userProfile = profile?.prestador_id ? "prestador" : "agendaja";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="grid grid-cols-[250px_1fr] h-screen">
          <Skeleton className="h-full" />
          <div className="flex flex-col">
            <Skeleton className="h-16" />
            <div className="flex-1 p-6 space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Conta Inativa
          </h2>
          <p className="text-gray-600">
            Sua conta não está ativa. Entre em contato com o administrador.
          </p>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="grid grid-cols-[250px_1fr] h-screen">
          <Sidebar 
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            userProfile={userProfile}
          />
          <div className="flex flex-col overflow-hidden">
            <Header 
              title="Dashboard"
              toggleSidebar={toggleSidebar}
            />
            <main className="flex-1 overflow-y-auto p-6">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/clientes/novo" element={<NovoCliente />} />
                <Route path="/prestadores" element={<Prestadores />} />
                <Route path="/prestadores/novo" element={<NovoPrestador />} />
                <Route path="/servicos" element={<Servicos />} />
                <Route path="/servicos/novo" element={<NovoServico />} />
                <Route path="/orcamentos" element={<Orcamentos />} />
                <Route path="/orcamentos/:id" element={<VisualizarOrcamento />} />
                <Route path="/vendas" element={<Vendas />} />
                <Route path="/vendas/finalizada" element={<VendaFinalizada />} />
                <Route path="/agendamentos" element={<Agendamentos />} />
                <Route path="/agendamentos/novo" element={<NovoAgendamento />} />
                <Route path="/colaboradores" element={<Colaboradores />} />
                <Route path="/financeiro" element={<Financeiro />} />
                <Route path="/agenda-pagamentos" element={<AgendaPagamentos />} />
                <Route path="/guias" element={<Guias />} />
                <Route path="/conversas" element={<Conversas />} />
                <Route path="/gestao-usuarios" element={<GestaoUsuarios />} />
                <Route path="/meu-perfil" element={<MeuPerfil />} />
                <Route path="/analise-sistema" element={<AnaliseDoSistema />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Layout;
