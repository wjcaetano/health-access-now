
import React from "react";
import CheckoutVenda from "./CheckoutVenda";

interface VendaProcessingProps {
  servicosSelecionados: any[];
  orcamentoSelecionado: any;
  clienteSelecionado: any;
  voltarDoCheckout: () => void;
  concluirVenda: (metodoPagamento: string, observacoes?: string) => void;
  isCreatingVenda: boolean;
}

const VendaProcessing: React.FC<VendaProcessingProps> = ({
  servicosSelecionados,
  orcamentoSelecionado,
  clienteSelecionado,
  voltarDoCheckout,
  concluirVenda,
  isCreatingVenda
}) => {
  let servicosParaCheckout: any[] = [];
  
  if (orcamentoSelecionado) {
    servicosParaCheckout = [{
      id: orcamentoSelecionado.servico_id!,
      nome: orcamentoSelecionado.servicos?.nome || "Serviço",
      categoria: orcamentoSelecionado.servicos?.categoria || "Categoria",
      prestadorId: orcamentoSelecionado.prestador_id!,
      prestadorNome: orcamentoSelecionado.prestadores?.nome || "Prestador",
      valorVenda: orcamentoSelecionado.valor_final,
      descricao: orcamentoSelecionado.observacoes || undefined
    }];
  } else {
    servicosParaCheckout = servicosSelecionados;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <CheckoutVenda
        servicos={servicosParaCheckout}
        cliente={clienteSelecionado}
        onVoltar={voltarDoCheckout}
        onConcluirVenda={concluirVenda}
        isLoading={isCreatingVenda}
      />
    </div>
  );
};

export default VendaProcessing;
