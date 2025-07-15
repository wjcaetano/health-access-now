
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeSettings() {
  const { theme, setTheme, isDark } = useTheme();

  const themes = [
    {
      id: 'light' as const,
      name: 'Claro',
      description: 'Tema claro para uso durante o dia',
      icon: <Sun className="h-5 w-5" />
    },
    {
      id: 'dark' as const,
      name: 'Escuro',
      description: 'Tema escuro para reduzir fadiga visual',
      icon: <Moon className="h-5 w-5" />
    },
    {
      id: 'system' as const,
      name: 'Sistema',
      description: 'Segue a preferência do sistema operacional',
      icon: <Monitor className="h-5 w-5" />
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configurações de Tema</h2>
        <p className="text-gray-600">Personalize a aparência do sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selecionar Tema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map(themeOption => (
              <div
                key={themeOption.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  theme === themeOption.id
                    ? 'border-agendaja-primary bg-agendaja-light'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setTheme(themeOption.id)}
              >
                <div className="flex items-center gap-3 mb-2">
                  {themeOption.icon}
                  <h3 className="font-medium">{themeOption.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{themeOption.description}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Pré-visualização</h4>
            <div className={`p-4 border rounded-lg ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200'}`}>
              <h5 className="font-medium mb-2">Exemplo de Interface</h5>
              <div className="space-y-2">
                <div className={`h-2 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                <div className={`h-2 w-3/4 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                <div className={`h-2 w-1/2 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
              </div>
              <Button 
                size="sm" 
                className="mt-3"
                variant={isDark ? 'secondary' : 'default'}
              >
                Botão de Exemplo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações Avançadas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Tema Atual</h4>
                <p className="text-sm text-gray-600">
                  {themes.find(t => t.id === theme)?.name} 
                  {theme === 'system' && ` (${isDark ? 'Escuro' : 'Claro'})`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Sincronização Automática</h4>
                <p className="text-sm text-gray-600">
                  Alterna automaticamente entre claro e escuro
                </p>
              </div>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('system')}
              >
                {theme === 'system' ? 'Ativado' : 'Ativar'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
