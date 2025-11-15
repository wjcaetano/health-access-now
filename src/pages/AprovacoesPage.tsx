import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock, FileText, Mail, Phone, MapPin } from 'lucide-react';
import { usePrestadoresPendentes, useAprovarPrestador, useReprovarPrestador } from '@/hooks/useAprovacoes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function AprovacoesPage() {
  const { data: pendentes, isLoading } = usePrestadoresPendentes();
  const aprovar = useAprovarPrestador();
  const reprovar = useReprovarPrestador();

  const [selectedPrestador, setSelectedPrestador] = useState<any>(null);
  const [showReprovarDialog, setShowReprovarDialog] = useState(false);
  const [motivoReprovacao, setMotivoReprovacao] = useState('');

  const handleAprovar = (prestador: any) => {
    if (confirm(`Aprovar cadastro de ${prestador.nome}?`)) {
      aprovar.mutate(prestador.id);
    }
  };

  const handleReprovar = () => {
    if (!motivoReprovacao.trim()) {
      alert('Digite o motivo da reprovação');
      return;
    }
    reprovar.mutate({
      prestadorId: selectedPrestador.id,
      motivo: motivoReprovacao,
    });
    setShowReprovarDialog(false);
    setMotivoReprovacao('');
    setSelectedPrestador(null);
  };

  const openReprovarDialog = (prestador: any) => {
    setSelectedPrestador(prestador);
    setShowReprovarDialog(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Aprovações Pendentes</h1>
        <p className="text-muted-foreground">Gerencie solicitações de cadastro de prestadores</p>
      </div>

      {pendentes?.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Nenhuma aprovação pendente
              </h3>
              <p className="text-muted-foreground">
                Todas as solicitações foram processadas.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {pendentes?.map((profile) => (
            <Card key={profile.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {profile.nome || profile.email}
                      <Badge variant="secondary">
                        {profile.prestadores?.tipo === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Cadastrado em {format(new Date(profile.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </p>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" />
                    Aguardando Aprovação
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.prestadores && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.prestadores.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.prestadores.telefone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>CNPJ: {profile.prestadores.cnpj}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {profile.prestadores.endereco && (
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span>{profile.prestadores.endereco}</span>
                        </div>
                      )}
                      {profile.prestadores.especialidades && profile.prestadores.especialidades.length > 0 && (
                        <div className="flex items-start gap-2 text-sm">
                          <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div className="flex flex-wrap gap-1">
                            {profile.prestadores.especialidades.map((esp: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {esp}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleAprovar(profile)}
                    className="flex-1"
                    disabled={aprovar.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {aprovar.isPending ? 'Aprovando...' : 'Aprovar Cadastro'}
                  </Button>
                  <Button
                    onClick={() => openReprovarDialog(profile)}
                    variant="destructive"
                    className="flex-1"
                    disabled={reprovar.isPending}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reprovar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de Reprovação */}
      <Dialog open={showReprovarDialog} onOpenChange={setShowReprovarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprovar Cadastro</DialogTitle>
            <DialogDescription>
              Informe o motivo da reprovação. O prestador será notificado por email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo da Reprovação *</Label>
              <Textarea
                id="motivo"
                value={motivoReprovacao}
                onChange={(e) => setMotivoReprovacao(e.target.value)}
                placeholder="Ex: Documentação incompleta, dados inválidos, etc."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowReprovarDialog(false);
                setMotivoReprovacao('');
                setSelectedPrestador(null);
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReprovar}
              disabled={reprovar.isPending}
            >
              {reprovar.isPending ? 'Reprovando...' : 'Confirmar Reprovação'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
