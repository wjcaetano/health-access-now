
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const CheckoutVendas: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Dados da venda vindos da página de vendas
  const [dadosVenda, setDadosVenda] = useState<any>(null);
  const [metodoPagamento, setMetodoPagamento] = useState<string>("");
  const [tipoCartao, setTipoCartao] = useState<string>("");
  const [processandoPagamento, setProcessandoPagamento] = useState(false);

  useEffect(() => {
    // Recuperar dados da venda do state da navegação ou localStorage
    const vendaData = location.state?.vendaData || JSON.parse(localStorage.getItem('checkout_venda') || '{}');
    
    if (!vendaData.cliente || !vendaData.servicos || vendaData.servicos.length === 0) {
      toast({
        title: "Dados não encontrados",
        description: "Não foi possível carregar os dados da venda.",
        variant: "destructive"
      });
      navigate('/vendas');
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
    return dadosVenda.servicos.reduce((total: number, servico: any) => total + servico.valor, 0);
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

    // Simular processamento do pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Aqui seria a integração real com o sistema de pagamento
    const metodoPagamentoTexto = metodoPagamento === "cartao" 
      ? `Cartão de ${tipoCartao}` 
      : metodoPagamento === "pix" 
      ? "PIX" 
      : "Dinheiro";

    toast({
      title: "Pagamento processado com sucesso!",
      description: `Venda finalizada via ${metodoPagamentoTexto}.`
    });

    // Limpar dados do localStorage
    localStorage.removeItem('checkout_venda');

    // Redirecionar para o dashboard ou página de confirmação
    navigate('/', { 
      state: { 
        vendaFinalizada: true,
        cliente: dadosVenda.cliente.nome,
        valor: calcularTotal(),
        metodoPagamento: metodoPagamentoTexto
      }
    });

    setProcessandoPagamento(false);
  };

  const voltarParaVendas = () => {
    navigate('/vendas');
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
                          {formatarMoeda(servico.valor)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Prestador: {servico.prestador}
                      </p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(servico.data), "dd/MM/yyyy", { locale: ptBR })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{servico.horario}</span>
                        </div>
                      </div>
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
