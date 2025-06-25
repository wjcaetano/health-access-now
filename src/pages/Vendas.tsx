
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useOrcamentosPorCliente, useCancelarOrcamento } from "@/hooks/useOrcamentos";
import { useVendas } from "@/hooks/useVendas";
import { useToast } from "@/hooks/use-toast";
import { useVendaLogic } from "@/hooks/useVendaLogic";
import BuscaCliente from "@/components/vendas/BuscaCliente";
import ClienteNaoEncontrado from "@/components/vendas/ClienteNaoEncontrado";
import ClienteEncontrado from "@/components/vendas/ClienteEncontrado";
import ClienteSelecionado from "@/components/vendas/ClienteSelecionado";
import BuscaServicos from "@/components/vendas/BuscaServicos";
import ListaServicos from "@/components/vendas/ListaServicos";
import CheckoutVenda from "@/components/vendas/CheckoutVenda";
import OrcamentosPendentes from "@/components/vendas/OrcamentosPendentes";
import ListaVendas from "@/components/vendas/ListaVendas";
import AcoesFinaisVenda from "@/components/vendas/AcoesFinaisVenda";

const Vendas: React.FC = () => {
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
  const { data: vendas, isLoading: isLoadingVendas } = useVendas();
  const { mutate: cancelarOrcamento, isPending: isCancelingOrcamento } = useCancelarOrcamento();
  const { toast } = useToast();

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
    let servicosParaCheckout: any[] = [];
    
    if (orcamentoSelecionado) {
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
            <div className="space-y-6">
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
