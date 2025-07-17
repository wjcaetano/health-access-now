
import React from "react";
import { Check } from "lucide-react";

interface VendaFinalizadaHeaderProps {
  metodoPagamento: string;
}

const VendaFinalizadaHeader: React.FC<VendaFinalizadaHeaderProps> = ({
  metodoPagamento
}) => {
  return (
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
  );
};

export default VendaFinalizadaHeader;
