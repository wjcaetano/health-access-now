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
import { 
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  UserPlus,
  Save,
  X
} from "lucide-react";
import { useClientes } from "@/hooks/useClientes";
import { useCreateOrcamento } from "@/hooks/useOrcamentos";
import { useOrcamentosPorCliente, useCancelarOrcamento } from "@/hooks/useOrcamentos";
import { useCreateVenda } from "@/hooks/useVendas";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import BuscaServicos from "@/components/vendas/BuscaServicos";
import ListaServicos from "@/components/vendas/ListaServicos";
import CheckoutVenda from "@/components/vendas/CheckoutVenda";
import OrcamentosPendentes from "@/components/vendas/OrcamentosPendentes";
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
  
  const { data: clientes } = useClientes();
  const { data: orcamentosPendentes } = useOrcamentosPorCliente(clienteSelecionado?.id);
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
    setEstadoAtual('cadastro_servicos');
  };

  const concluirVenda = (metodoPagamento: string, observacoes?: string) => {
    const valorTotal = servicosSelecionados.reduce((total, servico) => total + servico.valorVenda, 0);
    
    const novaVenda = {
      cliente_id: clienteSelecionado.id,
      valor_total: valorTotal,
      metodo_pagamento: metodoPagamento,
      status: 'concluida',
      observacoes
    };

    const servicosVenda = servicosSelecionados.map(servico => ({
      servico_id: servico.id,
      prestador_id: servico.prestadorId,
      valor: servico.valorVenda
    }));

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
    
    criarOrcamento({
      cliente_id: clienteSelecionado.id,
      servico_id: primeiroServico.id,
      prestador_id: primeiroServico.prestadorId,
      valor_custo: primeiroServico.valorVenda * 0.7,
      valor_venda: primeiroServico.valorVenda,
      valor_final: valorTotal,
      percentual_desconto: 0,
      status: 'pendente',
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
    if (!orcamento.servicos) {
      toast({
        title: "Erro",
        description: "Dados do serviço não encontrados.",
        variant: "destructive"
      });
      return;
    }

    const novaVenda = {
      cliente_id: clienteSelecionado.id,
      valor_total: orcamento.valor_final,
      metodo_pagamento: 'pix', // Padrão, pode ser alterado no checkout
      status: 'concluida'
    };

    const servicosVenda = [{
      servico_id: orcamento.servico_id!,
      prestador_id: orcamento.prestador_id!,
      valor: orcamento.valor_final
    }];

    criarVenda({ venda: novaVenda, servicos: servicosVenda }, {
      onSuccess: () => {
        toast({
          title: "Venda concluída",
          description: "A venda foi realizada com sucesso a partir do orçamento!"
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

  const handleCancelarOrcamento = (orcamentoId: string) => {
    cancelarOrcamento(orcamentoId, {
      onSuccess: () => {
        toast({
          title: "Orçamento cancelado",
          description: "O orçamento foi cancelado com sucesso."
        });
      },
      onError: (error) => {
        toast({
          title: "Erro ao cancelar",
          description: "Ocorreu um erro ao cancelar o orçamento.",
          variant: "destructive"
        });
        console.error('Erro ao cancelar orçamento:', error);
      }
    });
  };

  // Estado checkout
  if (estadoAtual === 'checkout') {
    return (
      <div className="space-y-6 animate-fade-in">
        <CheckoutVenda
          servicos={servicosSelecionados}
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
          {estadoAtual === 'cadastro_servicos' 
            ? `Cadastrando serviços para ${clienteSelecionado?.nome}`
            : "Busque um cliente para iniciar uma venda"
          }
        </p>
      </div>

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

      {/* Estado: Cliente selecionado */}
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
              {/* Dados do Cliente */}
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary mr-4">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{clienteSelecionado.nome}</h3>
                    <p className="text-gray-500">ID: {clienteSelecionado.id_associado}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    <span className="font-medium mr-2">CPF:</span>
                    <span>{clienteSelecionado.cpf}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="font-medium mr-2">Telefone:</span>
                    <span>{clienteSelecionado.telefone}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="font-medium mr-2">E-mail:</span>
                    <span>{clienteSelecionado.email}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="font-medium mr-2">Cadastro:</span>
                    <span>{format(new Date(clienteSelecionado.data_cadastro), "dd/MM/yyyy", { locale: ptBR })}</span>
                  </div>
                  
                  {clienteSelecionado.endereco && (
                    <div className="flex items-start text-gray-600 md:col-span-2">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                      <span className="font-medium mr-2">Endereço:</span>
                      <span>{clienteSelecionado.endereco}</span>
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
    </div>
  );
};

export default Vendas;
