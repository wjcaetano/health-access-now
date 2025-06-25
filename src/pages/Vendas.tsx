import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  UserPlus,
  Save,
  X,
  ShoppingCart,
  Eye
} from "lucide-react";
import { useClientes } from "@/hooks/useClientes";
import { useCreateOrcamento } from "@/hooks/useOrcamentos";
import { useOrcamentosPorCliente, useCancelarOrcamento } from "@/hooks/useOrcamentos";
import { useCreateVenda, useVendas } from "@/hooks/useVendas";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import BuscaServicos from "@/components/vendas/BuscaServicos";
import ListaServicos from "@/components/vendas/ListaServicos";
import CheckoutVenda from "@/components/vendas/CheckoutVenda";
import OrcamentosPendentes from "@/components/vendas/OrcamentosPendentes";
import ListaVendas from "@/components/vendas/ListaVendas";
import { Tables } from "@/integrations/supabase/types";

type EstadoVenda = 'inicial' | 'nao_encontrado' | 'cliente_selecionado' | 'cadastro_servicos' | 'checkout';

interface ServicoSelecionado {
  id: string;
  nome: string;
  categoria: string;
  prestadorId: string;
  prestadorNome: string;
  valorVenda: number;
  descricao?: string;
}

type OrcamentoPendente = Tables<"orcamentos"> & {
  servicos?: {
    nome: string;
    categoria: string;
  };
  prestadores?: {
    nome: string;
  };
};

