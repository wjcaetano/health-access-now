
import React from 'react';
import GuiaServico from '@/components/vendas/GuiaServico';
import { PrintContainer } from './PrintContainer';

interface PrintableGuiaProps {
  venda: any;
  cliente: any;
  servicos: any[];
  guias?: any[];
  gerarCodigoGuia?: (vendaId: string, index: number) => string;
}

export const PrintableGuia: React.FC<PrintableGuiaProps> = ({
  venda,
  cliente,
  servicos,
  guias,
  gerarCodigoGuia
}) => {
  const defaultGerarCodigo = (vendaId: string, index: number) => {
    if (guias && guias[index] && guias[index].codigo_autenticacao) {
      return guias[index].codigo_autenticacao;
    }
    
    const servicoAtual = servicos[index];
    if (servicoAtual && servicoAtual.id) {
      return `AG${servicoAtual.id.slice(0, 6).toUpperCase()}${(index + 1).toString().padStart(2, '0')}`;
    }
    
    return `AG${Date.now().toString().slice(-6)}${(index + 1).toString().padStart(2, '0')}`;
  };

  const codigoGenerator = gerarCodigoGuia || defaultGerarCodigo;

  return (
    <PrintContainer printOnly className="guias-print">
      {servicos.map((servico, index) => {
        const codigoGuia = codigoGenerator(venda.id, index);
        
        return (
          <GuiaServico
            key={`${servico.id}-${index}`}
            venda={venda}
            cliente={cliente}
            servico={servico}
            codigoGuia={codigoGuia}
          />
        );
      })}
    </PrintContainer>
  );
};
