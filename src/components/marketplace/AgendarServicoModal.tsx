import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMarketplaceAgendamento } from '@/hooks/useMarketplaceAgendamento';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Calendar as CalendarIcon, Clock, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Servico {
  id: string;
  nome: string;
  descricao?: string;
  valor_venda: number;
  tempo_estimado?: string;
  prestador_id: string;
  prestador?: {
    nome: string;
    media_avaliacoes: number;
  };
}

interface AgendarServicoModalProps {
  servico: Servico;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HORARIOS_DISPONIVEIS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

export const AgendarServicoModal: React.FC<AgendarServicoModalProps> = ({
  servico,
  open,
  onOpenChange
}) => {
  const { profile } = useAuth();
  const [dataAgendamento, setDataAgendamento] = useState<Date>();
  const [horario, setHorario] = useState<string>('');
  const agendarMutation = useMarketplaceAgendamento();

  const handleAgendar = () => {
    if (!profile?.cliente_id || !dataAgendamento || !horario) {
      return;
    }

    agendarMutation.mutate({
      clienteId: profile.cliente_id,
      servicoId: servico.id,
      prestadorId: servico.prestador_id,
      dataAgendamento,
      horario
    }, {
      onSuccess: () => {
        onOpenChange(false);
        setDataAgendamento(undefined);
        setHorario('');
      }
    });
  };

  const isFormValid = dataAgendamento && horario;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Agendar Serviço</DialogTitle>
          <DialogDescription>
            Selecione a data e horário desejados para o serviço
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo do Serviço */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">{servico.nome}</h3>
            {servico.descricao && (
              <p className="text-sm text-muted-foreground">{servico.descricao}</p>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="text-sm text-muted-foreground">
                {servico.prestador?.nome}
              </div>
              <div className="flex items-center gap-1 text-primary font-semibold">
                <DollarSign className="h-4 w-4" />
                {formatCurrency(servico.valor_venda)}
              </div>
            </div>
          </div>

          {/* Seleção de Data */}
          <div className="space-y-2">
            <Label>Data do Agendamento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dataAgendamento && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataAgendamento ? (
                    format(dataAgendamento, "PPP", { locale: ptBR })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dataAgendamento}
                  onSelect={setDataAgendamento}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Seleção de Horário */}
          <div className="space-y-2">
            <Label>Horário</Label>
            <Select value={horario} onValueChange={setHorario}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um horário">
                  {horario && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {horario}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {HORARIOS_DISPONIVEIS.map((h) => (
                  <SelectItem key={h} value={h}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {h}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pré-visualização */}
          {isFormValid && (
            <div className="bg-primary/10 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">Resumo do Agendamento</h4>
              <div className="text-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Serviço:</span>
                  <span className="font-medium">{servico.nome}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Data:</span>
                  <span className="font-medium">
                    {format(dataAgendamento, "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Horário:</span>
                  <span className="font-medium">{horario}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-primary/20">
                  <span className="text-muted-foreground">Valor:</span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(servico.valor_venda)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={agendarMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAgendar}
            disabled={!isFormValid || agendarMutation.isPending}
          >
            {agendarMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Confirmar Agendamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
