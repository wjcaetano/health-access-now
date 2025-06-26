
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusMap: Record<string, { label: string; color: string }> = {
  emitida: { label: "Emitida", color: "bg-yellow-100 text-yellow-800" },
  realizada: { label: "Realizada", color: "bg-blue-100 text-blue-800" },
  faturada: { label: "Faturada", color: "bg-green-100 text-green-800" },
  paga: { label: "Paga", color: "bg-gray-100 text-gray-800" },
  cancelada: { label: "Cancelada", color: "bg-red-100 text-red-800" },
  estornada: { label: "Estornada", color: "bg-purple-100 text-purple-800" },
  expirada: { label: "Expirada", color: "bg-orange-100 text-orange-800" }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const statusInfo = statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800" };
  
  return (
    <Badge className={`${statusInfo.color} ${className}`}>
      {statusInfo.label}
    </Badge>
  );
};
