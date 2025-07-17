
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

interface Cliente {
  id: string;
  nome: string;
  cpf: string;
}

interface ClienteSelecionadoProps {
  cliente: Cliente;
  onCancelar: () => void;
}

const ClienteSelecionado: React.FC<ClienteSelecionadoProps> = ({
  cliente,
  onCancelar
}) => {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-800">{cliente.nome}</h3>
            <p className="text-blue-600">CPF: {cliente.cpf}</p>
          </div>
          <Button
            onClick={onCancelar}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClienteSelecionado;
