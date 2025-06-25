
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Download, Printer, ArrowLeft, FileText, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ReciboVenda from "@/components/vendas/ReciboVenda";
import GuiaServico from "@/components/vendas/GuiaServico";

const VendaFinalizada: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showRecibo, setShowRecibo] = useState(false);
  const [showGuias, setShowGuias] = useState(false);

  const { venda, servicos, guias, cliente, metodoPagamento } = location.state || {};

  useEffect(() => {
    console.log('Dados recebidos na página finalizada:', { venda, servicos, guias, cliente, metodoPagamento });
    
    if (!venda || !servicos || !cliente) {
      console.error('Dados da venda não encontrados:', { venda, servicos, cliente });
      navigate('/dashboard/vendas');
      return;
    }
  }, [venda, servicos, cliente, navigate]);

  if (!venda || !servicos || !cliente) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Dados não encontrados</h2>
          <p className="text-gray-600 mb-4">Redirecionando...</p>
        </div>
      </div>
    );
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  const gerarCodigoGuia = (guiaId: string, index: number) => {
    if (guias && guias[index]) {
      return guias[index].codigo_autenticacao;
    }
    return `AG${Date.now()}${(index + 1).toString().padStart(2, '0')}`;
  };

  const imprimirRecibo = () => {
    console.log('Preparando impressão do recibo...');
    setShowRecibo(true);
    
    // Aguardar o componente renderizar antes de imprimir
    setTimeout(() => {
      const printContent = document.querySelector('.recibo-print');
      if (printContent) {
        const originalBody = document.body.innerHTML;
        document.body.innerHTML = printContent.outerHTML;
        window.print();
        document.body.innerHTML = originalBody;
        window.location.reload(); // Recarregar para restaurar os event listeners
      }
      setShowRecibo(false);
    }, 1000);
  };

  const imprimirGuias = () => {
    console.log('Preparando impressão das guias...');
    setShowGuias(true);
    
    // Aguardar os componentes renderizarem antes de imprimir
    setTimeout(() => {
      const printContent = document.querySelector('.guias-print');
      if (printContent) {
        const originalBody = document.body.innerHTML;
        document.body.innerHTML = printContent.outerHTML;
        window.print();
        document.body.innerHTML = originalBody;
        window.location.reload(); // Recarregar para restaurar os event listeners
      }
      setShowGuias(false);
    }, 1000);
  };

  const voltarParaVendas = () => {
    navigate('/dashboard/vendas');
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto print:hidden">
        {/* Header de Sucesso */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Venda Finalizada com Sucesso!
          </h2>
          <p className="text-gray-600">
            Pagamento processado via {metodoPagamento}
          </p>
        </div>

        {/* Resumo da Venda */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo da Venda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Informações do Cliente</h4>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold">{cliente.nome}</p>
                  <p className="text-sm text-gray-600">CPF: {cliente.cpf}</p>
                  <p className="text-sm text-gray-600">{cliente.telefone}</p>
                  {cliente.email && (
                    <p className="text-sm text-gray-600">{cliente.email}</p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Informações da Venda</h4>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm">
                    <span className="font-medium">Data:</span> {format(new Date(venda.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Método:</span> {metodoPagamento}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Total:</span> {formatarMoeda(venda.valor_total)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Status:</span> <span className="text-green-600 font-semibold">Concluída</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Serviços */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Serviços Contratados</h4>
              <div className="space-y-2">
                {servicos.map((servico: any, index: number) => (
                  <div key={servico.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{servico.servicos?.nome}</p>
                      <p className="text-sm text-gray-600">
                        Prestador: {servico.prestadores?.nome || "A definir"}
                      </p>
                      <p className="text-sm text-gray-600">Código da Guia: {gerarCodigoGuia(venda.id, index)}</p>
                    </div>
                    <span className="font-semibold text-green-600">
                      {formatarMoeda(servico.valor)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={imprimirRecibo}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={showRecibo}
          >
            <Printer className="h-4 w-4 mr-2" />
            {showRecibo ? "Preparando..." : "Imprimir Recibo"}
          </Button>
          
          <Button
            onClick={imprimirGuias}
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={showGuias}
          >
            <FileText className="h-4 w-4 mr-2" />
            {showGuias ? "Preparando..." : `Imprimir Guias (${servicos.length})`}
          </Button>
          
          <Button
            onClick={voltarParaVendas}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Vendas
          </Button>
        </div>
      </div>

      {/* Componentes de Impressão */}
      {showRecibo && (
        <div className="recibo-print">
          <ReciboVenda
            venda={venda}
            cliente={cliente}
            servicos={servicos}
            metodoPagamento={metodoPagamento}
          />
        </div>
      )}

      {showGuias && (
        <div className="guias-print">
          {servicos.map((servico: any, index: number) => (
            <GuiaServico
              key={servico.id}
              venda={venda}
              cliente={cliente}
              servico={servico}
              codigoGuia={gerarCodigoGuia(venda.id, index)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default VendaFinalizada;
