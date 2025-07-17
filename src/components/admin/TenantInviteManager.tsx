
import React, { useState } from 'react';
import { Plus, Mail, Clock, CheckCircle, XCircle, User } from 'lucide-react';
import { useTenantInvites, useCreateTenantInvite, useCancelTenantInvite } from '@/hooks/useTenantInvites';
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
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const TenantInviteManager: React.FC = () => {
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    nome: '',
    nivel_acesso: 'colaborador'
  });

  const { data: invites = [], isLoading } = useTenantInvites(currentTenant?.id);
  const { mutate: createInvite, isPending: isCreating } = useCreateTenantInvite();
  const { mutate: cancelInvite } = useCancelTenantInvite();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentTenant || !user) return;

    createInvite(
      {
        tenant_id: currentTenant.id,
        invited_by: user.id,
        ...formData
      },
      {
        onSuccess: () => {
          toast({
            title: "Convite enviado!",
            description: "O convite foi criado com sucesso.",
          });
          setFormData({ email: '', nome: '', nivel_acesso: 'colaborador' });
          setIsDialogOpen(false);
        },
        onError: (error) => {
          console.error('Erro ao criar convite:', error);
          toast({
            title: "Erro",
            description: "Erro ao criar convite. Tente novamente.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleCancel = (inviteId: string) => {
    cancelInvite(inviteId, {
      onSuccess: () => {
        toast({
          title: "Convite cancelado",
          description: "O convite foi cancelado com sucesso.",
        });
      },
      onError: (error) => {
        console.error('Erro ao cancelar convite:', error);
        toast({
          title: "Erro",
          description: "Erro ao cancelar convite.",
          variant: "destructive",
        });
      },
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'aceito':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelado':
      case 'expirado':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'secondary';
      case 'aceito':
        return 'default';
      case 'cancelado':
      case 'expirado':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (!currentTenant) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Convites</CardTitle>
          <CardDescription>
            Selecione um contexto para gerenciar convites
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestão de Convites</CardTitle>
            <CardDescription>
              Gerencie convites para o contexto: {currentTenant.nome}
            </CardDescription>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Convite
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Convite</DialogTitle>
                <DialogDescription>
                  Envie um convite para um novo usuário se juntar ao contexto
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>
                
                <div className="space-y-2">
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
                
                <div className="space-y-2">
                  <Label htmlFor="nivel_acesso">Nível de Acesso</Label>
                  <Select
                    value={formData.nivel_acesso}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, nivel_acesso: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="colaborador">Colaborador</SelectItem>
                      <SelectItem value="atendente">Atendente</SelectItem>
                      <SelectItem value="gerente">Gerente</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="prestador">Prestador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isCreating}
                    className="flex-1"
                  >
                    {isCreating ? 'Criando...' : 'Criar Convite'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando convites...</div>
          ) : invites.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum convite encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invites.map((invite) => (
                <div 
                  key={invite.id} 
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(invite.status)}
                    <div>
                      <div className="font-medium">{invite.nome}</div>
                      <div className="text-sm text-muted-foreground">{invite.email}</div>
                      <div className="text-xs text-muted-foreground">
                        Criado em {format(new Date(invite.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{invite.nivel_acesso}</Badge>
                    <Badge variant={getStatusColor(invite.status)}>
                      {invite.status}
                    </Badge>
                    
                    {invite.status === 'pendente' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(invite.id)}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
