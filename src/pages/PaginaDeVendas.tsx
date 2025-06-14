
import Hero from "@/components/vendas/Hero";
import Diferenciais from "@/components/vendas/Diferenciais";
import ComoFunciona from "@/components/vendas/ComoFunciona";
import ServicosPrincipais from "@/components/vendas/ServicosPrincipais";
import Depoimentos from "@/components/vendas/Depoimentos";
import CallToAction from "@/components/vendas/CallToAction";

const PaginaDeVendas = () => {
  return (
    <div className="flex flex-col gap-12 bg-white">
      <Hero />
      <Diferenciais />
      <ComoFunciona />
      <ServicosPrincipais />
      <Depoimentos />
      <CallToAction />
    </div>
  );
};

export default PaginaDeVendas;
