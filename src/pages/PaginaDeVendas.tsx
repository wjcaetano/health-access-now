
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import HeaderVendas from "@/components/vendas/HeaderVendas";
import Hero from "@/components/vendas/Hero";
import Sobre from "@/components/vendas/Sobre";
import ServicosPrincipais from "@/components/vendas/ServicosPrincipais";
import Depoimentos from "@/components/vendas/Depoimentos";
import CallToAction from "@/components/vendas/CallToAction";
import Login from "./auth/Login";

interface PaginaDeVendasProps {
  mostrarLogin?: boolean;
}

const PaginaDeVendas = ({ mostrarLogin }: PaginaDeVendasProps) => {
  const navigate = useNavigate();

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

  return (
    <div className="bg-white">
      <HeaderVendas />
      <main className="flex flex-col gap-12 pt-4">
        <Hero />
        <Sobre />
        <ServicosPrincipais />
        <Depoimentos />
        <CallToAction />
        {mostrarLogin && (
          <section id="login" className="py-16 bg-agendaja-light flex justify-center">
            <div className="w-full max-w-2xl">
              <h2 className="text-3xl font-bold text-center mb-6 text-agendaja-primary">
                Acesso ao Sistema AGENDAJA
              </h2>
              <Login />
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
export default PaginaDeVendas;
