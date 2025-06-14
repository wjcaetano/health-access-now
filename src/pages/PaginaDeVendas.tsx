
import Hero from "@/components/vendas/Hero";
import Diferenciais from "@/components/vendas/Diferenciais";
import ComoFunciona from "@/components/vendas/ComoFunciona";
import ServicosPrincipais from "@/components/vendas/ServicosPrincipais";
import Depoimentos from "@/components/vendas/Depoimentos";
import CallToAction from "@/components/vendas/CallToAction";
import Login from "./auth/Login"; // Importar login

interface PaginaDeVendasProps {
  mostrarLogin?: boolean;
}

const PaginaDeVendas = ({ mostrarLogin }: PaginaDeVendasProps) => {
  return (
    <div className="flex flex-col gap-12 bg-white">
      <Hero />
      <Diferenciais />
      <ComoFunciona />
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
    </div>
  );
};
export default PaginaDeVendas;
