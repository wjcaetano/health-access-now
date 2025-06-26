import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Phone, Mail, MapPin, Edit, Trash2 } from "lucide-react";
import { useClientes } from "@/hooks/useClientes";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ListaClientes() {
  const { data: clientes, isLoading, error } = useClientes();
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();

  if (isLoading) return <div className="p-4">Carregando clientes...</div>;
  if (error) return <div className="p-4 text-red-600">Erro ao carregar clientes: {error.message}</div>;

  const clientesFiltrados = clientes?.filter((cliente) =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpf.includes(searchTerm) ||
    cliente.telefone.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <Card className="w-full">
      <CardHeader className={isMobile ? "p-4" : "p-4 md:p-6"}>
        <CardTitle className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className={isMobile ? "text-lg" : "text-lg md:text-xl"}>
              Clientes Cadastrados ({clientesFiltrados.length})
            </span>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por nome, CPF, telefone ou email..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? "p-2" : "p-0"}>
        {isMobile ? (
          // Layout móvel com cards
          <div className="space-y-3">
            {clientesFiltrados.map((cliente) => (
              <div key={cliente.id} className="border rounded-lg p-4 bg-white">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary flex-shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-base text-gray-900 truncate">
                        {cliente.nome}
                      </h3>
                      <p className="text-sm text-gray-500">{cliente.cpf}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 text-xs shrink-0">
                      ID: {cliente.id_associado}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{cliente.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{cliente.email}</span>
                    </div>
                    {cliente.endereco && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{cliente.endereco}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end items-center gap-2 pt-2 border-t">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Layout desktop original
          <div className="max-h-[600px] overflow-y-auto">
            {clientesFiltrados.map((cliente) => (
              <div
                key={cliente.id}
                className="flex flex-col space-y-3 p-4 border-b last:border-b-0 hover:bg-gray-50"
              >
                <div className="flex items-start space-x-3">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary flex-shrink-0">
                    <User className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-base md:text-lg text-gray-900 truncate">
                      {cliente.nome}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-500 mt-1">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{cliente.cpf}</span>
                      </span>
                      <span className="flex items-center">
                        <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{cliente.telefone}</span>
                      </span>
                      <span className="flex items-center sm:col-span-2">
                        <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate" title={cliente.email}>{cliente.email}</span>
                      </span>
                      {cliente.endereco && (
                        <span className="flex items-center sm:col-span-2">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate" title={cliente.endereco}>{cliente.endereco}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                    ID: {cliente.id_associado}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {clientesFiltrados.length === 0 && (
          <div className="text-center text-gray-500 py-8 px-4">
            {searchTerm ? "Nenhum cliente encontrado com os critérios de busca" : "Nenhum cliente cadastrado ainda"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
