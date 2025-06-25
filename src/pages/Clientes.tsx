
import React from "react";
import FormularioCliente from "@/components/clientes/FormularioCliente";
import ListaClientes from "@/components/clientes/ListaClientes";

const Clientes = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in max-w-7xl">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Gestão de Clientes</h2>
        <p className="text-gray-500 text-sm md:text-base">
          Cadastre e gerencie os clientes do sistema
        </p>
      </div>

      <div className="space-y-6">
        <FormularioCliente />
        <ListaClientes />
      </div>
    </div>
  );
};

export default Clientes;
