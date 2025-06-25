
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Mail, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  telefone?: string;
  email?: string;
  id_associado?: string;
  endereco?: string;
  data_cadastro: string;
}

interface ClienteEncontradoProps {
  cliente: Cliente;
  onConfirmar: () => void;
  onAlterar: () => void;
  onCancelar: () => void;
}

const ClienteEncontrado: React.FC<ClienteEncontradoProps> = ({
  cliente,
  onConfirmar,
  onAlterar,
  onCancelar
}) => {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-green-800">Cliente Encontrado</CardTitle>
        <CardDescription className="text-green-600">
          Verifique os dados do cliente abaixo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary mr-4">
                <User className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-gray-900 truncate">{cliente.nome}</h3>
                <p className="text-gray-500">ID: {cliente.id_associado}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600 min-w-0">
                <User className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="font-medium mr-2">CPF:</span>
                <span className="truncate">{cliente.cpf}</span>
              </div>
              
              <div className="flex items-center text-gray-600 min-w-0">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="font-medium mr-2">Telefone:</span>
                <span className="truncate">{cliente.telefone}</span>
              </div>
              
              <div className="flex items-start text-gray-600 min-w-0 lg:col-span-2">
                <Mail className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="font-medium mr-2">E-mail:</span>
                  <span className="break-words text-sm lg:text-base">{cliente.email}</span>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600 min-w-0 lg:col-span-2">
                <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="font-medium mr-2">Cadastro:</span>
                <span className="truncate">{format(new Date(cliente.data_cadastro), "dd/MM/yyyy", { locale: ptBR })}</span>
              </div>
              
              {cliente.endereco && (
                <div className="flex items-start text-gray-600 min-w-0 lg:col-span-2">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium mr-2">Endereço:</span>
                    <span className="break-words">{cliente.endereco}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={onConfirmar} 
              className="bg-green-600 hover:bg-green-700 flex-1"
            >
              Confirmar Cliente
            </Button>
            <Button 
              onClick={onAlterar} 
              variant="outline" 
              className="flex-1"
            >
              Alterar Dados
            </Button>
            <Button 
              onClick={onCancelar} 
              variant="outline" 
              className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClienteEncontrado;
