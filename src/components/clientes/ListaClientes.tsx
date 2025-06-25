
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Phone, Mail, MapPin, Edit, Trash2 } from "lucide-react";
import { useClientes } from "@/hooks/useClientes";
import { useState } from "react";

export default function ListaClientes() {
  const { data: clientes, isLoading, error } = useClientes();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) return <div>Carregando clientes...</div>;
  if (error) return <div>Erro ao carregar clientes: {error.message}</div>;

  const clientesFiltrados = clientes?.filter((cliente) =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpf.includes(searchTerm) ||
    cliente.telefone.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span className="text-lg sm:text-xl">Clientes Cadastrados ({clientesFiltrados.length})</span>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por nome, CPF, telefone ou email..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto">
          {clientesFiltrados.map((cliente) => (
            <div
              key={cliente.id}
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 gap-4"
            >
              <div className="flex items-start lg:items-center space-x-4 min-w-0 flex-1">
                <div className="h-12 w-12 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary flex-shrink-0">
                  <User className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <h3 className="font-medium text-lg text-gray-900 truncate">{cliente.nome}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 text-sm text-gray-500 mt-1">
                    <span className="flex items-center min-w-0">
                      <User className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{cliente.cpf}</span>
                    </span>
                    <span className="flex items-center min-w-0">
                      <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{cliente.telefone}</span>
                    </span>
                    <span className="flex items-center min-w-0">
                      <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate" title={cliente.email}>{cliente.email}</span>
                    </span>
                    {cliente.endereco && (
                      <span className="flex items-center min-w-0">
                        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate" title={cliente.endereco}>{cliente.endereco}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end lg:justify-start space-x-2 flex-shrink-0">
                <Badge variant="outline" className="bg-green-50 text-green-700 whitespace-nowrap text-xs">
                  ID: {cliente.id_associado}
                </Badge>
                <Button variant="ghost" size="sm" className="flex-shrink-0 h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 flex-shrink-0 h-8 w-8 p-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {clientesFiltrados.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              {searchTerm ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
