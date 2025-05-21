
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Search, Phone, Mail, Calendar, Plus, MoreHorizontal } from "lucide-react";
import { Prestador } from "@/types";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Dados simulados de prestadores
const prestadoresMock: Prestador[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `prest-${i + 1}`,
  nome: [
    "Clínica Saúde Plena", 
    "Laboratório Diagnósticos",
    "Centro Médico Avançado",
    "Consultório Dr. Roberto",
    "Dra. Ana Oliveira",
    "Hospital Santa Clara",
    "Centro de Imagem Diagnóstica",
    "Clínica Dentária Sorriso",
    "Dr. Marcelo Santos",
    "Instituto Cardio"
  ][i],
  tipo: i < 3 ? "clinica" : i < 6 ? "laboratorio" : "profissional",
  especialidades: [
    ["Clínico Geral", "Dermatologia"],
    ["Análises Clínicas", "Patologia"],
    ["Radiologia", "Ultrassonografia"],
    ["Cardiologia"],
    ["Pediatria"],
    ["Múltiplas Especialidades"],
    ["Radiologia", "Tomografia", "Ressonância"],
    ["Odontologia"],
    ["Ortopedia"],
    ["Cardiologia", "Exames Cardíacos"]
  ][i],
  cnpj: `${Math.floor(10000000 + Math.random() * 90000000)}0001${Math.floor(10 + Math.random() * 90)}`,
  endereco: "Rua Exemplo, 123 - Bairro - Cidade/UF",
  telefone: `(${Math.floor(10 + Math.random() * 90)}) ${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(1000 + Math.random() * 9000)}`,
  email: `contato@${["saudeplena", "labdiag", "centromedico", "droberto", "draoliveira", "hospitalsc", "centrodiag", "clinicasorriso", "drmarcelo", "instcardio"][i]}.com.br`,
  contaBancaria: {
    banco: ["Itaú", "Bradesco", "Santander", "Banco do Brasil"][Math.floor(Math.random() * 4)],
    agencia: `${Math.floor(1000 + Math.random() * 9000)}`,
    conta: `${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(1 + Math.random() * 9)}`,
    tipoConta: Math.random() > 0.5 ? "corrente" : "poupanca"
  },
  comissao: Math.floor(10 + Math.random() * 20),
  dataCadastro: new Date(2025, Math.floor(Math.random() * 5), Math.floor(1 + Math.random() * 28)),
  ativo: Math.random() > 0.2
}));

const tipoMap: Record<string, { label: string; color: string }> = {
  clinica: {
    label: "Clínica",
    color: "bg-blue-100 hover:bg-blue-100 text-blue-800"
  },
  laboratorio: {
    label: "Laboratório",
    color: "bg-purple-100 hover:bg-purple-100 text-purple-800"
  },
  profissional: {
    label: "Profissional",
    color: "bg-green-100 hover:bg-green-100 text-green-800"
  }
};

const Prestadores: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Filtrar prestadores
  const prestadoresFiltrados = prestadoresMock.filter((prestador) => {
    const matchesSearch = 
      prestador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestador.cnpj.includes(searchTerm) ||
      prestador.telefone.includes(searchTerm) ||
      prestador.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = tipoFilter === "all" || prestador.tipo === tipoFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && prestador.ativo) || 
      (statusFilter === "inactive" && !prestador.ativo);
    
    return matchesSearch && matchesTipo && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Prestadores</h2>
          <p className="text-gray-500 mt-1">
            Gerencie todos os prestadores de serviço parceiros da AGENDAJA
          </p>
        </div>
        <Button 
          className="bg-agendaja-primary hover:bg-agendaja-secondary flex items-center gap-1"
          onClick={() => navigate("/novo-prestador")}
        >
          <Plus className="h-4 w-4" />
          Novo Prestador
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle>Lista de Prestadores</CardTitle>
              <CardDescription>
                {prestadoresFiltrados.length} prestadores cadastrados
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar prestadores..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={tipoFilter}
                  onValueChange={setTipoFilter}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="clinica">Clínicas</SelectItem>
                    <SelectItem value="laboratorio">Laboratórios</SelectItem>
                    <SelectItem value="profissional">Profissionais</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Comissão</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prestadoresFiltrados.map((prestador) => (
                  <TableRow key={prestador.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{prestador.nome}</p>
                        <p className="text-xs text-gray-500">
                          {prestador.especialidades?.join(", ")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={tipoMap[prestador.tipo].color}>
                        {tipoMap[prestador.tipo].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                          <span>{prestador.telefone}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                          <span>{prestador.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{prestador.comissao}%</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                        <span>{format(prestador.dataCadastro, "dd/MM/yyyy")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={prestador.ativo 
                          ? "bg-green-100 hover:bg-green-100 text-green-800" 
                          : "bg-red-100 hover:bg-red-100 text-red-800"}
                      >
                        {prestador.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Visualizar</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Serviços</DropdownMenuItem>
                          <DropdownMenuItem>
                            {prestador.ativo ? "Desativar" : "Ativar"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                
                {prestadoresFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum prestador encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Prestadores;
