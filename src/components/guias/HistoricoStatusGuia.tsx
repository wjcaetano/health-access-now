
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle, Clock, FileText, DollarSign, XCircle, AlertCircle } from "lucide-react";

interface HistoricoStatusGuiaProps {
  guia: any;
}

const statusIcons = {
  emitida: FileText,
  realizada: CheckCircle,
  faturada: DollarSign,
  paga: CheckCircle,
  cancelada: XCircle,
  estornada: AlertCircle,
  expirada: Clock
};

const statusColors = {
  emitida: "text-yellow-600",
  realizada: "text-blue-600", 
  faturada: "text-green-600",
  paga: "text-gray-600",
  cancelada: "text-red-600",
  estornada: "text-purple-600",
  expirada: "text-orange-600"
};

const HistoricoStatusGuia: React.FC<HistoricoStatusGuiaProps> = ({ guia }) => {
  // Construir timeline baseada nas datas disponíveis
  const timeline = [];
  
  // Emissão (sempre existe)
  timeline.push({
    status: 'emitida',
    data: guia.data_emissao,
    label: 'Guia Emitida'
  });
  
  // Realização
  if (guia.data_realizacao) {
    timeline.push({
      status: 'realizada',
      data: guia.data_realizacao,
      label: 'Serviço Realizado'
    });
  }
  
  // Faturamento
  if (guia.data_faturamento) {
    timeline.push({
      status: 'faturada',
      data: guia.data_faturamento,
      label: 'Guia Faturada'
    });
  }
  
  // Pagamento
  if (guia.data_pagamento) {
    timeline.push({
      status: 'paga',
      data: guia.data_pagamento,
      label: 'Pagamento Realizado'
    });
  }
  
  // Status atual se for cancelada, estornada ou expirada
  if (['cancelada', 'estornada', 'expirada'].includes(guia.status) && !timeline.find(t => t.status === guia.status)) {
    timeline.push({
      status: guia.status,
      data: new Date().toISOString(), // Data atual como aproximação
      label: guia.status === 'cancelada' ? 'Guia Cancelada' : 
             guia.status === 'estornada' ? 'Pagamento Estornado' : 'Guia Expirada'
    });
  }
  
  // Ordenar por data
  timeline.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Histórico da Guia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeline.map((evento, index) => {
            const Icon = statusIcons[evento.status as keyof typeof statusIcons];
            const isCurrentStatus = guia.status === evento.status;
            const isCompleted = index < timeline.length - 1 || isCurrentStatus;
            
            return (
              <div key={`${evento.status}-${index}`} className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-4 w-4 ${
                    isCompleted ? statusColors[evento.status as keyof typeof statusColors] : 'text-gray-400'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                      {evento.label}
                    </p>
                    {isCurrentStatus && (
                      <Badge variant="outline" className="text-xs">
                        Atual
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    {format(new Date(evento.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                  
                  {/* Linha conectora */}
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-6 bg-gray-200 ml-4 mt-2" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricoStatusGuia;
