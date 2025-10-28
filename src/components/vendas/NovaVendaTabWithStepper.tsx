import React, { useMemo } from "react";
import { useVendaLogic } from "@/hooks/useVendaLogic";
import { useOrcamentosPorCliente, useCancelarOrcamento } from "@/hooks/useOrcamentos";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { VendaStepper } from "./VendaStepper";

// Componentes organizados
import BuscaCliente from "./BuscaCliente";
import ClienteNaoEncontrado from "./ClienteNaoEncontrado";
import ClienteEncontrado from "./ClienteEncontrado";
import ClienteSelecionado from "./ClienteSelecionado";
import BuscaServicos from "./BuscaServicos";
import ListaServicos from "./ListaServicos";
import AcoesFinaisVenda from "./AcoesFinaisVenda";
import OrcamentosPendentes from "./OrcamentosPendentes";
import VendaProcessing from "./VendaProcessing";

const NovaVendaTabWithStepper: React.FC = () => {
  const {
    termoBusca,
    setTermoBusca,
    estadoAtual,
    clienteSelecionado,
    servicosSelecionados,
    orcamentoSelecionado,
    isCreatingVenda,
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
    concluirVendaDoOrcamento
  } = useVendaLogic();

  const { data: orcamentosPendentes } = useOrcamentosPorCliente(clienteSelecionado?.id);
  const { mutate: cancelarOrcamento, isPending: isCancelingOrcamento } = useCancelarOrcamento();
  const { toast } = useToast();

  const handleCancelarOrcamento = (orcamentoId: string) => {
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

  // Calcular etapa atual para o stepper
  const etapaAtual = useMemo(() => {
    if (estadoAtual === 'inicial' || estadoAtual === 'nao_encontrado' || estadoAtual === 'cliente_selecionado') {
      return 1; // Etapa de busca de cliente
    }
    if (estadoAtual === 'cadastro_servicos') {
      return 2; // Etapa de seleção de serviços
    }
    if (estadoAtual === 'checkout') {
      return 3; // Etapa de pagamento
    }
    return 1;
  }, [estadoAtual]);

  // Estado checkout
  if (estadoAtual === 'checkout') {
    return (
      <div className="space-y-6">
        <Card className="p-4">
          <VendaStepper currentStep={3} />
        </Card>
        
        <VendaProcessing
          servicosSelecionados={servicosSelecionados}
          orcamentoSelecionado={orcamentoSelecionado}
          clienteSelecionado={clienteSelecionado}
          voltarDoCheckout={voltarDoCheckout}
          concluirVenda={concluirVenda}
          isCreatingVenda={isCreatingVenda}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stepper de progresso */}
      <Card className="p-4">
        <VendaStepper currentStep={etapaAtual} />
      </Card>

      {/* Conteúdo da etapa atual */}
      <div className="animate-fade-in">
        <BuscaCliente
          termoBusca={termoBusca}
          setTermoBusca={setTermoBusca}
          onBuscar={buscarCliente}
          disabled={estadoAtual === 'cadastro_servicos'}
        />

        {estadoAtual === 'nao_encontrado' && (
          <ClienteNaoEncontrado
            termoBusca={termoBusca}
            onCadastrarNovo={irParaCadastro}
          />
        )}

        {estadoAtual === 'cliente_selecionado' && clienteSelecionado && (
          <ClienteEncontrado
            cliente={clienteSelecionado}
            onConfirmar={confirmarCliente}
            onAlterar={alterarCliente}
            onCancelar={cancelarOperacao}
          />
        )}

        {estadoAtual === 'cadastro_servicos' && (
          <>
            <ClienteSelecionado
              cliente={clienteSelecionado}
              onCancelar={cancelarOperacao}
            />

            {orcamentosPendentes && orcamentosPendentes.length > 0 && (
              <OrcamentosPendentes
                orcamentos={orcamentosPendentes}
                onConcluirVenda={concluirVendaDoOrcamento}
                onCancelar={handleCancelarOrcamento}
                isLoading={isCreatingVenda || isCancelingOrcamento}
              />
            )}

            <BuscaServicos onServicoSelecionado={adicionarServico} />

            <ListaServicos
              servicos={servicosSelecionados}
              onRemoverServico={removerServico}
              onLimparLista={limparListaServicos}
            />

            <AcoesFinaisVenda
              onConcluirVenda={irParaCheckout}
              onSalvarOrcamento={salvarOrcamento}
              onCancelar={cancelarOperacao}
              servicosSelecionados={servicosSelecionados.length}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default NovaVendaTabWithStepper;
