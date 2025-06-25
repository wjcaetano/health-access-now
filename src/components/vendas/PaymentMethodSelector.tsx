
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Banknote, Smartphone, Check } from "lucide-react";

interface PaymentMethodSelectorProps {
  metodoPagamento: string;
  tipoCartao: string;
  onMetodoPagamentoChange: (metodo: string) => void;
  onTipoCartaoChange: (tipo: string) => void;
  onFinalizarPagamento: () => void;
  processandoPagamento: boolean;
  valorTotal: number;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  metodoPagamento,
  tipoCartao,
  onMetodoPagamentoChange,
  onTipoCartaoChange,
  onFinalizarPagamento,
  processandoPagamento,
  valorTotal
}) => {
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  return (
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
            onClick={() => onMetodoPagamentoChange("dinheiro")}
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
            onClick={() => onMetodoPagamentoChange("pix")}
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
            onClick={() => onMetodoPagamentoChange("cartao")}
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
              <Select onValueChange={onTipoCartaoChange}>
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
          onClick={onFinalizarPagamento} 
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
              Finalizar Pagamento - {formatarMoeda(valorTotal)}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentMethodSelector;
