
import { useState } from "react";

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

export const useVendaImpressao = () => {
  const [impressaoAtiva, setImpressaoAtiva] = useState<{tipo: 'recibo' | 'guia', vendaId: string} | null>(null);

  const imprimirRecibo = (venda: Venda) => {
    setImpressaoAtiva({ tipo: 'recibo', vendaId: venda.id });
    
    setTimeout(() => {
      const printContent = document.querySelector(`#recibo-${venda.id}`);
      if (printContent) {
        const originalBody = document.body.innerHTML;
        document.body.innerHTML = printContent.outerHTML;
        window.print();
        document.body.innerHTML = originalBody;
        window.location.reload();
      }
      setImpressaoAtiva(null);
    }, 500);
  };

  const imprimirGuias = (venda: Venda) => {
    setImpressaoAtiva({ tipo: 'guia', vendaId: venda.id });
    
    setTimeout(() => {
      const printContent = document.querySelector(`#guias-${venda.id}`);
      if (printContent) {
        const originalBody = document.body.innerHTML;
        document.body.innerHTML = printContent.outerHTML;
        window.print();
        document.body.innerHTML = originalBody;
        window.location.reload();
      }
      setImpressaoAtiva(null);
    }, 500);
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