const Vendas: React.FC = () => {
  const [termoBusca, setTermoBusca] = useState("");
  const [estadoAtual, setEstadoAtual] = useState<EstadoVenda>('inicial');
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [servicosSelecionados, setServicosSelecionados] = useState<ServicoSelecionado[]>([]);
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState<OrcamentoPendente | null>(null);
  
  const { data: clientes } = useClientes();
  const { data: orcamentosPendentes } = useOrcamentosPorCliente(clienteSelecionado?.id);
  const { data: vendas, isLoading: isLoadingVendas } = useVendas();
  const { mutate: criarOrcamento } = useCreateOrcamento();
  const { mutate: criarVenda, isPending: isCreatingVenda } = useCreateVenda();
  const { mutate: cancelarOrcamento, isPending: isCancelingOrcamento } = useCancelarOrcamento();
  const navigate = useNavigate();
  const { toast } = useToast();

  const buscarCliente = () => {
    if (!termoBusca.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Digite o CPF ou nome do cliente para buscar.",
        variant: "destructive"
      });
      return;
    }

    const clienteEncontrado = clientes?.find((cliente) =>
      cliente.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      cliente.cpf.includes(termoBusca)
    );

    if (clienteEncontrado) {
      setClienteSelecionado(clienteEncontrado);
      setEstadoAtual('cliente_selecionado');
    } else {
      setClienteSelecionado(null);
      setEstadoAtual('nao_encontrado');
    }
  };

  const confirmarCliente = () => {
    setEstadoAtual('cadastro_servicos');
    toast({
      title: "Cliente selecionado",
      description: `${clienteSelecionado.nome} foi selecionado para venda.`
    });
  };

  const alterarCliente = () => {
    navigate(`/editar-cliente/${clienteSelecionado.id}`);
  };

  const cancelarOperacao = () => {
    setTermoBusca("");
    setClienteSelecionado(null);
    setServicosSelecionados([]);
    setOrcamentoSelecionado(null);
    setEstadoAtual('inicial');
  };

  const irParaCadastro = () => {
    navigate("/novo-cliente");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      buscarCliente();
    }
  };

  const adicionarServico = (servico: ServicoSelecionado) => {
    setServicosSelecionados(prev => [...prev, servico]);
    toast({
      title: "Serviço adicionado",
      description: `${servico.nome} foi adicionado à lista.`
    });
  };

  const removerServico = (index: number) => {
    setServicosSelecionados(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Serviço removido",
      description: "Serviço foi removido da lista."
    });
  };

  const limparListaServicos = () => {
    setServicosSelecionados([]);
    toast({
      title: "Lista limpa",
      description: "Todos os serviços foram removidos da lista."
    });
  };

  const irParaCheckout = () => {
    if (servicosSelecionados.length === 0) {
      toast({
        title: "Nenhum serviço selecionado",
        description: "Adicione pelo menos um serviço para prosseguir.",
        variant: "destructive"
      });
      return;
    }
    setEstadoAtual('checkout');
  };

  const voltarDoCheckout = () => {
    setOrcamentoSelecionado(null);
    setEstadoAtual('cadastro_servicos');
  };

  const concluirVenda = (metodoPagamento: string, observacoes?: string) => {
    let valorTotal: number;
    let servicosVenda: any[];

    if (orcamentoSelecionado) {
      // Venda a partir de orçamento
      valorTotal = orcamentoSelecionado.valor_final;
      servicosVenda = [{
        servico_id: orcamentoSelecionado.servico_id!,
        prestador_id: orcamentoSelecionado.prestador_id!,
        valor: orcamentoSelecionado.valor_final
      }];
    } else {
      // Venda normal
      valorTotal = servicosSelecionados.reduce((total, servico) => total + servico.valorVenda, 0);
      servicosVenda = servicosSelecionados.map(servico => ({
        servico_id: servico.id,
        prestador_id: servico.prestadorId,
        valor: servico.valorVenda
      }));
    }
    
    const novaVenda = {
      cliente_id: clienteSelecionado.id,
      valor_total: valorTotal,
      metodo_pagamento: metodoPagamento,
      status: 'concluida',
      observacoes
    };

    criarVenda({ venda: novaVenda, servicos: servicosVenda }, {
      onSuccess: () => {
        toast({
          title: "Venda concluída",
          description: "A venda foi realizada com sucesso!"
        });
        cancelarOperacao();
      },
      onError: (error) => {
        toast({
          title: "Erro ao concluir venda",
          description: "Ocorreu um erro ao processar a venda.",
          variant: "destructive"
        });
        console.error('Erro ao criar venda:', error);
      }
    });
  };

  const salvarOrcamento = () => {
    if (servicosSelecionados.length === 0) {
      toast({
        title: "Nenhum serviço selecionado",
        description: "Adicione pelo menos um serviço para salvar o orçamento.",
        variant: "destructive"
      });
      return;
    }

    const valorTotal = servicosSelecionados.reduce((total, servico) => total + servico.valorVenda, 0);
    const primeiroServico = servicosSelecionados[0];
    
    // Definir data de validade para 7 dias a partir de hoje
    const dataValidade = new Date();
    dataValidade.setDate(dataValidade.getDate() + 7);
    
    criarOrcamento({
      cliente_id: clienteSelecionado.id,
      servico_id: primeiroServico.id,
      prestador_id: primeiroServico.prestadorId,
      valor_custo: primeiroServico.valorVenda * 0.7,
      valor_venda: primeiroServico.valorVenda,
      valor_final: valorTotal,
      percentual_desconto: 0,
      status: 'pendente',
      data_validade: dataValidade.toISOString().split('T')[0],
      observacoes: `Orçamento com ${servicosSelecionados.length} serviço(s): ${servicosSelecionados.map(s => s.nome).join(', ')}`
    }, {
      onSuccess: () => {
        toast({
          title: "Orçamento salvo",
          description: "O orçamento foi salvo com sucesso e é válido por 7 dias!"
        });
        cancelarOperacao();
      },
      onError: (error) => {
        toast({
          title: "Erro ao salvar",
          description: "Ocorreu um erro ao salvar o orçamento.",
          variant: "destructive"
        });
        console.error('Erro ao salvar orçamento:', error);
      }
    });
  };

  const concluirVendaDoOrcamento = (orcamento: OrcamentoPendente) => {
    setOrcamentoSelecionado(orcamento);
    setEstadoAtual('checkout');
  };

  const handleCancelarOrcamento = (orcamentoId: string) => {
    console.log('Tentativa de cancelar orçamento:', orcamentoId);
    
    if (!orcamentoId) {
      toast({
        title: "Erro",
        description: "ID do orçamento não encontrado.",
        variant: "destructive"
      });
      return;
    }

    cancelarOrcamento(orcamentoId, {
      onSuccess: () => {
        console.log('Orçamento cancelado com sucesso');
        toast({
          title: "Orçamento cancelado",
          description: "O orçamento foi cancelado com sucesso."
        });
      },
      onError: (error) => {
        console.error('Erro ao cancelar orçamento:', error);
        toast({
          title: "Erro ao cancelar",
          description: "Ocorreu um erro ao cancelar o orçamento.",
          variant: "destructive"
        });
      }
    });
  };

  // Estado checkout
  if (estadoAtual === 'checkout') {
    let servicosParaCheckout: ServicoSelecionado[] = [];
    
    if (orcamentoSelecionado) {
      // Checkout a partir de orçamento
      servicosParaCheckout = [{
        id: orcamentoSelecionado.servico_id!,
        nome: orcamentoSelecionado.servicos?.nome || "Serviço",
        categoria: orcamentoSelecionado.servicos?.categoria || "Categoria",
        prestadorId: orcamentoSelecionado.prestador_id!,
        prestadorNome: orcamentoSelecionado.prestadores?.nome || "Prestador",
        valorVenda: orcamentoSelecionado.valor_final,
        descricao: orcamentoSelecionado.observacoes || undefined
      }];
    } else {
      // Checkout normal
      servicosParaCheckout = servicosSelecionados;
    }

    return (
      <div className="space-y-6 animate-fade-in">
        <CheckoutVenda
          servicos={servicosParaCheckout}
          cliente={clienteSelecionado}
          onVoltar={voltarDoCheckout}
          onConcluirVenda={concluirVenda}
          isLoading={isCreatingVenda}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Vendas</h2>
        <p className="text-gray-500 mt-1">
          Gerencie vendas, orçamentos e visualize o histórico de transações
        </p>
      </div>

      <Tabs defaultValue="nova-venda" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nova-venda" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Nova Venda
          </TabsTrigger>
          <TabsTrigger value="historico" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Histórico de Vendas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nova-venda" className="space-y-6">
          {/* Todo o conteúdo existente da página de vendas vai aqui */}
          
          {/* Formulário de Busca - Sempre visível */}
          <Card>
            <CardHeader>
              <CardTitle>Buscar Cliente</CardTitle>
              <CardDescription>
                Digite o CPF ou nome do cliente para buscar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Digite o CPF ou nome do cliente..."
                    className="pl-8"
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={estadoAtual === 'cadastro_servicos'}
                  />
                </div>
                <Button 
                  onClick={buscarCliente} 
                  className="bg-agendaja-primary hover:bg-agendaja-secondary"
                  disabled={estadoAtual === 'cadastro_servicos'}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Estado: Cliente não encontrado */}
          {estadoAtual === 'nao_encontrado' && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <User className="h-12 w-12 mx-auto text-amber-500 mb-4" />
                  <h3 className="text-lg font-medium text-amber-800 mb-2">
                    Cliente não encontrado
                  </h3>
                  <p className="text-amber-600 mb-4">
                    Não foi possível encontrar um cliente com o termo "{termoBusca}"
                  </p>
                  <Button onClick={irParaCadastro} className="bg-agendaja-primary hover:bg-agendaja-secondary">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Cadastrar Novo Cliente
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Estado: Cliente selecionado - Com layout melhorado */}
          {estadoAtual === 'cliente_selecionado' && clienteSelecionado && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Cliente Encontrado</CardTitle>
                <CardDescription className="text-green-600">
                  Verifique os dados do cliente abaixo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Dados do Cliente com layout responsivo melhorado */}
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary mr-4">
                        <User className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-gray-900 truncate">{clienteSelecionado.nome}</h3>
                        <p className="text-gray-500">ID: {clienteSelecionado.id_associado}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-600 min-w-0">
                        <User className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="font-medium mr-2">CPF:</span>
                        <span className="truncate">{clienteSelecionado.cpf}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 min-w-0">
                        <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="font-medium mr-2">Telefone:</span>
                        <span className="truncate">{clienteSelecionado.telefone}</span>
                      </div>
                      
                      <div className="flex items-start text-gray-600 min-w-0 lg:col-span-2">
                        <Mail className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="font-medium mr-2">E-mail:</span>
                          <span className="break-words text-sm lg:text-base">{clienteSelecionado.email}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600 min-w-0 lg:col-span-2">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="font-medium mr-2">Cadastro:</span>
                        <span className="truncate">{format(new Date(clienteSelecionado.data_cadastro), "dd/MM/yyyy", { locale: ptBR })}</span>
                      </div>
                      
                      {clienteSelecionado.endereco && (
                        <div className="flex items-start text-gray-600 min-w-0 lg:col-span-2">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <span className="font-medium mr-2">Endereço:</span>
                            <span className="break-words">{clienteSelecionado.endereco}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button 
                      onClick={confirmarCliente} 
                      className="bg-green-600 hover:bg-green-700 flex-1"
                    >
                      Confirmar Cliente
                    </Button>
                    <Button 
                      onClick={alterarCliente} 
                      variant="outline" 
                      className="flex-1"
                    >
                      Alterar Dados
                    </Button>
                    <Button 
                      onClick={cancelarOperacao} 
                      variant="outline" 
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Estado: Cadastro de Serviços */}
          {estadoAtual === 'cadastro_servicos' && (
            <div className="space-y-6">
              {/* Informações do Cliente Selecionado */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-800">{clienteSelecionado?.nome}</h3>
                      <p className="text-blue-600">CPF: {clienteSelecionado?.cpf}</p>
                    </div>
                    <Button
                      onClick={cancelarOperacao}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Orçamentos Pendentes */}
              {orcamentosPendentes && orcamentosPendentes.length > 0 && (
                <OrcamentosPendentes
                  orcamentos={orcamentosPendentes}
                  onConcluirVenda={concluirVendaDoOrcamento}
                  onCancelar={handleCancelarOrcamento}
                  isLoading={isCreatingVenda || isCancelingOrcamento}
                />
              )}

              {/* Busca e Seleção de Serviços */}
              <BuscaServicos onServicoSelecionado={adicionarServico} />

              {/* Lista de Serviços Selecionados */}
              <ListaServicos
                servicos={servicosSelecionados}
                onRemoverServico={removerServico}
                onLimparLista={limparListaServicos}
              />

              {/* Botões de Ação Final */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={irParaCheckout}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={servicosSelecionados.length === 0}
                    >
                      Concluir Venda
                    </Button>
                    <Button
                      onClick={salvarOrcamento}
                      variant="outline"
                      className="flex-1"
                      disabled={servicosSelecionados.length === 0}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Orçamento (7 dias)
                    </Button>
                    <Button
                      onClick={cancelarOperacao}
                      variant="outline"
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="historico" className="space-y-6">
          {isLoadingVendas ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agendaja-primary mx-auto"></div>
                  <p className="text-gray-500 mt-2">Carregando vendas...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <ListaVendas vendas={vendas || []} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Vendas;
