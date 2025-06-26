
import { useState } from 'react';

interface Venda {
  id: string;
  valor_total: number;
  metodo_pagamento: string;
  status: string;
  observacoes?: string;
  created_at: string;
  clientes?: {
    nome: string;
    cpf: string;
    telefone?: string;
    email?: string;
    id_associado?: string;
  };
  vendas_servicos?: Array<{
    id: string;
    servicos?: {
      nome: string;
      categoria: string;
    };
    prestadores?: {
      nome: string;
      especialidades?: string[];
    };
    valor: number;
    servico_id: string;
    prestador_id: string;
  }>;
}

export const useMobilePrint = () => {
  const [impressaoAtiva, setImpressaoAtiva] = useState<{tipo: 'recibo' | 'guia', vendaId: string} | null>(null);

  const imprimirRecibo = (venda: Venda) => {
    setImpressaoAtiva({ tipo: 'recibo', vendaId: venda.id });
    
    // Para mobile, usar uma nova janela
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      setImpressaoAtiva(null);
      return;
    }

    const reciboContent = document.querySelector(`#recibo-${venda.id}`);
    if (reciboContent) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Recibo de Venda</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px;
                line-height: 1.4;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none !important; }
              }
            </style>
          </head>
          <body>
            ${reciboContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };
    }
    
    setImpressaoAtiva(null);
  };

  const imprimirGuias = (venda: Venda) => {
    setImpressaoAtiva({ tipo: 'guia', vendaId: venda.id });
    
    // Para mobile, usar uma nova janela
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      setImpressaoAtiva(null);
      return;
    }

    const guiasContent = document.querySelector(`#guias-${venda.id}`);
    if (guiasContent) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Guias de Serviço</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px;
                line-height: 1.4;
              }
              .page-break-after { 
                page-break-after: always; 
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none !important; }
                .page-break-after { page-break-after: always; }
              }
            </style>
          </head>
          <body>
            ${guiasContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };
    }
    
    setImpressaoAtiva(null);
  };

  const gerarCodigoGuia = (vendaId: string, index: number) => {
    return `AG${vendaId.slice(0, 8).toUpperCase()}${(index + 1).toString().padStart(2, '0')}`;
  };

  return {
    impressaoAtiva,
    imprimirRecibo,
    imprimirGuias,
    gerarCodigoGuia
  };
};
