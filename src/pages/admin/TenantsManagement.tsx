
import React from 'react';
import { RouteGuard } from '@/components/layout/guards/RouteGuard';
import { TenantInviteManager } from '@/components/admin/TenantInviteManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, Settings } from 'lucide-react';

const TenantsManagement: React.FC = () => {
  return (
    <RouteGuard requiredLevel="admin">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestão Multi-Tenant
          </h1>
          <p className="text-gray-500">
            Gerencie contextos, usuários e configurações do sistema
          </p>
        </div>

        <Tabs defaultValue="invites" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="invites" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Convites
            </TabsTrigger>
            <TabsTrigger value="tenants" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Contextos
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invites" className="space-y-4">
            <TenantInviteManager />
          </TabsContent>

          <TabsContent value="tenants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Contextos</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os contextos do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Gestão de contextos será implementada na próxima fase</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Globais</CardTitle>
                <CardDescription>
                  Configure aspectos globais do sistema multi-tenant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Configurações globais serão implementadas na próxima fase</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RouteGuard>
  );
};

export default TenantsManagement;
