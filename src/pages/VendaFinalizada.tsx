
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VendaFinalizadaHeader from "@/components/vendas/VendaFinalizadaHeader";
import VendaResumo from "@/components/vendas/VendaResumo";
import VendaFinalizadaActions from "@/components/vendas/VendaFinalizadaActions";
import ReciboVenda from "@/components/vendas/ReciboVenda";
import GuiaServico from "@/components/vendas/GuiaServico";

const VendaFinalizada: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showRecibo, setShowRecibo] = useState(false);
  const [showGuias, setShowGuias] = useState(false);

  const { venda, servicos, guias, cliente, metodoPagamento } = location.state || {};

  useEffect(() => {
    console.log('=== PÁGINA VENDA FINALIZADA ===');
    console.log('Dados recebidos na página finalizada:', { venda, servicos, guias, cliente, metodoPagamento });
    console.log('Quantidade de guias recebidas:', guias?.length);
    console.log('Detalhes das guias:', guias);
    
    if (!venda || !servicos || !cliente) {
      console.error('Dados da venda não encontrados:', { venda, servicos, cliente });
      navigate('/dashboard/vendas');
      return;
    }

    if (!guias || guias.length === 0) {
      console.warn('Nenhuma guia foi recebida ou criada para esta venda');
    }
  }, [venda, servicos, cliente, guias, navigate]);

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

  const gerarCodigoGuia = (guiaId: string, index: number) => {
    console.log('Gerando código para guia:', { guiaId, index, guias });
    
    if (guias && guias[index]) {
      console.log('Usando código da guia existente:', guias[index].codigo_autenticacao);
      return guias[index].codigo_autenticacao;
    }
    
    const codigoGerado = `AG${Date.now()}${(index + 1).toString().padStart(2, '0')}`;
    console.log('Código gerado automaticamente:', codigoGerado);
    return codigoGerado;
  };

  const imprimirRecibo = () => {
    console.log('Preparando impressão do recibo...');
    setShowRecibo(true);
    
    setTimeout(() => {
      const printContent = document.querySelector('.recibo-print');
      if (printContent) {
        const originalBody = document.body.innerHTML;
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Recibo de Venda</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  .recibo-print { max-width: 800px; margin: 0 auto; }
                </style>
              </head>
              <body>
                ${printContent.outerHTML}
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
          printWindow.close();
        }
      }
      setShowRecibo(false);
    }, 1000);
  };

  const imprimirGuias = () => {
    console.log('Preparando impressão das guias...');
    console.log('Serviços para impressão:', servicos);
    console.log('Guias disponíveis:', guias);
    
    setShowGuias(true);
    
    setTimeout(() => {
      const printContent = document.querySelector('.guias-print');
      if (printContent) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Guias de Serviço</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  .page-break-after { page-break-after: always; }
                  @media print {
                    .page-break-after { page-break-after: always; }
                  }
                </style>
              </head>
              <body>
                ${printContent.outerHTML}
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
          printWindow.close();
        }
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
        <VendaFinalizadaHeader metodoPagamento={metodoPagamento} />
        
        <VendaResumo
          venda={venda}
          cliente={cliente}
          servicos={servicos}
          metodoPagamento={metodoPagamento}
          gerarCodigoGuia={gerarCodigoGuia}
        />

        <VendaFinalizadaActions
          onImprimirRecibo={imprimirRecibo}
          onImprimirGuias={imprimirGuias}
          onVoltarParaVendas={voltarParaVendas}
          showRecibo={showRecibo}
          showGuias={showGuias}
          quantidadeServicos={servicos.length}
        />

        {/* Debug Info */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">Debug - Informações das Guias</h4>
          <p className="text-sm text-yellow-700">
            Quantidade de serviços: {servicos.length}
          </p>
          <p className="text-sm text-yellow-700">
            Quantidade de guias: {guias?.length || 0}
          </p>
          <p className="text-sm text-yellow-700">
            Guias disponíveis: {guias ? 'Sim' : 'Não'}
          </p>
        </div>
      </div>

      {showRecibo && (
        <div className="recibo-print hidden">
          <ReciboVenda
            venda={venda}
            cliente={cliente}
            servicos={servicos}
            metodoPagamento={metodoPagamento}
          />
        </div>
      )}

      {showGuias && (
        <div className="guias-print hidden">
          {servicos.map((servico: any, index: number) => {
            console.log(`Renderizando guia ${index + 1}:`, servico);
            return (
              <GuiaServico
                key={servico.id}
                venda={venda}
                cliente={cliente}
                servico={servico}
                codigoGuia={gerarCodigoGuia(venda.id, index)}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default VendaFinalizada;
