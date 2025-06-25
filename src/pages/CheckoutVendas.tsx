
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CreditCard,
  Banknote,
  Smartphone,
  ArrowLeft,
  Check,
  User,
  Calendar,
  Clock
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCreateVenda } from "@/hooks/useVendas";
import { useUpdateOrcamento } from "@/hooks/useOrcamentos";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const CheckoutVendas: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { mutate: criarVenda, isPending: isCreatingVenda } = useCreateVenda();
  const { mutate: updateOrcamento } = useUpdateOrcamento();
  
  // Dados da venda vindos da página de vendas
  const [dadosVenda, setDadosVenda] = useState<any>(null);
  const [metodoPagamento, setMetodoPagamento] = useState<string>("");
  const [tipoCartao, setTipoCartao] = useState<string>("");
  const [processandoPagamento, setProcessandoPagamento] = useState(false);

  useEffect(() => {
    // Recuperar dados da venda do state da navegação
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

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

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
      // Criar a venda
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

      console.log('Criando venda:', { novaVenda, servicosVenda });

      await new Promise((resolve, reject) => {
        criarVenda({ venda: novaVenda, servicos: servicosVenda }, {
          onSuccess: (data) => {
            console.log('Venda criada com sucesso:', data);
            
            // Se veio de um orçamento, atualizar o status
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
              description: `Venda finalizada via ${metodoPagamentoTexto}.`
            });

            // Redirecionar para página de sucesso com dados da venda
            navigate('/dashboard/venda-finalizada', { 
              state: { 
                venda: data.venda,
                servicos: data.servicos,
                guias: data.guias,
                cliente: dadosVenda.cliente,
                metodoPagamento: metodoPagamentoTexto
              }
            });
            resolve(data);
          },
          onError: (error) => {
            console.error('Erro ao criar venda:', error);
            toast({
              title: "Erro ao processar pagamento",
              description: "Ocorreu um erro ao finalizar a venda.",
              variant: "destructive"
            });
            reject(error);
          }
        });
      });

    } catch (error) {
      console.error('Erro ao finalizar pagamento:', error);
    } finally {
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
        {/* Resumo da Venda */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo da Venda</CardTitle>
            <CardDescription>
              Confirme os dados antes de processar o pagamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Dados do Cliente */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <User className="h-5 w-5 text-agendaja-primary mr-2" />
                <h4 className="font-medium">Cliente</h4>
              </div>
              <p className="font-semibold">{dadosVenda.cliente.nome}</p>
              <p className="text-sm text-gray-600">{dadosVenda.cliente.telefone}</p>
              <p className="text-sm text-gray-600">CPF: {dadosVenda.cliente.cpf}</p>
            </div>

            {/* Lista de Serviços */}
            <div>
              <h4 className="font-medium mb-3">Serviços Contratados</h4>
              <div className="space-y-3">
                {dadosVenda.servicos.map((servico: any, index: number) => (
                  <Card key={index} className="border-l-4 border-l-agendaja-primary">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium">{servico.nome}</h5>
                        <span className="font-semibold text-agendaja-primary">
                          {formatarMoeda(servico.valorVenda)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Categoria: {servico.categoria}
                      </p>
                      <p className="text-sm text-gray-600">
                        Prestador: {servico.prestadorNome}
                      </p>
                      {servico.descricao && (
                        <p className="text-xs text-gray-500 mt-1">{servico.descricao}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total:</span>
                <span className="text-2xl font-bold text-agendaja-primary">
                  {formatarMoeda(calcularTotal())}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Método de Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle>Método de Pagamento</CardTitle>
            <CardDescription>
              Selecione a forma de pagamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {/* Dinheiro */}
              <Card 
                className={`cursor-pointer transition-colors ${
                  metodoPagamento === "dinheiro" 
                    ? "bg-agendaja-light border-agendaja-primary" 
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setMetodoPagamento("dinheiro")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Banknote className="h-6 w-6 text-green-600 mr-3" />
                    <div className="flex-1">
                      <h4 className="font-medium">Dinheiro</h4>
                      <p className="text-sm text-gray-600">Pagamento em espécie</p>
                    </div>
                    {metodoPagamento === "dinheiro" && (
                      <Check className="h-5 w-5 text-agendaja-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* PIX */}
              <Card 
                className={`cursor-pointer transition-colors ${
                  metodoPagamento === "pix" 
                    ? "bg-agendaja-light border-agendaja-primary" 
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setMetodoPagamento("pix")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Smartphone className="h-6 w-6 text-blue-600 mr-3" />
                    <div className="flex-1">
                      <h4 className="font-medium">PIX</h4>
                      <p className="text-sm text-gray-600">Transferência instantânea</p>
                    </div>
                    {metodoPagamento === "pix" && (
                      <Check className="h-5 w-5 text-agendaja-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Cartão */}
              <Card 
                className={`cursor-pointer transition-colors ${
                  metodoPagamento === "cartao" 
                    ? "bg-agendaja-light border-agendaja-primary" 
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setMetodoPagamento("cartao")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <CreditCard className="h-6 w-6 text-purple-600 mr-3" />
                    <div className="flex-1">
                      <h4 className="font-medium">Cartão</h4>
                      <p className="text-sm text-gray-600">Débito ou crédito</p>
                    </div>
                    {metodoPagamento === "cartao" && (
                      <Check className="h-5 w-5 text-agendaja-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Seleção do tipo de cartão */}
              {metodoPagamento === "cartao" && (
                <div className="ml-4 space-y-2">
                  <label className="text-sm font-medium">Tipo de cartão:</label>
                  <Select onValueChange={setTipoCartao}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione débito ou crédito" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debito">Cartão de Débito</SelectItem>
                      <SelectItem value="credito">Cartão de Crédito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={finalizarPagamento} 
              className="w-full bg-agendaja-primary hover:bg-agendaja-secondary"
              disabled={processandoPagamento || !metodoPagamento || (metodoPagamento === "cartao" && !tipoCartao)}
            >
              {processandoPagamento ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Finalizar Pagamento - {formatarMoeda(calcularTotal())}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutVendas;
