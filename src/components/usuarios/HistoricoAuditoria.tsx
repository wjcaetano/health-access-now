
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuditLog } from "@/hooks/useAuditLog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Shield, Activity } from "lucide-react";

export default function HistoricoAuditoria() {
  const { data: auditLogs, isLoading } = useAuditLog();

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login': return 'bg-green-100 text-green-800';
      case 'logout': return 'bg-gray-100 text-gray-800';
      case 'status_change': return 'bg-blue-100 text-blue-800';
      case 'profile_update': return 'bg-yellow-100 text-yellow-800';
      case 'invite_sent': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAction = (action: string) => {
    const actions: Record<string, string> = {
      login: 'Login',
      logout: 'Logout',
      status_change: 'Alteração de Status',
      profile_update: 'Atualização de Perfil',
      invite_sent: 'Convite Enviado',
      invite_used: 'Convite Usado',
      password_change: 'Alteração de Senha',
    };
    return actions[action] || action;
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-32">Carregando...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Histórico de Auditoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!auditLogs || auditLogs.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Nenhum registro de auditoria encontrado
          </p>
        ) : (
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-4 border rounded-lg">
                <Activity className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge className={getActionColor(log.action)}>
                      {formatAction(log.action)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(log.created_at), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </span>
                  </div>
                  <div className="mt-1">
                    <p className="text-sm">
                      <strong>Usuário:</strong> {log.user?.nome || 'N/A'} ({log.user?.email || 'N/A'})
                    </p>
                    <p className="text-sm">
                      <strong>Executado por:</strong> {log.performed_by_user?.nome || 'Sistema'} 
                      {log.performed_by_user?.email && ` (${log.performed_by_user.email})`}
                    </p>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        <strong>Detalhes:</strong>
                        <pre className="mt-1 whitespace-pre-wrap">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
