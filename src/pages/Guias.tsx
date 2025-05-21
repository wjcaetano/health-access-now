
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Calendar, Download, User, Eye } from "lucide-react";
import { Guia } from "@/types";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

// Dados simulados de guias
const guiasMock: Guia[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `guia-${i + 1}`,
  agendamentoId: `agend-${i + 1}`,
  prestadorId: `prestador-${Math.floor(Math.random() * 5) + 1}`,
  prestador: {
    id: `prestador-${Math.floor(Math.random() * 5) + 1}`,
    nome: ["Clínica Saúde Plena", "Laboratório Diagnósticos", "Centro Médico Avançado", "Consultório Dr. Roberto", "Hospital Santa Clara"][Math.floor(Math.random() * 5)],
    tipo: ["clinica", "laboratorio", "profissional"][Math.floor(Math.random() * 3)] as any,
    cnpj: "12345678000199",
    endereco: "Rua Exemplo, 123",
    telefone: "(11) 98765-4321",
    email: "contato@exemplo.com",
    contaBancaria: {
      banco: "Banco",
      agencia: "1234",
      conta: "12345-6",
      tipoConta: "corrente"
    },
    comissao: 10,
    dataCadastro: new Date(),
    ativo: true
  },
  clienteId: `cliente-${Math.floor(Math.random() * 10) + 1}`,
  cliente: {
    id: `cliente-${Math.floor(Math.random() * 10) + 1}`,
    nome: `Cliente ${Math.floor(Math.random() * 10) + 1}`,
    cpf: "123.456.789-00",
    telefone: "(11) 98765-4321",
    email: "cliente@exemplo.com",
    endereco: "Rua Exemplo, 123",
    dataCadastro: new Date(),
    idAssociado: `ASS${Math.floor(10000 + Math.random() * 90000)}`
  },
  servico: ["Consulta Cardiologista", "Exame de Sangue", "Raio-X", "Ultrassonografia", "Consulta Dermatologista", "Endoscopia"][Math.floor(Math.random() * 6)],
  valor: Math.floor(15000 + Math.random() * 50000),
  codigoAutenticacao: `AG${Math.floor(100000 + Math.random() * 900000)}`,
  status: ["emitida", "realizada", "faturada", "paga"][Math.floor(Math.random() * 4)] as any,
  dataEmissao: new Date(2025, Math.floor(Math.random() * 3), Math.floor(1 + Math.random() * 28)),
  dataRealizacao: Math.random() > 0.3 ? new Date() : undefined,
  dataFaturamento: Math.random() > 0.6 ? new Date() : undefined,
  dataPagamento: Math.random() > 0.8 ? new Date() : undefined
}));

// Ordenar por data de emissão (mais recentes primeiro)
guiasMock.sort((a, b) => b.dataEmissao.getTime() - a.dataEmissao.getTime());

const statusMap: Record<string, { label: string; color: string }> = {
  emitida: {
    label: "Emitida",
    color: "bg-yellow-100 hover:bg-yellow-100 text-yellow-800"
  },
  realizada: {
    label: "Realizada",
    color: "bg-blue-100 hover:bg-blue-100 text-blue-800"
  },
  faturada: {
    label: "Faturada",
    color: "bg-green-100 hover:bg-green-100 text-green-800"
  },
  paga: {
    label: "Paga",
    color: "bg-gray-100 hover:bg-gray-100 text-gray-800"
  }
};

