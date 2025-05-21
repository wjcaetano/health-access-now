
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Search, FileText, Users, Calendar as CalendarIcon } from "lucide-react";
import { ContaPagar, ContaReceber, Prestador, Cliente } from "@/types";

// Dados fictícios para demonstração
const contasPagar: ContaPagar[] = [
  {
    id: "pag-001",
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
    valor: 1250.00,
    dataPagamento: new Date(2023, 5, 20),
    status: "agendado",
    guias: ["guia-001", "guia-002", "guia-003"],
    createdAt: new Date(2023, 5, 10)
  },
  {
    id: "pag-002",
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
    valor: 980.50,
    dataPagamento: new Date(2023, 5, 15),
    status: "pago",
    guias: ["guia-004", "guia-005"],
    createdAt: new Date(2023, 5, 5)
  },
  {
    id: "pag-003",
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
    valor: 780.00,
    dataPagamento: new Date(2023, 5, 22),
    status: "cancelado",
    guias: ["guia-006"],
    createdAt: new Date(2023, 5, 8)
  }
];

const contasReceber: ContaReceber[] = [
  {
    id: "rec-001",
    clienteId: "client-001",
    cliente: {
      id: "client-001",
      nome: "João Silva",
      cpf: "123.456.789-00",
      telefone: "(11) 98765-4321",
      email: "joao.silva@exemplo.com",
      endereco: "Rua das Flores, 123",
      dataCadastro: new Date(2023, 2, 10),
      idAssociado: "AG12345"
    },
    valor: 260.00,
    tipoPagamento: "pix",
    status: "pago",
    guias: ["guia-001"],
    dataPagamento: new Date(2023, 5, 12),
    createdAt: new Date(2023, 5, 10)
  },
  {
    id: "rec-002",
    clienteId: "client-002",
    cliente: {
      id: "client-002",
      nome: "Maria Santos",
      cpf: "987.654.321-00",
      telefone: "(11) 91234-5678",
      email: "maria.santos@exemplo.com",
      endereco: "Avenida Paulista, 1000",
      dataCadastro: new Date(2023, 1, 15),
      idAssociado: "AG67890"
    },
    valor: 150.00,
    tipoPagamento: "cartao",
    status: "pendente",
    guias: ["guia-002"],
    createdAt: new Date(2023, 5, 11)
  },
  {
    id: "rec-003",
    clienteId: "client-003",
    cliente: {
      id: "client-003",
      nome: "Pedro Costa",
      cpf: "456.789.123-00",
      telefone: "(11) 95555-7777",
      email: "pedro.costa@exemplo.com",
      endereco: "Rua Augusta, 500",
      dataCadastro: new Date(2023, 0, 5),
      idAssociado: "AG54321"
    },
    valor: 450.00,
    tipoPagamento: "boleto",
    status: "cancelado",
    guias: ["guia-003", "guia-004"],
    createdAt: new Date(2023, 5, 9)
  }
];

const statusPagamentoMap = {
  agendado: {
    label: "Agendado",
    color: "bg-blue-100 hover:bg-blue-100 text-blue-800"
  },
  pago: {
    label: "Pago",
    color: "bg-green-100 hover:bg-green-100 text-green-800"
  },
  cancelado: {
    label: "Cancelado",
    color: "bg-red-100 hover:bg-red-100 text-red-800"
  }
};

const statusRecebimentoMap = {
  pendente: {
    label: "Pendente",
    color: "bg-yellow-100 hover:bg-yellow-100 text-yellow-800"
  },
  pago: {
    label: "Pago",
    color: "bg-green-100 hover:bg-green-100 text-green-800"
  },
  cancelado: {
    label: "Cancelado",
    color: "bg-red-100 hover:bg-red-100 text-red-800"
  }
};

const tipoPagamentoMap = {
  pix: {
    label: "PIX",
    color: "bg-purple-100 hover:bg-purple-100 text-purple-800"
  },
  cartao: {
    label: "Cartão",
    color: "bg-blue-100 hover:bg-blue-100 text-blue-800"
  },
  dinheiro: {
    label: "Dinheiro",
    color: "bg-green-100 hover:bg-green-100 text-green-800"
  },
  boleto: {
    label: "Boleto",
    color: "bg-gray-100 hover:bg-gray-100 text-gray-800"
  }
};

