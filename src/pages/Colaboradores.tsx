
import React from "react";
import CadastroColaborador from "@/components/colaboradores/CadastroColaborador";
import PontoEletronicoPainel from "@/components/colaboradores/PontoEletronicoPainel";

const ColaboradoresPage = () => (
  <div className="py-10 px-2 max-w-2xl mx-auto">
    <h1 className="text-3xl font-bold mb-6 text-center">Gestão de Colaboradores</h1>
    <CadastroColaborador />
    <PontoEletronicoPainel />
  </div>
);

export default ColaboradoresPage;
