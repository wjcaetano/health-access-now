
import { useState } from 'react';

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
  const [showLoginModal, setShowLoginModal] = useState(false);

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
        <DialogContent className="max-w-md w-full mx-4 p-0 bg-transparent border-none shadow-none overflow-hidden">
          <Login />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaginaDeVendas;
