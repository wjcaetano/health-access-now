
import React from "react";
import FormularioCliente from "@/components/clientes/FormularioCliente";
import ListaClientes from "@/components/clientes/ListaClientes";

const Clientes = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Gestão de Clientes</h2>
        <p className="text-gray-500 mt-1">
          Cadastre e gerencie os clientes do sistema
        </p>
      </div>

      <FormularioCliente />
      <ListaClientes />
    </div>
  );
};

export default Clientes;
