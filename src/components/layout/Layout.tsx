
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useLocation } from "react-router-dom";

const pageInfo: { [key: string]: { title: string; subtitle?: string } } = {
  "/": { title: "Dashboard", subtitle: "Visão geral do sistema" },
  "/clientes": { title: "Clientes", subtitle: "Gerenciamento de clientes" },
  "/agendamentos": { title: "Agendamentos", subtitle: "Gerenciamento de agendamentos" },
  "/orcamentos": { title: "Orçamentos", subtitle: "Gerenciamento de orçamentos" },
  "/conversas": { title: "Conversas", subtitle: "Gerenciamento de mensagens" },
  "/novo-cliente": { title: "Novo Cliente", subtitle: "Cadastre um novo cliente" },
  "/novo-agendamento": { title: "Novo Agendamento", subtitle: "Cadastre um novo agendamento" },
};

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const { title, subtitle } = pageInfo[location.pathname] || { 
    title: "AGENDAJA", 
    subtitle: "Sistema de Agendamento" 
  };

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} subtitle={subtitle} toggleSidebar={toggleSidebar} />
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
