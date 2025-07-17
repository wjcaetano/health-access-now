
import { useState } from 'react';
import { usePrintDocument } from './usePrintDocument';

export const useVendaPrint = () => {
  const [isPrintingRecibo, setIsPrintingRecibo] = useState(false);
  const [isPrintingGuias, setIsPrintingGuias] = useState(false);
  const { printFromSelector } = usePrintDocument();

  const imprimirRecibo = () => {
    setIsPrintingRecibo(true);
    
    printFromSelector('.recibo-print', {
      title: 'Recibo de Venda',
      onAfterPrint: () => setIsPrintingRecibo(false)
    });
  };

  const imprimirGuias = () => {
    setIsPrintingGuias(true);
    
    printFromSelector('.guias-print', {
      title: 'Guias de Serviço',
      styles: `
        .page-break-after { page-break-after: always; }
        @media print {
          .page-break-after { page-break-after: always; }
        }
      `,
      onAfterPrint: () => setIsPrintingGuias(false)
    });
  };

  return {
    imprimirRecibo,
    imprimirGuias,
    isPrintingRecibo,
    isPrintingGuias
  };
};
