
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeSettings from "@/components/settings/ThemeSettings";
import PWAInstaller from "@/components/pwa/PWAInstaller";
import NotificationsPanel from "@/components/usuarios/NotificationsPanel";

export default function SystemSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
        <p className="text-gray-600">Gerencie as configurações avançadas do sistema</p>
      </div>

      <Tabs defaultValue="theme" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="theme">Tema</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="pwa">PWA</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        <TabsContent value="theme">
          <ThemeSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsPanel />
        </TabsContent>

        <TabsContent value="pwa">
          <PWAInstaller />
        </TabsContent>

        <TabsContent value="advanced">
          <div className="text-center py-8 text-gray-500">
            <p>Configurações avançadas em desenvolvimento...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
