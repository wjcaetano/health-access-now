
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCreateVenda } from "@/hooks/useVendas";
import { useUpdateOrcamento } from "@/hooks/useOrcamentos";
import PaymentMethodSelector from "@/components/vendas/PaymentMethodSelector";
import SalesSummary from "@/components/vendas/SalesSummary";

const CheckoutVendas: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { mutate: criarVenda, isPending: isCreatingVenda } = useCreateVenda();
  const { mutate: updateOrcamento } = useUpdateOrcamento();
  
  const [dadosVenda, setDadosVenda] = useState<any>(null);
  const [metodoPagamento, setMetodoPagamento] = useState<string>("");
  const [tipoCartao, setTipoCartao] = useState<string>("");
  const [processandoPagamento, setProcessandoPagamento] = useState(false);

  useEffect(() => {
    const vendaData = location.state?.vendaData;
    
    console.log('Dados recebidos no checkout:', vendaData);
    
    if (!vendaData?.cliente || !vendaData?.servicos || vendaData.servicos.length === 0) {
      console.error('Dados da venda inválidos:', vendaData);
      toast({
        title: "Dados não encontrados",
        description: "Não foi possível carregar os dados da venda.",
        variant: "destructive"
      });
      navigate('/dashboard/vendas');
      return;
    }
    
    setDadosVenda(vendaData);
  }, [location, navigate, toast]);

  const calcularTotal = () => {
    if (!dadosVenda?.servicos) return 0;
    return dadosVenda.servicos.reduce((total: number, servico: any) => total + servico.valorVenda, 0);
  };

  const finalizarPagamento = async () => {
    if (!metodoPagamento) {
      toast({
        title: "Selecione o método de pagamento",
        description: "É necessário escolher uma forma de pagamento.",
        variant: "destructive"
      });
      return;
    }

    if (metodoPagamento === "cartao" && !tipoCartao) {
      toast({
        title: "Selecione o tipo de cartão",
        description: "É necessário escolher débito ou crédito.",
        variant: "destructive"
      });
      return;
    }

    setProcessandoPagamento(true);

    const metodoPagamentoTexto = metodoPagamento === "cartao" 
      ? `Cartão de ${tipoCartao}` 
      : metodoPagamento === "pix" 
      ? "PIX" 
      : "Dinheiro";

    try {
      console.log('=== INICIANDO PROCESSO DE PAGAMENTO ===');
      console.log('Dados da venda:', dadosVenda);
      
      const novaVenda = {
        cliente_id: dadosVenda.cliente.id,
        valor_total: calcularTotal(),
        metodo_pagamento: metodoPagamentoTexto,
        status: 'concluida'
      };

      const servicosVenda = dadosVenda.servicos.map((servico: any) => ({
        servico_id: servico.id,
        prestador_id: servico.prestadorId,
        valor: servico.valorVenda
      }));

      console.log('Venda a ser criada:', novaVenda);
      console.log('Serviços da venda:', servicosVenda);

      criarVenda({ venda: novaVenda, servicos: servicosVenda }, {
        onSuccess: (data) => {
          console.log('=== VENDA CRIADA COM SUCESSO ===');
          console.log('Dados retornados:', data);
          console.log('Venda:', data.venda);
          console.log('Serviços:', data.servicos);
          console.log('Guias geradas:', data.guias);
          console.log('Quantidade de guias:', data.guias?.length);
          
          // Verificar se as guias foram criadas corretamente
          if (!data.guias || data.guias.length === 0) {
            console.error('ERRO: Nenhuma guia foi criada!');
            toast({
              title: "Aviso",
              description: "Venda criada, mas houve problema na geração das guias.",
              variant: "destructive"
            });
          } else {
            console.log('✅ Guias criadas com sucesso:', data.guias.map((guia: any) => ({
              id: guia.id,
              codigo: guia.codigo_autenticacao,
              servico_id: guia.servico_id
            })));
          }
          
          if (dadosVenda.orcamentoId) {
            console.log('Atualizando status do orçamento:', dadosVenda.orcamentoId);
            updateOrcamento({ 
              id: dadosVenda.orcamentoId, 
              status: 'aprovado',
              venda_id: data.venda.id 
            });
          }

          toast({
            title: "Pagamento processado com sucesso!",
            description: `Venda finalizada via ${metodoPagamentoTexto}. ${data.guias?.length || 0} guia(s) de atendimento gerada(s).`
          });

          // Preparar dados completos dos serviços para a página finalizada
          const servicosCompletos = data.servicos.map((servicoVenda: any, index: number) => {
            const servicoOriginal = dadosVenda.servicos[index];
            return {
              ...servicoVenda,
              servicos: {
                nome: servicoOriginal.nome,
                categoria: servicoOriginal.categoria
              },
              prestadores: {
                nome: servicoOriginal.prestadorNome
              }
            };
          });

          const dadosParaFinalizada = {
            venda: data.venda,
            servicos: servicosCompletos,
            guias: data.guias || [],
            cliente: dadosVenda.cliente,
            metodoPagamento: metodoPagamentoTexto
          };

          console.log('=== DADOS SENDO ENVIADOS PARA PÁGINA FINALIZADA ===');
          console.log('Dados completos:', dadosParaFinalizada);
          console.log('Quantidade de guias sendo enviadas:', dadosParaFinalizada.guias.length);
          
          navigate('/venda-finalizada', { 
            state: dadosParaFinalizada,
            replace: true
          });
        },
        onError: (error) => {
          console.error('=== ERRO AO CRIAR VENDA ===');
          console.error('Erro:', error);
          toast({
            title: "Erro ao processar pagamento",
            description: "Ocorreu um erro ao finalizar a venda. Tente novamente.",
            variant: "destructive"
          });
          setProcessandoPagamento(false);
        }
      });

    } catch (error) {
      console.error('=== ERRO INESPERADO ===');
      console.error('Erro:', error);
      toast({
        title: "Erro ao processar pagamento",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
      setProcessandoPagamento(false);
    }
  };

  const voltarParaVendas = () => {
    navigate('/dashboard/vendas');
  };

  if (!dadosVenda) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Carregando dados da venda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={voltarParaVendas}
          className="flex items-center gap-2"
          disabled={processandoPagamento}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Vendas
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Checkout da Venda</h2>
          <p className="text-gray-500 mt-1">
            Finalize o pagamento da venda
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesSummary dadosVenda={dadosVenda} />
        <PaymentMethodSelector
          metodoPagamento={metodoPagamento}
          tipoCartao={tipoCartao}
          onMetodoPagamentoChange={setMetodoPagamento}
          onTipoCartaoChange={setTipoCartao}
          onFinalizarPagamento={finalizarPagamento}
          processandoPagamento={processandoPagamento}
          valorTotal={calcularTotal()}
        />
      </div>
    </div>
  );
};

export default CheckoutVendas;
