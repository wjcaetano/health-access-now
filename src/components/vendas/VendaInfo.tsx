
import React from "react";
import { User } from "lucide-react";

interface VendaInfoProps {
  nome: string;
  cpf: string;
}

const VendaInfo: React.FC<VendaInfoProps> = ({ nome, cpf }) => {
  return (
    <div className="min-w-0">
      <p className="font-medium truncate">{nome}</p>
      <p className="text-sm text-gray-500 truncate">{cpf}</p>
    </div>
  );
};

export default VendaInfo;
