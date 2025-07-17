
import React from "react";
import { Badge } from "@/components/ui/badge";

interface VendaStatusProps {
  status: string;
}

const statusStyles = {
  concluida: "bg-green-100 hover:bg-green-100 text-green-800",
  cancelada: "bg-red-100 hover:bg-red-100 text-red-800",
  estornada: "bg-orange-100 hover:bg-orange-100 text-orange-800",
};

const statusLabels = {
  concluida: 'Concluída',
  cancelada: 'Cancelada',
  estornada: 'Estornada'
};

const VendaStatus: React.FC<VendaStatusProps> = ({ status }) => {
  return (
    <Badge 
      variant="outline" 
      className={statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 hover:bg-gray-100 text-gray-800"}
    >
      {statusLabels[status as keyof typeof statusLabels] || status}
    </Badge>
  );
};

export default VendaStatus;
