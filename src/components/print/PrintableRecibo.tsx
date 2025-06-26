
import React from 'react';
import ReciboVenda from '@/components/vendas/ReciboVenda';
import { PrintContainer } from './PrintContainer';

interface PrintableReciboProps {
  venda: any;
  cliente: any;
  servicos: any[];
  metodoPagamento?: string;
}

export const PrintableRecibo: React.FC<PrintableReciboProps> = ({
  venda,
  cliente,
  servicos,
  metodoPagamento
}) => {
  return (
    <PrintContainer printOnly className="recibo-print">
      <ReciboVenda
        venda={venda}
        cliente={cliente}
        servicos={servicos}
        metodoPagamento={metodoPagamento}
      />
    </PrintContainer>
  );
};
