import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plus,
  Search,
  User,
  ShoppingCart,
  FileText,
  Check,
  X
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { clientes } from "@/data/mock";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Exemplo de dados de serviços
const tiposServicos = [
  { id: "1", nome: "Consulta Dermatologista", valor: 200.0 },
  { id: "2", nome: "Consulta Cardiologista", valor: 250.0 },
  { id: "3", nome: "Exame de Sangue", valor: 120.0 },
  { id: "4", nome: "Ultrassonografia", valor: 180.0 },
  { id: "5", nome: "Raio-X", valor: 150.0 },
];

// Exemplo de prestadores
const prestadores = [
  { id: "1", nome: "Dr. Carlos Silva", servicos: ["1", "2"] },
  { id: "2", nome: "Dra. Ana Oliveira", servicos: ["1"] },
  { id: "3", nome: "Dr. Marcelo Santos", servicos: ["2"] },
  { id: "4", nome: "Laboratório Central", servicos: ["3"] },
  { id: "5", nome: "Centro de Imagem", servicos: ["4", "5"] },
];

// Tipos para os dados
interface ServicoCarrinho {
  id: string;
  nome: string;
  valor: number;
  prestador: string;
  data: Date;
  horario: string;
}

const Vendas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [servicoDialogAberto, setServicoDialogAberto] = useState(false);
  const [carrinho, setCarrinho] = useState<ServicoCarrinho[]>([]);
  const [novoServico, setNovoServico] = useState<Partial<ServicoCarrinho>>({});
  const [dataAgendamento, setDataAgendamento] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const navigate = useNavigate();

  // Filtrar clientes com base no termo de busca
  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpf.includes(searchTerm) ||
    cliente.telefone.includes(searchTerm)
  );

  // Funções de gerenciamento de serviços
  const abrirDialogServico = () => {
    if (!clienteSelecionado) {
      toast({
        title: "Selecione um cliente",
        description: "É necessário selecionar um cliente antes de adicionar serviços.",
        variant: "destructive"
      });
      return;
    }
    setNovoServico({});
    setServicoDialogAberto(true);
  };

  const fecharDialogServico = () => {
    setServicoDialogAberto(false);
  };

  const selecionarServico = (id: string) => {
    const servico = tiposServicos.find(s => s.id === id);
    if (servico) {
      setNovoServico({
        ...novoServico,
        id: servico.id,
        nome: servico.nome,
        valor: servico.valor
      });
    }
  };

  const selecionarPrestador = (id: string) => {
    const prestador = prestadores.find(p => p.id === id);
    if (prestador) {
      setNovoServico({
        ...novoServico,
        prestador: prestador.nome
      });
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  const adicionarServico = () => {
    if (!novoServico.id || !novoServico.prestador || !dataAgendamento || !novoServico.horario) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos para adicionar o serviço.",
        variant: "destructive"
      });
      return;
    }

    const servicoCompleto = {
      id: novoServico.id!,
      nome: novoServico.nome!,
      valor: novoServico.valor!,
      prestador: novoServico.prestador!,
      data: dataAgendamento,
      horario: novoServico.horario!
    };

    setCarrinho([...carrinho, servicoCompleto]);
    toast({
      title: "Serviço adicionado",
      description: `${servicoCompleto.nome} foi adicionado ao carrinho.`
    });
    fecharDialogServico();
  };

  const removerServico = (index: number) => {
    const novoCarrinho = [...carrinho];
    novoCarrinho.splice(index, 1);
    setCarrinho(novoCarrinho);
    toast({
      title: "Serviço removido",
      description: "O serviço foi removido do carrinho."
    });
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, servico) => total + servico.valor, 0);
  };

  const finalizarVenda = () => {
    if (carrinho.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione serviços antes de finalizar a venda.",
        variant: "destructive"
      });
      return;
    }

    // Preparar dados da venda para o checkout
    const dadosVenda = {
      cliente: clienteSelecionado,
      servicos: carrinho,
      total: calcularTotal()
    };

    // Salvar no localStorage como backup
    localStorage.setItem('checkout_venda', JSON.stringify(dadosVenda));

    toast({
      title: "Redirecionando para checkout",
      description: `Processando venda para ${clienteSelecionado.nome}.`
    });
    
    // Redirecionar para o checkout de vendas
    navigate("/checkout-vendas", { 
      state: { vendaData: dadosVenda }
    });
  };

  const gerarOrcamento = () => {
    if (carrinho.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione serviços antes de gerar um orçamento.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Orçamento gerado",
      description: `Orçamento para ${clienteSelecionado.nome} gerado com sucesso!`
    });
  };

  const prestadoresDisponiveis = novoServico.id 
    ? prestadores.filter(p => p.servicos.includes(novoServico.id)) 
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Vendas</h2>
          <p className="text-gray-500 mt-1">
            Gerenciamento de vendas e serviços
          </p>
        </div>
        <Link to="/novo-cliente">
          <Button className="bg-agendaja-primary hover:bg-agendaja-secondary">
            <Plus className="h-5 w-5 mr-2" />
            Novo Cliente
          </Button>
        </Link>
      </div>

      {/* Seleção de cliente */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Selecione o Cliente</CardTitle>
              <CardDescription>
                {clienteSelecionado ? `Cliente: ${clienteSelecionado.nome}` : "Busque e selecione um cliente para iniciar a venda"}
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar cliente por nome, CPF ou telefone..."
                className="pl-8 w-full md:w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!!clienteSelecionado}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!clienteSelecionado ? (
            <div className="space-y-2 max-h-60 overflow-auto">
              {clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((cliente) => (
                  <Card key={cliente.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setClienteSelecionado(cliente)}>
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary mr-3">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{cliente.nome}</h3>
                          <p className="text-sm text-gray-500">{cliente.telefone} | CPF: {cliente.cpf}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Selecionar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">Nenhum cliente encontrado</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary mr-4">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{clienteSelecionado.nome}</h3>
                    <p className="text-gray-500">{clienteSelecionado.telefone} | CPF: {clienteSelecionado.cpf}</p>
                    <p className="text-gray-500 text-sm">{clienteSelecionado.email}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setClienteSelecionado(null)}
                  className="text-gray-500"
                >
                  <X className="h-4 w-4 mr-1" />
                  Trocar Cliente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Carrinho de serviços */}
      {clienteSelecionado && (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Carrinho de Serviços</CardTitle>
                <CardDescription>
                  {carrinho.length > 0 
                    ? `${carrinho.length} serviço(s) adicionado(s)` 
                    : "Adicione serviços ao carrinho"}
                </CardDescription>
              </div>
              <Button onClick={abrirDialogServico} className="bg-agendaja-primary hover:bg-agendaja-secondary">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Serviço
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {carrinho.length === 0 ? (
              <div className="text-center py-10">
                <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">O carrinho está vazio</p>
                <p className="text-sm text-gray-400">Adicione serviços para prosseguir com a venda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {carrinho.map((servico, index) => (
                  <Card key={index} className="overflow-hidden border-l-4 border-l-agendaja-primary">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <div className="p-4 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <h4 className="font-medium">{servico.nome}</h4>
                            <p className="text-sm text-gray-500">Prestador: {servico.prestador}</p>
                          </div>
                          <div className="font-medium text-agendaja-primary">
                            {formatarMoeda(servico.valor)}
                          </div>
                        </div>
                        
                        <div className="mt-3 flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1 text-gray-500">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{format(servico.data, "dd/MM/yyyy", { locale: ptBR })}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>{servico.horario}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 flex justify-end sm:w-32">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removerServico(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remover</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
          {carrinho.length > 0 && (
            <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t p-4 bg-gray-50">
              <div className="mb-4 sm:mb-0">
                <p className="text-gray-500">Total:</p>
                <p className="text-xl font-bold text-agendaja-primary">{formatarMoeda(calcularTotal())}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={gerarOrcamento} className="flex gap-1">
                  <FileText className="h-4 w-4" />
                  <span>Gerar Orçamento</span>
                </Button>
                <Button onClick={finalizarVenda} className="bg-agendaja-primary hover:bg-agendaja-secondary flex gap-1">
                  <Check className="h-4 w-4" />
                  <span>Finalizar Venda</span>
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      )}

      {/* Dialog para adicionar serviço */}
      <Dialog open={servicoDialogAberto} onOpenChange={setServicoDialogAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Serviço</DialogTitle>
            <DialogDescription>
              Selecione o serviço, prestador, data e horário.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Serviço</label>
              <Select onValueChange={selecionarServico}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {tiposServicos.map((servico) => (
                      <SelectItem key={servico.id} value={servico.id}>
                        {servico.nome} - {formatarMoeda(servico.valor)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Prestador</label>
              <Select onValueChange={selecionarPrestador} disabled={!novoServico.id}>
                <SelectTrigger>
                  <SelectValue placeholder={novoServico.id ? "Selecione o prestador" : "Primeiro selecione um serviço"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {prestadoresDisponiveis.map((prestador) => (
                      <SelectItem key={prestador.id} value={prestador.id}>
                        {prestador.nome}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataAgendamento ? (
                        format(dataAgendamento, "dd/MM/yyyy")
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dataAgendamento}
                      onSelect={setDataAgendamento}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Horário</label>
                <Select onValueChange={horario => setNovoServico({ ...novoServico, horario })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o horário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="08:00">08:00</SelectItem>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="11:00">11:00</SelectItem>
                      <SelectItem value="14:00">14:00</SelectItem>
                      <SelectItem value="15:00">15:00</SelectItem>
                      <SelectItem value="16:00">16:00</SelectItem>
                      <SelectItem value="17:00">17:00</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={fecharDialogServico}>
              Cancelar
            </Button>
            <Button onClick={adicionarServico} className="bg-agendaja-primary hover:bg-agendaja-secondary">
              Adicionar ao Carrinho
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vendas;
