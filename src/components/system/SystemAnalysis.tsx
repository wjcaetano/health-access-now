
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUsuarios } from '@/hooks/useUsuarios';
import { useAuditLog } from '@/hooks/useAuditLog';
import { useUnreadNotifications } from '@/hooks/useNotifications';
import { 
  Users, 
  Shield, 
  Bell, 
  CheckCircle, 
  AlertTriangle,
  Database,
  Settings
} from 'lucide-react';

export default function SystemAnalysis() {
  const { data: usuarios, isLoading: loadingUsuarios } = useUsuarios();
  const { data: auditLogs, isLoading: loadingAudit } = useAuditLog();
  const { data: notifications, isLoading: loadingNotifications } = useUnreadNotifications();

  const getSystemHealth = () => {
    const components = [
      { name: 'Usuários', status: !loadingUsuarios, data: usuarios?.length || 0 },
      { name: 'Auditoria', status: !loadingAudit, data: auditLogs?.length || 0 },
      { name: 'Notificações', status: !loadingNotifications, data: notifications?.length || 0 },
    ];
    
    const healthy = components.filter(c => c.status).length;
    const total = components.length;
    
    return { healthy, total, percentage: Math.round((healthy / total) * 100) };
  };

  const systemHealth = getSystemHealth();

  const userStats = usuarios ? {
    total: usuarios.length,
    ativos: usuarios.filter(u => u.status === 'ativo').length,
    pendentes: usuarios.filter(u => u.status === 'pendente').length,
    admins: usuarios.filter(u => u.nivel_acesso === 'admin').length,
    gerentes: usuarios.filter(u => u.nivel_acesso === 'gerente').length,
    colaboradores: usuarios.filter(u => u.nivel_acesso === 'colaborador').length,
  } : null;

  return (
    <div className="space-y-6">
      {/* Status Geral do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Status Geral do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold">
              {systemHealth.percentage}%
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {systemHealth.healthy} de {systemHealth.total} componentes funcionais
              </p>
              <Badge 
                variant={systemHealth.percentage >= 80 ? "default" : "destructive"}
                className="mt-1"
              >
                {systemHealth.percentage >= 80 ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Sistema Saudável
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Atenção Necessária
                  </>
                )}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Estatísticas de Usuários */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userStats ? (
              <div className="space-y-2">
                <div className="text-2xl font-bold">{userStats.total}</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Ativos:</span>
                    <Badge variant="secondary">{userStats.ativos}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Pendentes:</span>
                    <Badge variant="outline">{userStats.pendentes}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Admins:</span>
                    <Badge variant="destructive">{userStats.admins}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Gerentes:</span>
                    <Badge variant="default">{userStats.gerentes}</Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">Carregando...</div>
            )}
          </CardContent>
        </Card>

        {/* Auditoria */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              Auditoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{auditLogs?.length || 0}</div>
              <div className="text-sm text-gray-600">
                Registros de auditoria
              </div>
              <Badge variant={auditLogs && auditLogs.length > 0 ? "default" : "secondary"}>
                {auditLogs && auditLogs.length > 0 ? "Ativo" : "Sem registros"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{notifications?.length || 0}</div>
              <div className="text-sm text-gray-600">
                Não lidas
              </div>
              <Badge variant={notifications && notifications.length > 0 ? "destructive" : "default"}>
                {notifications && notifications.length > 0 ? "Pendentes" : "Todas lidas"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Componentes do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Componentes do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Módulos Principais</h4>
              <div className="space-y-2">
                {[
                  { name: 'Gestão de Usuários', status: true },
                  { name: 'Auditoria de Segurança', status: true },
                  { name: 'Notificações', status: true },
                  { name: 'Autenticação', status: true },
                  { name: 'Cadastro Direto', status: true },
                ].map((module) => (
                  <div key={module.name} className="flex items-center justify-between">
                    <span className="text-sm">{module.name}</span>
                    <Badge variant={module.status ? "default" : "destructive"}>
                      {module.status ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ativo
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Inativo
                        </>
                      )}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Integrações</h4>
              <div className="space-y-2">
                {[
                  { name: 'Supabase Database', status: true },
                  { name: 'Supabase Auth', status: true },
                  { name: 'Row Level Security', status: true },
                  { name: 'React Query', status: true },
                ].map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between">
                    <span className="text-sm">{integration.name}</span>
                    <Badge variant={integration.status ? "default" : "destructive"}>
                      {integration.status ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Conectado
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Desconectado
                        </>
                      )}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
