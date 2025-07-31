import React, { useState } from 'react';
import { Plus, Mail, Clock, CheckCircle, XCircle, User } from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const SimplifiedTenantInviteManager: React.FC = () => {
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    nome: '',
    nivel_acesso: 'colaborador'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentTenant || !user) {
      toast({
        title: "Erro",
        description: "Dados de contexto não disponíveis.",
        variant: "destructive",
      });
      return;
    }

    // Simplified - just show success for now
    toast({
      title: "Convite criado",
      description: "Funcionalidade será implementada em breve.",
    });
    
    setFormData({ email: '', nome: '', nivel_acesso: 'colaborador' });
    setIsDialogOpen(false);
  };

  if (!currentTenant) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Convites</CardTitle>
          <CardDescription>
            Carregando dados da unidade...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Gerenciar Convites - {currentTenant.nome}
          </CardTitle>
          <CardDescription>
            Convide novos usuários para acessar sua unidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Criar Convite
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Convite</DialogTitle>
                <DialogDescription>
                  Preencha os dados para convidar um novo usuário
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Digite o email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nivel_acesso">Nível de Acesso</Label>
                  <Select value={formData.nivel_acesso} onValueChange={(value) => setFormData(prev => ({ ...prev, nivel_acesso: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="colaborador">Colaborador</SelectItem>
                      <SelectItem value="atendente">Atendente</SelectItem>
                      <SelectItem value="gerente">Gerente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Criar Convite
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Convites Pendentes</CardTitle>
          <CardDescription>
            Lista de convites enviados aguardando aceite
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum convite pendente no momento</p>
            <p className="text-sm">Crie um convite para começar</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};