const Financeiro: React.FC = () => {
  const [searchTermPagar, setSearchTermPagar] = useState("");
  const [statusFiltroPagar, setStatusFiltroPagar] = useState("todos");
  const [dateRangePagar, setDateRangePagar] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  const [searchTermReceber, setSearchTermReceber] = useState("");
  const [statusFiltroReceber, setStatusFiltroReceber] = useState("todos");
  const [dateRangeReceber, setDateRangeReceber] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  // Formatação de valores monetários
  const formatMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };
  
  // Filtrar contas a pagar
  const contasPagarFiltradas = contasPagar.filter((conta) => {
    const matchBusca = !searchTermPagar || 
      conta.prestador?.nome.toLowerCase().includes(searchTermPagar.toLowerCase());
    
    const matchStatus = statusFiltroPagar === "todos" || conta.status === statusFiltroPagar;
    
    const matchData = !dateRangePagar?.from || !dateRangePagar?.to || 
      (conta.dataPagamento >= dateRangePagar.from && 
       conta.dataPagamento <= dateRangePagar.to);
    
    return matchBusca && matchStatus && matchData;
  });
  
  // Filtrar contas a receber
  const contasReceberFiltradas = contasReceber.filter((conta) => {
    const matchBusca = !searchTermReceber || 
      conta.cliente?.nome.toLowerCase().includes(searchTermReceber.toLowerCase());
    
    const matchStatus = statusFiltroReceber === "todos" || conta.status === statusFiltroReceber;
    
    const dataRecebimento = conta.dataPagamento || conta.createdAt;
    const matchData = !dateRangeReceber?.from || !dateRangeReceber?.to || 
      (dataRecebimento >= dateRangeReceber.from && 
       dataRecebimento <= dateRangeReceber.to);
    
    return matchBusca && matchStatus && matchData;
  });
  
  // Calcular totais
  const totalPagar = contasPagarFiltradas.reduce((acc, conta) => acc + conta.valor, 0);
  const totalReceber = contasReceberFiltradas.reduce((acc, conta) => acc + conta.valor, 0);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Financeiro</h2>
        <p className="text-gray-500 mt-1">
          Gerencie os pagamentos a prestadores e recebimentos de clientes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-1">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Total a Pagar</CardTitle>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                {contasPagarFiltradas.length} contas
              </Badge>
            </div>
            <CardDescription>Pagamentos agendados para prestadores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between pt-4">
              <p className="text-2xl font-bold">{formatMoeda(totalPagar)}</p>
              <Button className="bg-agendaja-primary hover:bg-agendaja-secondary">
                Gerenciar Pagamentos
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Total a Receber</CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                {contasReceberFiltradas.length} contas
              </Badge>
            </div>
            <CardDescription>Recebimentos de clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between pt-4">
              <p className="text-2xl font-bold">{formatMoeda(totalReceber)}</p>
              <Button className="bg-agendaja-primary hover:bg-agendaja-secondary">
                Registrar Pagamento
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pagar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pagar">Contas a Pagar</TabsTrigger>
          <TabsTrigger value="receber">Contas a Receber</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pagar" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Contas a Pagar</CardTitle>
                  <CardDescription>
                    Pagamentos para prestadores de serviços
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={statusFiltroPagar} onValueChange={setStatusFiltroPagar}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Status</SelectItem>
                      <SelectItem value="agendado">Agendados</SelectItem>
                      <SelectItem value="pago">Pagos</SelectItem>
                      <SelectItem value="cancelado">Cancelados</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Buscar prestador..."
                      className="pl-8 w-full"
                      value={searchTermPagar}
                      onChange={(e) => setSearchTermPagar(e.target.value)}
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
                      <TableHead>Prestador</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data de Pagamento</TableHead>
                      <TableHead>Guias</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contasPagarFiltradas.map((conta) => (
                      <TableRow key={conta.id}>
                        <TableCell className="font-medium">
                          {conta.prestador?.nome}
                        </TableCell>
                        <TableCell>{formatMoeda(conta.valor)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            {format(conta.dataPagamento, "dd/MM/yyyy")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {conta.guias.length} guias
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusPagamentoMap[conta.status].color}>
                            {statusPagamentoMap[conta.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="text-agendaja-primary hover:text-agendaja-primary/80 hover:bg-agendaja-light/50">
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {contasPagarFiltradas.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <FileText className="h-8 w-8 mb-2" />
                            <p>Nenhuma conta a pagar encontrada</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="receber" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Contas a Receber</CardTitle>
                  <CardDescription>
                    Recebimentos de clientes
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={statusFiltroReceber} onValueChange={setStatusFiltroReceber}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Status</SelectItem>
                      <SelectItem value="pendente">Pendentes</SelectItem>
                      <SelectItem value="pago">Pagos</SelectItem>
                      <SelectItem value="cancelado">Cancelados</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Buscar cliente..."
                      className="pl-8 w-full"
                      value={searchTermReceber}
                      onChange={(e) => setSearchTermReceber(e.target.value)}
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
                      <TableHead>Cliente</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Forma Pagamento</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contasReceberFiltradas.map((conta) => (
                      <TableRow key={conta.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary mr-2">
                              <Users className="h-4 w-4" />
                            </div>
                            {conta.cliente?.nome}
                          </div>
                        </TableCell>
                        <TableCell>{formatMoeda(conta.valor)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={tipoPagamentoMap[conta.tipoPagamento].color}>
                            {tipoPagamentoMap[conta.tipoPagamento].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                            {conta.dataPagamento 
                              ? format(conta.dataPagamento, "dd/MM/yyyy")
                              : format(conta.createdAt, "dd/MM/yyyy")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusRecebimentoMap[conta.status].color}>
                            {statusRecebimentoMap[conta.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="text-agendaja-primary hover:text-agendaja-primary/80 hover:bg-agendaja-light/50">
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {contasReceberFiltradas.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <FileText className="h-8 w-8 mb-2" />
                            <p>Nenhuma conta a receber encontrada</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Financeiro;
