
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Download, Check, Wifi, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for online/offline events
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      
      if (choice.outcome === 'accepted') {
        toast({
          title: 'App instalado com sucesso!',
          description: 'O AgendaJa foi adicionado à sua tela inicial.'
        });
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      toast({
        title: 'Erro na instalação',
        description: 'Não foi possível instalar o app.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Progressive Web App</h2>
        <p className="text-gray-600">Instale o AgendaJa em seu dispositivo</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {isOnline ? (
                <Wifi className="h-6 w-6 text-green-500" />
              ) : (
                <WifiOff className="h-6 w-6 text-red-500" />
              )}
              <div>
                <h4 className="font-medium">Status da Conexão</h4>
                <p className="text-sm text-gray-600">
                  {isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {isInstalled ? (
                <Check className="h-6 w-6 text-green-500" />
              ) : (
                <Smartphone className="h-6 w-6 text-blue-500" />
              )}
              <div>
                <h4 className="font-medium">Status de Instalação</h4>
                <p className="text-sm text-gray-600">
                  {isInstalled ? 'App instalado' : 'Não instalado'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Installation Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Instalar Aplicativo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isInstalled ? (
            <div className="text-center py-8">
              <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">App já instalado!</h3>
              <p className="text-gray-600">
                O AgendaJa está instalado e pronto para uso offline.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-4">
                <Smartphone className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Instale o AgendaJa</h3>
                <p className="text-gray-600 mb-4">
                  Tenha acesso rápido ao sistema direto da sua tela inicial, 
                  com funcionalidade offline e notificações push.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Benefícios da instalação:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Acesso offline a dados importantes</li>
                  <li>• Notificações push em tempo real</li>
                  <li>• Inicialização mais rápida</li>
                  <li>• Interface otimizada para dispositivos móveis</li>
                  <li>• Sincronização automática quando voltar online</li>
                </ul>
              </div>

              {deferredPrompt ? (
                <Button onClick={handleInstallClick} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Instalar Aplicativo
                </Button>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">
                    Para instalar o app, use o menu do seu navegador ou 
                    procure pela opção "Adicionar à tela inicial".
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features Card */}
      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades Offline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-700">Disponível Offline:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Visualizar agendamentos do dia</li>
                <li>• Consultar dados de clientes</li>
                <li>• Acessar informações de serviços</li>
                <li>• Navegar pelo dashboard</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-orange-700">Requer Conexão:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Criar novos registros</li>
                <li>• Sincronizar dados</li>
                <li>• Enviar notificações</li>
                <li>• Gerar relatórios</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
