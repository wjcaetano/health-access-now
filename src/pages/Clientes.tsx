
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Cliente } from "@/types";
import { format } from "date-fns";
import { Plus, Search, User, Phone, Calendar } from "lucide-react";
import { clientes } from "@/data/mock";
import { Link } from "react-router-dom";

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filtrar clientes com base no termo de busca
  const clientesFiltrados = clientes.filter((cliente) => 
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpf.includes(searchTerm) ||
    cliente.telefone.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Clientes</h2>
          <p className="text-gray-500 mt-1">
            Gerencie todos os clientes cadastrados na plataforma
          </p>
        </div>
        <Link to="/novo-cliente">
          <Button className="bg-agendaja-primary hover:bg-agendaja-secondary">
            <Plus className="h-5 w-5 mr-2" />
            Novo Cliente
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>
                Total de {clientesFiltrados.length} clientes cadastrados
              </CardDescription>
            </div>
            <div className="w-full md:w-80">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por nome, CPF, telefone..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead>ID Associado</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientesFiltrados.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary mr-2">
                          <User className="h-4 w-4" />
                        </div>
                        {cliente.nome}
                      </div>
                    </TableCell>
                    <TableCell>{cliente.cpf}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm">
                          <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                          {cliente.telefone}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {cliente.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                        {format(cliente.dataCadastro, "dd/MM/yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-xs bg-gray-100 rounded px-2 py-1 inline-block">
                        {cliente.idAssociado}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-agendaja-primary hover:text-agendaja-primary/80 hover:bg-agendaja-light/50">
                        Visualizar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clientes;
