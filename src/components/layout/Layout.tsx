
import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

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
  // Por padrão, assume o perfil de usuário AGENDAJA
  return "agendaja";
};

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState("agendaja"); // Pode ser "agendaja" ou "prestador"
  
  useEffect(() => {
    // Atualiza o perfil com base na URL atual
    const profile = getProfileFromPath(location.pathname);
    setUserProfile(profile);
    
    // Simulação de verificação de autenticação
    const isAuthenticated = localStorage.getItem("agendaja_authenticated") === "true";
    if (!isAuthenticated) {
      // Se não estiver autenticado, redireciona para a página inicial (vendas/login)
      navigate("/");
    }
  }, [location, navigate]);
  
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
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
