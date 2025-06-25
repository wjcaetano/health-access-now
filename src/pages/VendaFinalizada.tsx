
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VendaFinalizadaHeader from "@/components/vendas/VendaFinalizadaHeader";
import VendaResumo from "@/components/vendas/VendaResumo";
import VendaActions from "@/components/vendas/VendaActions";
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

  const gerarCodigoGuia = (guiaId: string, index: number) => {
    if (guias && guias[index]) {
      return guias[index].codigo_autenticacao;
    }
    return `AG${Date.now()}${(index + 1).toString().padStart(2, '0')}`;
  };

  const imprimirRecibo = () => {
    console.log('Preparando impressão do recibo...');
    setShowRecibo(true);
    
    setTimeout(() => {
      const printContent = document.querySelector('.recibo-print');
      if (printContent) {
        const originalBody = document.body.innerHTML;
        document.body.innerHTML = printContent.outerHTML;
        window.print();
        document.body.innerHTML = originalBody;
        window.location.reload();
      }
      setShowRecibo(false);
    }, 1000);
  };

  const imprimirGuias = () => {
    console.log('Preparando impressão das guias...');
    setShowGuias(true);
    
    setTimeout(() => {
      const printContent = document.querySelector('.guias-print');
      if (printContent) {
        const originalBody = document.body.innerHTML;
        document.body.innerHTML = printContent.outerHTML;
        window.print();
        document.body.innerHTML = originalBody;
        window.location.reload();
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

        <VendaActions
          onImprimirRecibo={imprimirRecibo}
          onImprimirGuias={imprimirGuias}
          onVoltarParaVendas={voltarParaVendas}
          showRecibo={showRecibo}
          showGuias={showGuias}
          quantidadeServicos={servicos.length}
        />
      </div>

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
