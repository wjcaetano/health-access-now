import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import HeaderVendas from "@/components/vendas/HeaderVendas";
import Hero from "@/components/vendas/Hero";
import ComoFunciona from "@/components/vendas/ComoFunciona";
import Sobre from "@/components/vendas/Sobre";
import ServicosPrincipais from "@/components/vendas/ServicosPrincipais";
import Depoimentos from "@/components/vendas/Depoimentos";
import CallToAction from "@/components/vendas/CallToAction";
import Login from "./auth/Login";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PaginaDeVendasProps {
  mostrarLogin?: boolean;
}

const PaginaDeVendas = ({ mostrarLogin }: PaginaDeVendasProps) => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("agendaja_authenticated") === "true";
    if (isAuthenticated) {
        const userType = localStorage.getItem("agendaja_user_type");
        if (userType === 'prestador') {
            navigate('/prestador');
        } else {
            navigate('/dashboard');
        }
    }
  }, [navigate]);

  // função que será passada para o Header para abrir o modal
  const handleAbrirLogin = () => {
    setShowLoginModal(true);
  };

  const handleFecharLogin = () => {
    setShowLoginModal(false);
  };

  return (
    <div className="bg-white">
      <HeaderVendas onAbrirLogin={handleAbrirLogin} />
      <main className="flex flex-col">
        <Hero />
        <ComoFunciona />
        <Sobre />
        <ServicosPrincipais />
        <Depoimentos />
        <CallToAction />
      </main>
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="max-w-md p-0 bg-transparent shadow-none border-none">
          <div className="bg-white rounded-lg shadow-lg p-0">
            <button
              aria-label="Fechar"
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-lg"
              onClick={handleFecharLogin}
            >×</button>
            <Login />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default PaginaDeVendas;
