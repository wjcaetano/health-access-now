import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, Eye, Loader2 } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface PrestadorPendente {
  id: string;
  email: string;
  nome: string;
  status: string;
  created_at: string;
  raw_user_meta_data?: {
    documento?: string;
    telefone?: string;
    tipo?: 'pf' | 'pj';
    especialidades?: string;
  };
}

export default function AprovacoesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPrestador, setSelectedPrestador] = useState<PrestadorPendente | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Buscar prestadores pendentes
  const { data: prestadores, isLoading } = useQuery({
    queryKey: ['prestadores-pendentes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, nome, status, created_at')
        .eq('nivel_acesso', 'prestador')
        .eq('status', 'aguardando_aprovacao')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Por enquanto, retornar sem metadata adicional
      // Os dados completos estarão disponíveis após aprovação
      return (data || []).map(profile => ({
        ...profile,
        raw_user_meta_data: {
          documento: 'Disponível após aprovação',
          telefone: 'Disponível após aprovação',
          tipo: 'pf' as const,
          especialidades: 'Disponível após aprovação'
        }
      })) as PrestadorPendente[];
    }
  });

  // Aprovar prestador
  const aprovarMutation = useMutation({
    mutationFn: async (prestadorId: string) => {
      // 1. Atualizar status do profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ status: 'ativo' })
        .eq('id', prestadorId);

      if (profileError) throw profileError;

      // 2. Adicionar role 'prestador' na tabela user_roles
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: prestadorId,
          role: 'prestador',
          organizacao_id: null // prestadores não têm organizacao_id específica
        });

      // Ignorar erro se o role já existir
      if (roleError && !roleError.message.includes('duplicate')) {
        throw roleError;
      }

      // 3. Buscar dados do profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', prestadorId)
        .single();

      return profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prestadores-pendentes'] });
      toast({
        title: 'Prestador aprovado!',
        description: 'O prestador foi aprovado e já pode acessar o sistema.',
        variant: 'default'
      });
      setShowDetailsModal(false);
      setSelectedPrestador(null);
    },
    onError: (error) => {
      toast({
        title: 'Erro ao aprovar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      });
    }
  });

  // Rejeitar prestador
  const rejeitarMutation = useMutation({
    mutationFn: async ({ prestadorId, motivo }: { prestadorId: string; motivo: string }) => {
      // Atualizar status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          status: 'rejeitado',
          observacoes: motivo
        })
        .eq('id', prestadorId);

      if (profileError) throw profileError;

      // Aqui você poderia enviar um email com o motivo
      // usando uma edge function

      return { prestadorId, motivo };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prestadores-pendentes'] });
      toast({
        title: 'Prestador rejeitado',
        description: 'O prestador foi notificado sobre a rejeição.',
        variant: 'default'
      });
      setShowRejectModal(false);
      setShowDetailsModal(false);
      setSelectedPrestador(null);
      setRejectReason('');
    },
    onError: (error) => {
      toast({
        title: 'Erro ao rejeitar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      });
    }
  });

  const handleViewDetails = (prestador: PrestadorPendente) => {
    setSelectedPrestador(prestador);
    setShowDetailsModal(true);
  };

  const handleAprovar = () => {
    if (selectedPrestador) {
      aprovarMutation.mutate(selectedPrestador.id);
    }
  };

  const handleRejeitar = () => {
    if (selectedPrestador && rejectReason.trim()) {
      rejeitarMutation.mutate({
        prestadorId: selectedPrestador.id,
        motivo: rejectReason
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Aprovação de Prestadores</h2>
        <p className="text-muted-foreground mt-1">
          Gerencie os cadastros de prestadores aguardando aprovação
        </p>
      </div>

      {prestadores?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum prestador aguardando aprovação</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {prestadores?.map((prestador) => (
            <Card key={prestador.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{prestador.nome}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {prestador.email} • {prestador.raw_user_meta_data?.telefone || 'N/A'}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {prestador.raw_user_meta_data?.tipo === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Documento:</strong> {prestador.raw_user_meta_data?.documento || 'N/A'}
                  </p>
                  <p className="text-sm">
                    <strong>Cadastrado em:</strong>{' '}
                    {new Date(prestador.created_at).toLocaleDateString('pt-BR')}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(prestador)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Detalhes */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Prestador</DialogTitle>
            <DialogDescription>
              Revise as informações antes de aprovar ou rejeitar
            </DialogDescription>
          </DialogHeader>

          {selectedPrestador && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nome</Label>
                  <p className="font-medium">{selectedPrestador.nome}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tipo</Label>
                  <p className="font-medium">
                    {selectedPrestador.raw_user_meta_data?.tipo === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Documento</Label>
                  <p className="font-medium">{selectedPrestador.raw_user_meta_data?.documento || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedPrestador.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Telefone</Label>
                  <p className="font-medium">{selectedPrestador.raw_user_meta_data?.telefone || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data de Cadastro</Label>
                  <p className="font-medium">
                    {new Date(selectedPrestador.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Especialidades</Label>
                <p className="mt-1 text-sm">{selectedPrestador.raw_user_meta_data?.especialidades || 'N/A'}</p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(true);
                setShowDetailsModal(false);
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejeitar
            </Button>
            <Button
              onClick={handleAprovar}
              disabled={aprovarMutation.isPending}
            >
              {aprovarMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Aprovar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Rejeição */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Cadastro</DialogTitle>
            <DialogDescription>
              Informe o motivo da rejeição. O prestador receberá um email com esta informação.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="motivo">Motivo da Rejeição *</Label>
              <Textarea
                id="motivo"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explique o motivo da rejeição..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false);
                setShowDetailsModal(true);
                setRejectReason('');
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejeitar}
              disabled={!rejectReason.trim() || rejeitarMutation.isPending}
            >
              {rejeitarMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
