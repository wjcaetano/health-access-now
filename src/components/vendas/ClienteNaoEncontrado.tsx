
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, UserPlus } from "lucide-react";

interface ClienteNaoEncontradoProps {
  termoBusca: string;
  onCadastrarNovo: () => void;
}

const ClienteNaoEncontrado: React.FC<ClienteNaoEncontradoProps> = ({
  termoBusca,
  onCadastrarNovo
}) => {
  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardContent className="pt-6">
        <div className="text-center">
          <User className="h-12 w-12 mx-auto text-amber-500 mb-4" />
          <h3 className="text-lg font-medium text-amber-800 mb-2">
            Cliente não encontrado
          </h3>
          <p className="text-amber-600 mb-4">
            Não foi possível encontrar um cliente com o termo "{termoBusca}"
          </p>
          <Button onClick={onCadastrarNovo} className="bg-agendaja-primary hover:bg-agendaja-secondary">
            <UserPlus className="h-4 w-4 mr-2" />
            Cadastrar Novo Cliente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClienteNaoEncontrado;
