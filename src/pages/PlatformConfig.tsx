import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePlatformConfig, useUpdatePlatformConfig } from '@/hooks/usePlatformConfig';
import { Loader2 } from 'lucide-react';

interface ConfigData {
  comissao_padrao?: number;
  dias_validade_orcamento?: number;
  enviar_email_confirmacao?: boolean;
  whatsapp_ativo?: boolean;
  enviar_sms_lembrete?: boolean;
  politica_cancelamento?: string;
  termos_uso_url?: string;
  politica_privacidade_url?: string;
}

export default function PlatformConfig() {
  const { data: config, isLoading } = usePlatformConfig();
  const updateConfig = useUpdatePlatformConfig();
  
  const [formData, setFormData] = useState({
    nome: '',
    comissao_padrao: 15,
    dias_validade_orcamento: 30,
    enviar_email_confirmacao: true,
    whatsapp_ativo: false,
    enviar_sms_lembrete: false,
    politica_cancelamento: '24h de antecedência',
    termos_uso_url: '',
    politica_privacidade_url: '',
  });

  React.useEffect(() => {
    if (config) {
      const configData = (config.configuracoes || {}) as ConfigData;
      setFormData({
        nome: config.nome || '',
        comissao_padrao: configData.comissao_padrao || 15,
        dias_validade_orcamento: configData.dias_validade_orcamento || 30,
        enviar_email_confirmacao: configData.enviar_email_confirmacao ?? true,
        whatsapp_ativo: configData.whatsapp_ativo || false,
        enviar_sms_lembrete: configData.enviar_sms_lembrete || false,
        politica_cancelamento: configData.politica_cancelamento || '24h de antecedência',
        termos_uso_url: configData.termos_uso_url || '',
        politica_privacidade_url: configData.politica_privacidade_url || '',
      });
    }
  }, [config]);

  const handleUpdate = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveNome = () => {
    updateConfig.mutate({ nome: formData.nome });
  };

  const handleSaveConfig = (field: keyof ConfigData) => {
    const configData = (config?.configuracoes || {}) as ConfigData;
    updateConfig.mutate({
      configuracoes: {
        ...configData,
        [field]: formData[field],
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações da Plataforma</h1>
        <p className="text-muted-foreground mt-2">
          Configure parâmetros globais do sistema AgendaJá
        </p>
      </div>
      
      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="negocio">Negócio</TabsTrigger>
          <TabsTrigger value="integracoes">Integrações</TabsTrigger>
          <TabsTrigger value="horarios">Horários</TabsTrigger>
          <TabsTrigger value="politicas">Políticas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="geral" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>Configurações básicas da plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Plataforma</Label>
                <Input 
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleUpdate('nome', e.target.value)}
                  onBlur={handleSaveNome}
                  placeholder="AgendaJá"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="codigo">Código do Sistema</Label>
                <Input 
                  id="codigo"
                  value={config?.codigo || ''} 
                  disabled 
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                  Código único do sistema (não editável)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Organização</Label>
                <Input 
                  id="tipo"
                  value={config?.tipo_organizacao || 'clinica'} 
                  disabled 
                  className="bg-muted"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="negocio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Negócio</CardTitle>
              <CardDescription>Configure parâmetros operacionais e comerciais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="comissao">Comissão Padrão (%)</Label>
                <Input 
                  id="comissao"
                  type="number" 
                  min="0"
                  max="100"
                  step="0.5"
                  value={formData.comissao_padrao}
                  onChange={(e) => handleUpdate('comissao_padrao', parseFloat(e.target.value))}
                  onBlur={() => handleSaveConfig('comissao_padrao')}
                />
                <p className="text-sm text-muted-foreground">
                  Percentual de comissão aplicado aos prestadores por padrão
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="validade">Validade de Orçamentos (dias)</Label>
                <Input 
                  id="validade"
                  type="number" 
                  min="1"
                  max="365"
                  value={formData.dias_validade_orcamento}
                  onChange={(e) => handleUpdate('dias_validade_orcamento', parseInt(e.target.value))}
                  onBlur={() => handleSaveConfig('dias_validade_orcamento')}
                />
                <p className="text-sm text-muted-foreground">
                  Período padrão antes do orçamento expirar automaticamente
                </p>
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="email-confirmacao">Enviar Email de Confirmação</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar email automático após cada agendamento
                  </p>
                </div>
                <Switch 
                  id="email-confirmacao"
                  checked={formData.enviar_email_confirmacao}
                  onCheckedChange={(checked) => {
                    handleUpdate('enviar_email_confirmacao', checked);
                    const configData = (config?.configuracoes || {}) as ConfigData;
                    updateConfig.mutate({
                      configuracoes: {
                        ...configData,
                        enviar_email_confirmacao: checked,
                      },
                    });
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integracoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrações Externas</CardTitle>
              <CardDescription>Ative e configure serviços de terceiros</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="whatsapp">WhatsApp Business API</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar envio de mensagens via WhatsApp
                  </p>
                </div>
                <Switch 
                  id="whatsapp"
                  checked={formData.whatsapp_ativo}
                  onCheckedChange={(checked) => {
                    handleUpdate('whatsapp_ativo', checked);
                    const configData = (config?.configuracoes || {}) as ConfigData;
                    updateConfig.mutate({
                      configuracoes: {
                        ...configData,
                        whatsapp_ativo: checked,
                      },
                    });
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="sms">SMS (Twilio)</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar lembretes e notificações via SMS
                  </p>
                </div>
                <Switch 
                  id="sms"
                  checked={formData.enviar_sms_lembrete}
                  onCheckedChange={(checked) => {
                    handleUpdate('enviar_sms_lembrete', checked);
                    const configData = (config?.configuracoes || {}) as ConfigData;
                    updateConfig.mutate({
                      configuracoes: {
                        ...configData,
                        enviar_sms_lembrete: checked,
                      },
                    });
                  }}
                />
              </div>

              <div className="rounded-lg border p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  <strong>Nota:</strong> As chaves de API devem ser configuradas nas variáveis de ambiente do sistema.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="horarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Horário de Funcionamento</CardTitle>
              <CardDescription>Defina o horário padrão de operação da plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {config?.horario_funcionamento && Object.entries(config.horario_funcionamento)
                  .sort(([a], [b]) => {
                    const ordem = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
                    return ordem.indexOf(a) - ordem.indexOf(b);
                  })
                  .map(([dia, horario]: [string, any]) => (
                    <div key={dia} className="flex items-center gap-4 p-4 rounded-lg border">
                      <Label className="w-24 capitalize font-medium">{dia}</Label>
                      {horario.fechado ? (
                        <span className="text-muted-foreground">Fechado</span>
                      ) : (
                        <>
                          <Input 
                            type="time" 
                            value={horario.abertura || '08:00'}
                            className="w-32"
                            disabled
                          />
                          <span className="text-muted-foreground">até</span>
                          <Input 
                            type="time" 
                            value={horario.fechamento || '18:00'}
                            className="w-32"
                            disabled
                          />
                        </>
                      )}
                    </div>
                  ))}
                  
                <p className="text-sm text-muted-foreground mt-4">
                  <strong>Nota:</strong> Edição de horários será implementada em versão futura.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="politicas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Termos e Políticas</CardTitle>
              <CardDescription>Configure políticas e links para documentos legais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cancelamento">Política de Cancelamento</Label>
                <Input 
                  id="cancelamento"
                  value={formData.politica_cancelamento}
                  onChange={(e) => handleUpdate('politica_cancelamento', e.target.value)}
                  onBlur={() => handleSaveConfig('politica_cancelamento')}
                  placeholder="Ex: 24h de antecedência"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="termos">URL dos Termos de Uso</Label>
                <Input 
                  id="termos"
                  type="url"
                  placeholder="https://exemplo.com/termos"
                  value={formData.termos_uso_url}
                  onChange={(e) => handleUpdate('termos_uso_url', e.target.value)}
                  onBlur={() => handleSaveConfig('termos_uso_url')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="privacidade">URL da Política de Privacidade</Label>
                <Input 
                  id="privacidade"
                  type="url"
                  placeholder="https://exemplo.com/privacidade"
                  value={formData.politica_privacidade_url}
                  onChange={(e) => handleUpdate('politica_privacidade_url', e.target.value)}
                  onBlur={() => handleSaveConfig('politica_privacidade_url')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
