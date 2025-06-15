
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Clientes Cadastrados ({clientesFiltrados.length})</span>
          <div className="relative w-72">
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
      <CardContent>
        <div className="grid gap-4">
          {clientesFiltrados.map((cliente) => (
            <div
              key={cliente.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{cliente.nome}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {cliente.cpf}
                    </span>
                    <span className="flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {cliente.telefone}
                    </span>
                    <span className="flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {cliente.email}
                    </span>
                  </div>
                  {cliente.endereco && (
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {cliente.endereco}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  ID: {cliente.id_associado}
                </Badge>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600">
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
