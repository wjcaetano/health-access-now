
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useClientes } from "@/hooks/useClientes";
import { useCreateOrcamento } from "@/hooks/useOrcamentos";
import { useCreateVenda } from "@/hooks/useVendas";

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

export const useVendaLogic = () => {
  const [termoBusca, setTermoBusca] = useState("");
  const [estadoAtual, setEstadoAtual] = useState<EstadoVenda>('inicial');
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [servicosSelecionados, setServicosSelecionados] = useState<ServicoSelecionado[]>([]);
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState<any>(null);
  
  const { data: clientes } = useClientes();
  const { mutate: criarOrcamento } = useCreateOrcamento();
  const { mutate: criarVenda, isPending: isCreatingVenda } = useCreateVenda();
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
      valorTotal = orcamentoSelecionado.valor_final;
      servicosVenda = [{
        servico_id: orcamentoSelecionado.servico_id!,
        prestador_id: orcamentoSelecionado.prestador_id!,
        valor: orcamentoSelecionado.valor_final
      }];
    } else {
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

  const concluirVendaDoOrcamento = (orcamento: any) => {
    setOrcamentoSelecionado(orcamento);
    setEstadoAtual('checkout');
  };

  return {
    // Estado
    termoBusca,
    setTermoBusca,
    estadoAtual,
    clienteSelecionado,
    servicosSelecionados,
    orcamentoSelecionado,
    isCreatingVenda,
    
    // Ações
    buscarCliente,
    confirmarCliente,
    alterarCliente,
    cancelarOperacao,
    irParaCadastro,
    adicionarServico,
    removerServico,
    limparListaServicos,
    irParaCheckout,
    voltarDoCheckout,
    concluirVenda,
    salvarOrcamento,
    concluirVendaDoOrcamento,
    setOrcamentoSelecionado,
    setEstadoAtual
  };
};
