
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, MapPin, Phone } from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAgendamentos } from "@/hooks/useAgendamentos";
import { Badge } from "@/components/ui/badge";

interface AgendaOnlineProps {
  prestadorId: string;
}

const AgendaOnline: React.FC<AgendaOnlineProps> = ({ prestadorId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: agendamentos, isLoading } = useAgendamentos();

  // Filtrar agendamentos do prestador
  const agendamentosPrestador = agendamentos?.filter(
    a => a.prestador_id === prestadorId
  ) || [];

  // Filtrar agendamentos da data selecionada
  const agendamentosData = agendamentosPrestador.filter(a =>
    isSameDay(new Date(a.data_agendamento), selectedDate)
  );

  // Gerar próximos 7 dias
  const proximosDias = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Seletor de Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agenda da Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {proximosDias.map((dia) => {
              const agendamentosDia = agendamentosPrestador.filter(a =>
                isSameDay(new Date(a.data_agendamento), dia)
              );
              const isSelected = isSameDay(dia, selectedDate);

              return (
                <Button
                  key={dia.toISOString()}
                  variant={isSelected ? "default" : "outline"}
                  className="flex flex-col h-auto p-3"
                  onClick={() => setSelectedDate(dia)}
                >
                  <span className="text-xs">
                    {format(dia, "EEE", { locale: ptBR })}
                  </span>
                  <span className="text-lg font-bold">
                    {format(dia, "dd")}
                  </span>
                  {agendamentosDia.length > 0 && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {agendamentosDia.length}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Agendamentos do Dia */}
      <Card>
        <CardHeader>
          <CardTitle>
            Agendamentos - {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {agendamentosData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum agendamento para este dia</p>
            </div>
          ) : (
            <div className="space-y-4">
              {agendamentosData.map((agendamento) => (
                <div
                  key={agendamento.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {format(new Date(`2000-01-01T${agendamento.horario}`), "HH:mm")}
                      </span>
                    </div>
                    <Badge className={getStatusColor(agendamento.status)}>
                      {agendamento.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{agendamento.clientes?.nome || 'Cliente não identificado'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{agendamento.clientes?.telefone || 'Telefone não informado'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        <strong>Serviço:</strong> {agendamento.servicos?.nome || 'Serviço não identificado'}
                      </div>
                      {agendamento.observacoes && (
                        <div className="text-sm text-gray-600">
                          <strong>Observações:</strong> {agendamento.observacoes}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      Confirmar
                    </Button>
                    <Button size="sm" variant="outline">
                      Reagendar
                    </Button>
                    <Button size="sm" variant="destructive">
                      Cancelar
                    </Button>
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

export default AgendaOnline;
