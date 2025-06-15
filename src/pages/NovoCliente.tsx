
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import FormularioCliente from "@/components/clientes/FormularioCliente";

const NovoCliente = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/clientes")}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Novo Cliente</h2>
          <p className="text-gray-500 mt-1">
            Cadastre um novo cliente no sistema
          </p>
        </div>
      </div>

      <FormularioCliente />
    </div>
  );
};

export default NovoCliente;
