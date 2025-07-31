
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
    <div className="space-y-6 bg-white text-gray-900" style={{ backgroundColor: '#ffffff', color: '#1f2937' }}>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configurações de Tema</h2>
        <p className="text-gray-600">Personalize a aparência do sistema</p>
      </div>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Selecionar Tema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map(themeOption => (
              <div
                key={themeOption.id}
                className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                  theme === themeOption.id
                    ? 'border-agendaja-primary bg-gradient-to-br from-agendaja-primary/5 to-agendaja-secondary/5 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-agendaja-primary/30 hover:shadow-md'
                }`}
                onClick={() => setTheme(themeOption.id)}
              >
                {theme === themeOption.id && (
                  <div className="absolute top-3 right-3 w-3 h-3 bg-agendaja-primary rounded-full animate-pulse"></div>
                )}
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-3 rounded-full ${
                    theme === themeOption.id 
                      ? 'bg-agendaja-primary text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {themeOption.icon}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg ${
                      theme === themeOption.id ? 'text-agendaja-primary' : 'text-gray-900'
                    }`}>
                      {themeOption.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{themeOption.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h4 className="font-semibold mb-4 text-gray-900">Pré-visualização</h4>
            <div className="p-6 border-2 border-gray-200 rounded-xl bg-gray-50">
              <h5 className="font-semibold mb-4 text-gray-900">Exemplo de Interface</h5>
              <div className="space-y-3">
                <div className="h-3 rounded-full bg-gradient-to-r from-agendaja-primary to-agendaja-secondary opacity-80"></div>
                <div className="h-3 w-3/4 rounded-full bg-gray-300"></div>
                <div className="h-3 w-1/2 rounded-full bg-gray-200"></div>
              </div>
              <Button 
                size="sm" 
                className="mt-4 bg-agendaja-primary hover:bg-agendaja-primary/90 text-white"
              >
                Botão de Exemplo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Configurações Avançadas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">Tema Atual</h4>
                <p className="text-sm text-gray-600">
                  {themes.find(t => t.id === theme)?.name} 
                  {theme === 'system' && ` (${isDark ? 'Escuro' : 'Claro'})`}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                theme === 'light' ? 'bg-yellow-100 text-yellow-800' :
                theme === 'dark' ? 'bg-gray-800 text-white' :
                'bg-blue-100 text-blue-800'
              }`}>
                {themes.find(t => t.id === theme)?.name}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">Sincronização Automática</h4>
                <p className="text-sm text-gray-600">
                  Alterna automaticamente entre claro e escuro baseado no sistema
                </p>
              </div>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('system')}
                className={theme === 'system' ? 'bg-agendaja-primary hover:bg-agendaja-primary/90' : ''}
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