const Guias: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("todas");
  
  // Estatísticas
  const totalEmitidas = guiasMock.filter(g => g.status === "emitida").length;
  const totalRealizadas = guiasMock.filter(g => g.status === "realizada").length;
  const totalFaturadas = guiasMock.filter(g => g.status === "faturada").length;
  const totalPagas = guiasMock.filter(g => g.status === "paga").length;
  
  // Filtrar guias
  const guiasFiltradas = guiasMock.filter(guia => {
    const matchesSearch = 
      guia.servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guia.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guia.prestador?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guia.codigoAutenticacao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || guia.status === statusFilter;
    
    const matchesTab = 
      activeTab === "todas" || 
      (activeTab === "emitidas" && guia.status === "emitida") ||
      (activeTab === "realizadas" && guia.status === "realizada") ||
      (activeTab === "faturadas" && guia.status === "faturada") ||
      (activeTab === "pagas" && guia.status === "paga");
    
    return matchesSearch && matchesStatus && matchesTab;
  });
  
  // Formatar valor em reais
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor / 100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Guias</h2>
          <p className="text-gray-500 mt-1">
            Gerencie todas as guias de serviço emitidas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={`border-l-4 ${activeTab === "emitidas" ? "border-l-yellow-500" : "border-l-transparent"}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Emitidas</p>
              <Badge variant="outline" className="bg-yellow-100 hover:bg-yellow-100 text-yellow-800">
                {totalEmitidas}
              </Badge>
            </div>
            <p className="text-2xl font-bold mt-2">
              {formatarValor(guiasMock.filter(g => g.status === "emitida").reduce((acc, g) => acc + g.valor, 0))}
            </p>
          </CardContent>
        </Card>
        
        <Card className={`border-l-4 ${activeTab === "realizadas" ? "border-l-blue-500" : "border-l-transparent"}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Realizadas</p>
              <Badge variant="outline" className="bg-blue-100 hover:bg-blue-100 text-blue-800">
                {totalRealizadas}
              </Badge>
            </div>
            <p className="text-2xl font-bold mt-2">
              {formatarValor(guiasMock.filter(g => g.status === "realizada").reduce((acc, g) => acc + g.valor, 0))}
            </p>
          </CardContent>
        </Card>
        
        <Card className={`border-l-4 ${activeTab === "faturadas" ? "border-l-green-500" : "border-l-transparent"}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Faturadas</p>
              <Badge variant="outline" className="bg-green-100 hover:bg-green-100 text-green-800">
                {totalFaturadas}
              </Badge>
            </div>
            <p className="text-2xl font-bold mt-2">
              {formatarValor(guiasMock.filter(g => g.status === "faturada").reduce((acc, g) => acc + g.valor, 0))}
            </p>
          </CardContent>
        </Card>
        
        <Card className={`border-l-4 ${activeTab === "pagas" ? "border-l-gray-500" : "border-l-transparent"}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Pagas</p>
              <Badge variant="outline" className="bg-gray-100 hover:bg-gray-100 text-gray-800">
                {totalPagas}
              </Badge>
            </div>
            <p className="text-2xl font-bold mt-2">
              {formatarValor(guiasMock.filter(g => g.status === "paga").reduce((acc, g) => acc + g.valor, 0))}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full md:w-auto"
            >
              <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-5">
                <TabsTrigger value="todas">Todas</TabsTrigger>
                <TabsTrigger value="emitidas">Emitidas</TabsTrigger>
                <TabsTrigger value="realizadas" className="hidden md:inline-flex">Realizadas</TabsTrigger>
                <TabsTrigger value="faturadas" className="hidden md:inline-flex">Faturadas</TabsTrigger>
                <TabsTrigger value="pagas" className="hidden md:inline-flex">Pagas</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar guias..."
                  className="pl-8 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="emitida">Emitidas</SelectItem>
                  <SelectItem value="realizada">Realizadas</SelectItem>
                  <SelectItem value="faturada">Faturadas</SelectItem>
                  <SelectItem value="paga">Pagas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Prestador</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guiasFiltradas.map((guia) => (
                  <TableRow key={guia.id}>
                    <TableCell className="font-mono text-sm">
                      {guia.codigoAutenticacao}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary mr-2">
                          <User className="h-4 w-4" />
                        </div>
                        <span>{guia.cliente?.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell>{guia.prestador?.nome}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {guia.servico}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatarValor(guia.valor)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                        <div className="flex flex-col">
                          <span>{format(guia.dataEmissao, "dd/MM/yyyy")}</span>
                          {guia.status !== "emitida" && (
                            <span className="text-xs text-gray-500">
                              {guia.status === "paga" 
                                ? `Paga: ${guia.dataPagamento ? format(guia.dataPagamento, "dd/MM") : "N/A"}`
                                : guia.status === "faturada" 
                                  ? `Faturada: ${guia.dataFaturamento ? format(guia.dataFaturamento, "dd/MM") : "N/A"}`
                                  : `Realizada: ${guia.dataRealizacao ? format(guia.dataRealizacao, "dd/MM") : "N/A"}`
                              }
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={statusMap[guia.status].color}
                      >
                        {statusMap[guia.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-agendaja-primary hover:text-agendaja-primary/80 hover:bg-agendaja-light/50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Visualizar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {guiasFiltradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Nenhuma guia encontrada.
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

export default Guias;
