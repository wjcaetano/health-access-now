
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Clock, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar,
  Plus,
  Edit,
  Trash,
  Play,
  Pause
} from "lucide-react";

interface FollowUpRule {
  id: string;
  name: string;
  trigger: 'status_change' | 'time_based' | 'score_change';
  condition: string;
  action: 'email' | 'sms' | 'whatsapp' | 'task' | 'call';
  delay: number; // em dias
  template: string;
  active: boolean;
}

interface FollowUpAutomationProps {
  onCreateRule?: (rule: Omit<FollowUpRule, 'id'>) => void;
  onUpdateRule?: (ruleId: string, rule: Partial<FollowUpRule>) => void;
  onDeleteRule?: (ruleId: string) => void;
}

export const FollowUpAutomation = ({ 
  onCreateRule, 
  onUpdateRule, 
  onDeleteRule 
}: FollowUpAutomationProps) => {
  const [rules, setRules] = useState<FollowUpRule[]>([
    {
      id: '1',
      name: 'Boas-vindas para novos leads',
      trigger: 'status_change',
      condition: 'status = novo',
      action: 'email',
      delay: 0,
      template: 'Obrigado pelo seu interesse em nossa franquia! Em breve entraremos em contato.',
      active: true
    },
    {
      id: '2',
      name: 'Follow-up após qualificação',
      trigger: 'status_change',
      condition: 'status = qualificado',
      action: 'whatsapp',
      delay: 1,
      template: 'Olá {nome}! Vamos agendar uma apresentação da franquia?',
      active: true
    },
    {
      id: '3',
      name: 'Reengajamento leads inativos',
      trigger: 'time_based',
      condition: 'sem_atividade > 7 dias',
      action: 'email',
      delay: 7,
      template: 'Ainda tem interesse em nossa franquia? Vamos conversar!',
      active: false
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [newRule, setNewRule] = useState<Partial<FollowUpRule>>({
    name: '',
    trigger: 'status_change',
    condition: '',
    action: 'email',
    delay: 0,
    template: '',
    active: true
  });

  const triggerOptions = [
    { value: 'status_change', label: 'Mudança de Status' },
    { value: 'time_based', label: 'Baseado em Tempo' },
    { value: 'score_change', label: 'Mudança de Score' }
  ];

  const actionOptions = [
    { value: 'email', label: 'E-mail', icon: Mail },
    { value: 'sms', label: 'SMS', icon: Phone },
    { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { value: 'task', label: 'Criar Tarefa', icon: Calendar },
    { value: 'call', label: 'Agendar Ligação', icon: Phone }
  ];

  const handleCreateRule = () => {
    if (newRule.name && newRule.condition && newRule.template) {
      const rule: FollowUpRule = {
        id: Date.now().toString(),
        name: newRule.name,
        trigger: newRule.trigger || 'status_change',
        condition: newRule.condition,
        action: newRule.action || 'email',
        delay: newRule.delay || 0,
        template: newRule.template,
        active: newRule.active || true
      };
      
      setRules([...rules, rule]);
      onCreateRule?.(rule);
      setNewRule({
        name: '',
        trigger: 'status_change',
        condition: '',
        action: 'email',
        delay: 0,
        template: '',
        active: true
      });
      setIsCreating(false);
    }
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId 
        ? { ...rule, active: !rule.active }
        : rule
    ));
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      onUpdateRule?.(ruleId, { active: !rule.active });
    }
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
    onDeleteRule?.(ruleId);
  };

  const getActionIcon = (action: string) => {
    const option = actionOptions.find(opt => opt.value === action);
    return option?.icon || Mail;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Automação de Follow-up</CardTitle>
              <CardDescription>
                Configure regras automáticas para contato com leads
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Regra
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{rules.length}</div>
              <div className="text-sm text-muted-foreground">Total de Regras</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {rules.filter(r => r.active).length}
              </div>
              <div className="text-sm text-muted-foreground">Ativas</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">247</div>
              <div className="text-sm text-muted-foreground">Executadas (30d)</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-600">78%</div>
              <div className="text-sm text-muted-foreground">Taxa de Abertura</div>
            </div>
          </div>

          {/* Lista de Regras */}
          <div className="space-y-4">
            {rules.map((rule) => {
              const ActionIcon = getActionIcon(rule.action);
              return (
                <div key={rule.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{rule.name}</h3>
                        <Badge variant={rule.active ? "default" : "secondary"}>
                          {rule.active ? "Ativa" : "Inativa"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Gatilho:</span>
                          <div className="font-medium">
                            {triggerOptions.find(t => t.value === rule.trigger)?.label}
                          </div>
                          <div className="text-muted-foreground">{rule.condition}</div>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground">Ação:</span>
                          <div className="flex items-center gap-1 font-medium">
                            <ActionIcon className="h-4 w-4" />
                            {actionOptions.find(a => a.value === rule.action)?.label}
                          </div>
                          {rule.delay > 0 && (
                            <div className="text-muted-foreground">
                              Aguardar {rule.delay} dia(s)
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground">Template:</span>
                          <div className="font-medium truncate">{rule.template}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Switch
                        checked={rule.active}
                        onCheckedChange={() => handleToggleRule(rule.id)}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingRule(rule.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Formulário de Nova Regra */}
          {isCreating && (
            <div className="mt-6 p-4 border rounded-lg bg-muted">
              <h3 className="font-medium mb-4">Nova Regra de Automação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rule-name">Nome da Regra</Label>
                  <Input
                    id="rule-name"
                    value={newRule.name || ''}
                    onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                    placeholder="Ex: Boas-vindas novos leads"
                  />
                </div>
                
                <div>
                  <Label htmlFor="rule-trigger">Gatilho</Label>
                  <Select
                    value={newRule.trigger}
                    onValueChange={(value) => setNewRule({...newRule, trigger: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {triggerOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="rule-condition">Condição</Label>
                  <Input
                    id="rule-condition"
                    value={newRule.condition || ''}
                    onChange={(e) => setNewRule({...newRule, condition: e.target.value})}
                    placeholder="Ex: status = novo"
                  />
                </div>
                
                <div>
                  <Label htmlFor="rule-action">Ação</Label>
                  <Select
                    value={newRule.action}
                    onValueChange={(value) => setNewRule({...newRule, action: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {actionOptions.map(option => {
                        const Icon = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="rule-delay">Atraso (dias)</Label>
                  <Input
                    id="rule-delay"
                    type="number"
                    value={newRule.delay || 0}
                    onChange={(e) => setNewRule({...newRule, delay: parseInt(e.target.value) || 0})}
                    min="0"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="rule-template">Template da Mensagem</Label>
                  <Textarea
                    id="rule-template"
                    value={newRule.template || ''}
                    onChange={(e) => setNewRule({...newRule, template: e.target.value})}
                    placeholder="Digite o template da mensagem. Use {nome} para personalizar."
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button onClick={handleCreateRule}>Criar Regra</Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
