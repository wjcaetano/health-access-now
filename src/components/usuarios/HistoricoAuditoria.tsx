
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuditLog } from "@/hooks/useAuditLog";
import { History, User, Settings, Shield } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HistoricoAuditoriaProps {
  userId?: string;
}

export default function HistoricoAuditoria({ userId }: HistoricoAuditoriaProps) {
  const { data: logs, isLoading } = useAuditLog(userId);

  if (isLoading) {
    return <div className="animate-pulse">Carregando histórico...</div>;
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login':
      case 'logout':
        return <User className="h-4 w-4" />;
      case 'profile_update':
        return <Settings className="h-4 w-4" />;
      case 'status_change':
        return <Shield className="h-4 w-4" />;
      default:
        return <History className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login':
        return 'bg-green-100 text-green-800';
      case 'logout':
        return 'bg-gray-100 text-gray-800';
      case 'profile_update':
        return 'bg-blue-100 text-blue-800';
      case 'status_change':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Histórico de Auditoria
          {userId && <span className="text-sm font-normal text-gray-500">(Usuário específico)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!logs || logs.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhum registro encontrado</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 border rounded">
                <div className={`p-2 rounded-full ${getActionColor(log.action)}`}>
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getActionColor(log.action)}>
                      {log.action.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {format(new Date(log.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  {log.details && (
                    <p className="text-sm text-gray-600">
                      {JSON.stringify(log.details, null, 2)}
                    </p>
                  )}
                  {log.ip_address && (
                    <p className="text-xs text-gray-400">IP: {log.ip_address}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
