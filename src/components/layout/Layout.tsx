
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "@/contexts/AuthContext";

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

// Prestador pages
import Portal from "@/pages/prestador/Portal";
import Faturamento from "@/pages/prestador/Faturamento";
import GuiasPrestador from "@/pages/prestador/Guias";

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { profile } = useAuth();
  
  // Determinar o perfil do usuário baseado no contexto de autenticação
  // Como nivel_acesso pode ser 'colaborador' | 'atendente' | 'gerente' | 'admin', 
  // vamos usar 'agendaja' como perfil padrão
  const userProfile = 'agendaja';
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50 w-full">
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        userProfile={userProfile} 
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header 
          title="Dashboard" 
          toggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-3 md:p-6">
          <div className="max-w-full">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/clientes/novo" element={<NovoCliente />} />
              <Route path="/prestadores" element={<Prestadores />} />
              <Route path="/prestadores/novo" element={<NovoPrestador />} />
              <Route path="/prestadores/editar/:id" element={<NovoPrestador />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/servicos/novo" element={<NovoServico />} />
              <Route path="/orcamentos" element={<Orcamentos />} />
              <Route path="/orcamentos/:id" element={<VisualizarOrcamento />} />
              <Route path="/vendas" element={<Vendas />} />
              <Route path="/checkout-vendas" element={<CheckoutVendas />} />
              <Route path="/venda-finalizada" element={<VendaFinalizada />} />
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
              
              {/* Prestador routes - corrigidas para usar /dashboard/prestador */}
              <Route path="/prestador" element={<Portal />} />
              <Route path="/prestador/faturamento" element={<Faturamento />} />
              <Route path="/prestador/guias" element={<GuiasPrestador />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
