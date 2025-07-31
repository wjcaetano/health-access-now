
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeSettings from "@/components/settings/ThemeSettings";
import PWAInstaller from "@/components/pwa/PWAInstaller";
import NotificationsPanel from "@/components/usuarios/NotificationsPanel";

export default function SystemSettings() {
  return (
    <div className="space-y-6 bg-white text-gray-900 min-h-screen" style={{ backgroundColor: '#ffffff', color: '#1f2937' }}>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
        <p className="text-gray-600 mt-2">Gerencie as configurações avançadas do sistema</p>
      </div>

      <Tabs defaultValue="theme" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="theme" 
            className="data-[state=active]:bg-white data-[state=active]:text-agendaja-primary data-[state=active]:shadow-sm"
          >
            Tema
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="data-[state=active]:bg-white data-[state=active]:text-agendaja-primary data-[state=active]:shadow-sm"
          >
            Notificações
          </TabsTrigger>
          <TabsTrigger 
            value="pwa"
            className="data-[state=active]:bg-white data-[state=active]:text-agendaja-primary data-[state=active]:shadow-sm"
          >
            PWA
          </TabsTrigger>
          <TabsTrigger 
            value="advanced"
            className="data-[state=active]:bg-white data-[state=active]:text-agendaja-primary data-[state=active]:shadow-sm"
          >
            Avançado
          </TabsTrigger>
        </TabsList>

        <TabsContent value="theme" className="bg-white">
          <ThemeSettings />
        </TabsContent>

        <TabsContent value="notifications" className="bg-white">
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <NotificationsPanel />
          </div>
        </TabsContent>

        <TabsContent value="pwa" className="bg-white">
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <PWAInstaller />
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="bg-white">
          <div className="text-center py-12 text-gray-500 bg-white border border-gray-200 rounded-lg">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Configurações Avançadas</h3>
              <p className="text-gray-500">Funcionalidades avançadas em desenvolvimento...</p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Em breve: Configurações de backup, integrações e personalização avançada.</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
