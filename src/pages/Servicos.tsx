
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Calendar, 
  User, 
  FileText,
  Clipboard,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Servico, Prestador } from "@/types";

// Dados fictícios para demonstração
const servicos: Servico[] = [
  {
    id: "serv-001",
    nome: "Consulta Cardiologista",
    categoria: "Consulta",
    prestadorId: "prest-001",
    prestador: {
      id: "prest-001",
      nome: "Clínica CardioSaúde",
      tipo: "clinica",
      cnpj: "12.345.678/0001-90",
      endereco: "Rua das Palmeiras, 123 - Centro",
      telefone: "(11) 99999-8888",
      email: "contato@cardiosaude.com",
      contaBancaria: {
        banco: "Banco do Brasil",
        agencia: "1234",
        conta: "56789-0",
        tipoConta: "corrente"
      },
      comissao: 15,
      dataCadastro: new Date(2023, 1, 15),
      ativo: true
    },
    valorCusto: 180.00,
    valorVenda: 220.00,
    descricao: "Consulta com especialista cardiologista",
    tempoEstimado: "30 minutos",
    ativo: true
  },
  {
    id: "serv-002",
    nome: "Hemograma Completo",
    categoria: "Exame",
    prestadorId: "prest-002",
    prestador: {
      id: "prest-002",
      nome: "Laboratório Análises Clínicas",
      tipo: "laboratorio",
      cnpj: "98.765.432/0001-10",
      endereco: "Avenida Brasil, 500 - Jardim América",
      telefone: "(11) 3333-4444",
      email: "lab@analisesclinicas.com",
      contaBancaria: {
        banco: "Itaú",
        agencia: "5678",
        conta: "12345-6",
        tipoConta: "corrente"
      },
      comissao: 12,
      dataCadastro: new Date(2022, 11, 7),
      ativo: true
    },
    valorCusto: 45.00,
    valorVenda: 60.00,
    descricao: "Exame de sangue completo",
    tempoEstimado: "15 minutos",
    ativo: true
  },
  {
    id: "serv-003",
    nome: "Consulta Dermatologista",
    categoria: "Consulta",
    prestadorId: "prest-003",
    prestador: {
      id: "prest-003",
      nome: "Dra. Ana Silva",
      tipo: "profissional",
      especialidades: ["Dermatologia", "Dermatologia Estética"],
      cnpj: "76.543.210/0001-54",
      endereco: "Rua Flores, 29 - Jardim Paulista",
      telefone: "(11) 97777-6666",
      email: "dra.anasilva@dermaclinica.com",
      contaBancaria: {
        banco: "Santander",
        agencia: "9876",
        conta: "54321-0",
        tipoConta: "poupanca"
      },
      comissao: 10,
      dataCadastro: new Date(2023, 3, 22),
      ativo: true
    },
    valorCusto: 200.00,
    valorVenda: 260.00,
    descricao: "Consulta com dermatologista especializada",
    tempoEstimado: "45 minutos",
    ativo: true
  },
  {
    id: "serv-004",
    nome: "Raio-X de Tórax",
    categoria: "Exame",
    prestadorId: "prest-002",
    prestador: {
      id: "prest-002",
      nome: "Laboratório Análises Clínicas",
      tipo: "laboratorio",
      cnpj: "98.765.432/0001-10",
      endereco: "Avenida Brasil, 500 - Jardim América",
      telefone: "(11) 3333-4444",
      email: "lab@analisesclinicas.com",
      contaBancaria: {
        banco: "Itaú",
        agencia: "5678",
        conta: "12345-6",
        tipoConta: "corrente"
      },
      comissao: 12,
      dataCadastro: new Date(2022, 11, 7),
      ativo: true
    },
    valorCusto: 120.00,
    valorVenda: 150.00,
    descricao: "Radiografia frontal e lateral de tórax",
    tempoEstimado: "20 minutos",
    ativo: false
  }
];

const Servicos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [prestadorFiltro, setPrestadorFiltro] = useState("todos");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  
  // Extrair prestadores únicos para o filtro
  const prestadores = Array.from(new Set(servicos.map(s => s.prestadorId)))
    .map(id => servicos.find(s => s.prestadorId === id)?.prestador)
    .filter((p): p is Prestador => p !== undefined);
  
  // Extrair categorias únicas para o filtro
  const categorias = Array.from(new Set(servicos.map(s => s.categoria)));
  
  // Aplicar filtros
  const servicosFiltrados = servicos.filter(servico => {
    const matchBusca = 
      !searchTerm || 
      servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servico.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servico.prestador?.nome.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchCategoria = categoriaFiltro === "todas" || servico.categoria === categoriaFiltro;
    const matchPrestador = prestadorFiltro === "todos" || servico.prestadorId === prestadorFiltro;
    const matchStatus = statusFiltro === "todos" || 
      (statusFiltro === "ativo" && servico.ativo) || 
      (statusFiltro === "inativo" && !servico.ativo);
    
    return matchBusca && matchCategoria && matchPrestador && matchStatus;
  });

  const formatMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Serviços</h2>
          <p className="text-gray-500 mt-1">
            Gerencie todos os serviços oferecidos na plataforma
          </p>
        </div>
        <Link to="/novo-servico">
          <Button className="bg-agendaja-primary hover:bg-agendaja-secondary">
            <Plus className="h-5 w-5 mr-2" />
            Novo Serviço
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Lista de Serviços</CardTitle>
              <CardDescription>
                Total de {servicosFiltrados.length} serviços cadastrados
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={prestadorFiltro} onValueChange={setPrestadorFiltro}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Prestador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {prestadores.map((prestador) => (
                    <SelectItem key={prestador.id} value={prestador.id}>{prestador.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFiltro} onValueChange={setStatusFiltro}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="inativo">Inativos</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar serviços..."
                  className="pl-8 w-full"
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
                  <TableHead>Nome do Serviço</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Prestador</TableHead>
                  <TableHead>Valor de Custo</TableHead>
                  <TableHead>Valor de Venda</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servicosFiltrados.map((servico) => (
                  <TableRow key={servico.id}>
                    <TableCell className="font-medium">{servico.nome}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-100 hover:bg-gray-100">
                        {servico.categoria}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary mr-2">
                          {servico.prestador?.tipo === 'profissional' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Clipboard className="h-4 w-4" />
                          )}
                        </div>
                        {servico.prestador?.nome}
                      </div>
                    </TableCell>
                    <TableCell>{formatMoeda(servico.valorCusto)}</TableCell>
                    <TableCell>{formatMoeda(servico.valorVenda)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        servico.ativo 
                          ? "bg-green-100 text-green-800 hover:bg-green-100" 
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      }>
                        {servico.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-agendaja-primary hover:text-agendaja-primary/80 hover:bg-agendaja-light/50">
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {servicosFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FileText className="h-8 w-8 mb-2" />
                        <p>Nenhum serviço encontrado</p>
                      </div>
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

export default Servicos;
