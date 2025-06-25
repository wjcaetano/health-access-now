
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
    
    console.log('=== CHECKOUT CARREGADO ===');
    console.log('Dados recebidos no checkout:', vendaData);
    
    if (!vendaData?.cliente || !vendaData?.servicos || vendaData.servicos.length === 0) {
      console.error('❌ Dados da venda inválidos:', vendaData);
      toast({
        title: "Dados não encontrados",
        description: "Não foi possível carregar os dados da venda.",
        variant: "destructive"
      });
      navigate('/dashboard/vendas');
      return;
    }
    
    console.log('✅ Dados da venda válidos - definindo estado');
    setDadosVenda(vendaData);
  }, [location, navigate, toast]);

  const calcularTotal = () => {
    if (!dadosVenda?.servicos) return 0;
    return dadosVenda.servicos.reduce((total: number, servico: any) => total + servico.valorVenda, 0);
  };

  const finalizarPagamento = async () => {
    console.log('=== INICIANDO FINALIZAÇÃO DO PAGAMENTO ===');
    
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
      console.log('Dados da venda a processar:', dadosVenda);
      
      const novaVenda = {
        cliente_id: dadosVenda.cliente.id,
        valor_total: calcularTotal(),
        metodo_pagamento: metodoPagamentoTexto,
        status: 'concluida'
      } as const;

      const servicosVenda = dadosVenda.servicos.map((servico: any) => ({
        servico_id: servico.id,
        prestador_id: servico.prestadorId,
        valor: servico.valorVenda
      }));

      console.log('=== DADOS PARA CRIAÇÃO DA VENDA ===');
      console.log('Nova venda:', novaVenda);
      console.log('Serviços da venda:', servicosVenda);
      console.log('Cliente ID:', dadosVenda.cliente.id);
      console.log('Quantidade de serviços:', servicosVenda.length);

      criarVenda({ venda: novaVenda, servicos: servicosVenda }, {
        onSuccess: (data) => {
          console.log('=== VENDA CRIADA COM SUCESSO ===');
          console.log('Resposta completa:', data);
          console.log('Venda criada:', data.venda);
          console.log('Serviços criados:', data.servicos?.length || 0);
          console.log('Guias criadas:', data.guias?.length || 0);
          
          // Verificar se as guias foram criadas
          if (!data.guias || data.guias.length === 0) {
            console.error('❌ PROBLEMA: Nenhuma guia foi criada!');
            if (data.erro_guias) {
              console.error('Erro específico das guias:', data.erro_guias);
            }
            
            toast({
              title: "Venda criada com problema",
              description: "A venda foi criada mas houve problema na geração das guias de atendimento.",
              variant: "destructive"
            });
          } else {
            console.log('✅ Guias criadas com sucesso!');
            data.guias.forEach((guia: any, index: number) => {
              console.log(`Guia ${index + 1}:`, {
                id: guia.id,
                codigo: guia.codigo_autenticacao,
                servico_id: guia.servico_id,
                prestador_id: guia.prestador_id,
                valor: guia.valor
              });
            });
          }
          
          // Atualizar orçamento se existir
          if (dadosVenda.orcamentoId) {
            console.log('Atualizando status do orçamento:', dadosVenda.orcamentoId);
            updateOrcamento({ 
              id: dadosVenda.orcamentoId, 
              status: 'aprovado',
              venda_id: data.venda.id 
            });
          }

          const mensagemSucesso = data.guias && data.guias.length > 0 
            ? `Venda finalizada via ${metodoPagamentoTexto}. ${data.guias.length} guia(s) de atendimento gerada(s).`
            : `Venda finalizada via ${metodoPagamentoTexto}, mas houve problema na geração das guias.`;

          toast({
            title: "Pagamento processado!",
            description: mensagemSucesso,
            variant: data.guias && data.guias.length > 0 ? "default" : "destructive"
          });

          // Preparar dados completos para a página finalizada
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

          console.log('=== NAVEGANDO PARA PÁGINA FINALIZADA ===');
          console.log('Dados sendo enviados:', {
            venda_id: dadosParaFinalizada.venda.id,
            quantidade_servicos: dadosParaFinalizada.servicos.length,
            quantidade_guias: dadosParaFinalizada.guias.length,
            cliente: dadosParaFinalizada.cliente.nome
          });
          
          navigate('/venda-finalizada', { 
            state: dadosParaFinalizada,
            replace: true
          });
        },
        onError: (error) => {
          console.error('=== ERRO AO CRIAR VENDA ===');
          console.error('Erro completo:', error);
          toast({
            title: "Erro ao processar pagamento",
            description: "Ocorreu um erro ao finalizar a venda. Tente novamente.",
            variant: "destructive"
          });
          setProcessandoPagamento(false);
        }
      });

    } catch (error) {
      console.error('=== ERRO INESPERADO NO CHECKOUT ===');
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
