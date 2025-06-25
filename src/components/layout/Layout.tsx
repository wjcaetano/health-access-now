
import React, { useState, useEffect } from "react";
import { Outlet, useLocation, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

// Import all the pages for the nested routes
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
import CheckoutVendas from "@/pages/CheckoutVendas";
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
import NotFound from "@/pages/NotFound";

// Informações de páginas por rota
const pageInfo: { [key: string]: { title: string; subtitle?: string } } = {
  "/dashboard": { title: "Dashboard", subtitle: "Visão geral do sistema" },
  
  // Páginas originais
  "/clientes": { title: "Clientes", subtitle: "Gerenciamento de clientes" },
  "/vendas": { title: "Vendas", subtitle: "Gerenciamento de vendas" },
  "/checkout-vendas": { title: "Checkout de Vendas", subtitle: "Finalização do pagamento" },
  "/orcamentos": { title: "Orçamentos", subtitle: "Gerenciamento de orçamentos" },
  "/conversas": { title: "Conversas", subtitle: "Gerenciamento de mensagens" },
  "/novo-cliente": { title: "Novo Cliente", subtitle: "Cadastre um novo cliente" },
  "/novo-agendamento": { title: "Novo Agendamento", subtitle: "Cadastre um novo agendamento" },
  
  // Novas páginas
  "/prestadores": { title: "Prestadores", subtitle: "Gerenciamento de prestadores de serviço" },
  "/novo-prestador": { title: "Novo Prestador", subtitle: "Cadastre um novo prestador de serviço" },
  "/servicos": { title: "Serviços", subtitle: "Gerenciamento de serviços oferecidos" },
  "/novo-servico": { title: "Novo Serviço", subtitle: "Cadastre um novo serviço" },
  "/financeiro": { title: "Financeiro", subtitle: "Gestão financeira do sistema" },
  "/agenda-pagamentos": { title: "Agenda de Pagamentos", subtitle: "Calendário de pagamentos aos prestadores" },
  "/guias": { title: "Guias", subtitle: "Gerenciamento de guias de serviço" },
  "/configuracoes": { title: "Configurações", subtitle: "Ajustes do sistema" },
  "/colaboradores": { title: "Colaboradores", subtitle: "Gestão de colaboradores e ponto eletrônico" },
  
  // Páginas do prestador
  "/prestador": { title: "Portal do Prestador", subtitle: "Bem-vindo ao seu portal" },
  "/prestador/guias": { title: "Minhas Guias", subtitle: "Gerenciamento de guias recebidas" },
  "/prestador/faturamento": { title: "Faturamento", subtitle: "Solicitação de pagamentos" },
};

// Função para determinar o perfil atual com base na URL
const getProfileFromPath = (path: string) => {
  if (path.startsWith("/prestador")) {
    return "prestador";
  }
  return "agendaja";
};

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { isPrestador } = useAuth();
  
  const userProfile = isPrestador ? "prestador" : "agendaja";
  
  // Detectar se é uma página de visualização de orçamento
  const isOrcamentoView = location.pathname.startsWith("/orcamentos/");
  const defaultTitle = isOrcamentoView ? "Visualizar Orçamento" : "AGENDAJA";
  const defaultSubtitle = isOrcamentoView ? "Detalhes do orçamento selecionado" : 
    (userProfile === "prestador" ? "Portal do Prestador" : "Sistema de Agendamento");
  
  const { title, subtitle } = pageInfo[location.pathname] || { 
    title: defaultTitle, 
    subtitle: defaultSubtitle
  };

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} userProfile={userProfile} />
      <main 
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          !collapsed ? "sm:ml-20 md:ml-72" : ""
        }`}
      >
        <Header 
          title={title} 
          subtitle={subtitle} 
          toggleSidebar={toggleSidebar} 
        />
        <div className="flex-1 overflow-x-auto overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/novo-cliente" element={<NovoCliente />} />
            <Route path="/editar-cliente/:id" element={<NovoCliente />} />
            <Route path="/prestadores" element={<Prestadores />} />
            <Route path="/novo-prestador" element={<NovoPrestador />} />
            <Route path="/editar-prestador/:id" element={<NovoPrestador />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/novo-servico" element={<NovoServico />} />
            <Route path="/editar-servico/:id" element={<NovoServico />} />
            <Route path="/orcamentos" element={<Orcamentos />} />
            <Route path="/orcamento/:id" element={<VisualizarOrcamento />} />
            <Route path="/vendas" element={<Vendas />} />
            <Route path="/checkout-vendas" element={<CheckoutVendas />} />
            <Route path="/venda-finalizada" element={<VendaFinalizada />} />
            <Route path="/agendamentos" element={<Agendamentos />} />
            <Route path="/novo-agendamento" element={<NovoAgendamento />} />
            <Route path="/colaboradores" element={<Colaboradores />} />
            <Route path="/financeiro" element={<Financeiro />} />
            <Route path="/agenda-pagamentos" element={<AgendaPagamentos />} />
            <Route path="/guias" element={<Guias />} />
            <Route path="/conversas" element={<Conversas />} />
            <Route path="/gestao-usuarios" element={<GestaoUsuarios />} />
            <Route path="/meu-perfil" element={<MeuPerfil />} />
            <Route path="/analise-sistema" element={<AnaliseDoSistema />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
