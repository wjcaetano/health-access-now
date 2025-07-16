import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// ... keep existing code (all imports)
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
import AdvancedDashboardPage from "@/pages/AdvancedDashboard";
import ReportsPage from "@/pages/ReportsPage";
import BackupPage from "@/pages/BackupPage";
import SystemSettings from "@/pages/SystemSettings";

// Franqueadora pages
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

export const AppRoutes: React.FC = () => {
  return (
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
      <Route path="/dashboard-avancado" element={<AdvancedDashboardPage />} />
      <Route path="/relatorios" element={<ReportsPage />} />
      <Route path="/backup" element={<BackupPage />} />
      <Route path="/configuracoes-sistema" element={<SystemSettings />} />
      
      {/* Franqueadora Routes */}
      <Route path="/franqueadora/dashboard" element={<DashboardFranqueadora />} />
      <Route path="/franqueadora/franquias" element={<GestaoFranquias />} />
      <Route path="/franqueadora/leads" element={<LeadsFranqueados />} />
      <Route path="/franqueadora/franqueados" element={<CRMFranqueados />} />
      <Route path="/franqueadora/financeiro" element={<FinanceiroMatriz />} />
      <Route path="/franqueadora/royalties" element={<GestaoRoyalties />} />
      <Route path="/franqueadora/contratos" element={<GestaoContratos />} />
      <Route path="/franqueadora/relatorios" element={<RelatoriosExecutivos />} />
      <Route path="/franqueadora/metas" element={<MetasKPIs />} />
      <Route path="/franqueadora/expansao" element={<ExpansaoFranquias />} />
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
