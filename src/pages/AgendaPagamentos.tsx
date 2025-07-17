
import React, { useState } from "react";
import { format, addMonths, getMonth, getYear, addDays, isBefore, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AgendaPagamentos as TipoAgendaPagamentos } from "@/types";

// Cria dados fictícios para a agenda de pagamentos
const gerarAgendaMock = (mes: number, ano: number): TipoAgendaPagamentos => {
  const diasDisponiveis = [];
  const dataInicial = new Date(ano, mes - 1, 10); // A partir do dia 10
  const dataFinal = new Date(ano, mes, 9); // Até o dia 9 do mês seguinte
  
  let dataAtual = dataInicial;
  const hoje = new Date();
  
  while (dataAtual <= dataFinal) {
    // Não inclui finais de semana
    if (dataAtual.getDay() !== 0 && dataAtual.getDay() !== 6) {
      // Distribui aleatoriamente 0 a 3 prestadores por dia para simulação
      const prestadoresAgendados = Math.floor(Math.random() * 4);
      diasDisponiveis.push({
        data: new Date(dataAtual),
        prestadoresAgendados,
        disponivel: prestadoresAgendados < 3 && !isBefore(dataAtual, hoje),
      });
    }
    
    dataAtual = addDays(dataAtual, 1);
  }
  
  return {
    mes,
    ano,
    diasDisponiveis,
  };
};

const AgendaPagamentos: React.FC = () => {
  const hoje = new Date();
  const mesAtual = getMonth(hoje) + 1; // getMonth é 0-indexed
  const anoAtual = getYear(hoje);
  
  const [periodoSelecionado, setPeriodoSelecionado] = useState({
    mes: mesAtual,
    ano: anoAtual,
  });
  
  const [dataSelecionada, setDataSelecionada] = useState<Date | undefined>(undefined);
  const [prestadoresSelecionados, setPrestadoresSelecionados] = useState<string[]>([
    "Clínica CardioSaúde", "Laboratório Análises Clínicas"
  ]);
  
  // Gera dados de agenda para o período selecionado
  const agendaAtual = gerarAgendaMock(periodoSelecionado.mes, periodoSelecionado.ano);
  
  // Calcular valor total fictício do pagamento
  const valorTotal = 3560.75;
  
  // Avança para o próximo mês
  const avancarMes = () => {
    const dataAtual = new Date(periodoSelecionado.ano, periodoSelecionado.mes - 1, 1);
    const proximaData = addMonths(dataAtual, 1);
    setPeriodoSelecionado({
      mes: getMonth(proximaData) + 1,
      ano: getYear(proximaData),
    });
    setDataSelecionada(undefined);
  };
  
  // Retrocede para o mês anterior
  const voltarMes = () => {
    const dataAtual = new Date(periodoSelecionado.ano, periodoSelecionado.mes - 1, 1);
    const dataAnterior = addMonths(dataAtual, -1);
    setPeriodoSelecionado({
      mes: getMonth(dataAnterior) + 1,
      ano: getYear(dataAnterior),
    });
    setDataSelecionada(undefined);
  };
  
  // Filtra funções de datas disponíveis para o calendário
  const isDayAvailable = (date: Date) => {
    return agendaAtual.diasDisponiveis.some(dia => 
      isSameDay(dia.data, date) && dia.disponivel
    );
  };
  
  const isDayUnavailable = (date: Date) => {
    return agendaAtual.diasDisponiveis.some(dia => 
      isSameDay(dia.data, date) && !dia.disponivel && dia.prestadoresAgendados >= 3
    );
  };
  
  const isDayPartiallyAvailable = (date: Date) => {
    return agendaAtual.diasDisponiveis.some(dia => 
      isSameDay(dia.data, date) && dia.prestadoresAgendados > 0 && dia.prestadoresAgendados < 3
    );
  };
  
  const getPrestadoresCountForDate = (date: Date): number => {
    const dia = agendaAtual.diasDisponiveis.find(dia => isSameDay(dia.data, date));
    return dia ? dia.prestadoresAgendados : 0;
  };
  
  const formatMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Agenda de Pagamentos</h2>
        <p className="text-gray-500 mt-1">
          Configure os dias de pagamentos para prestadores de serviço
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div>Calendário de Pagamentos</div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={voltarMes}
                >
                  Anterior
                </Button>
                <div className="bg-gray-100 px-3 py-1 rounded-md">
                  {format(new Date(periodoSelecionado.ano, periodoSelecionado.mes - 1, 1), "MMMM yyyy", { locale: ptBR })}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={avancarMes}
                >
                  Próximo
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              Selecione uma data para agendar os pagamentos dos prestadores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="mb-4 flex flex-wrap gap-2 text-sm">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-gray-200 mr-1"></div>
                  <span>Não disponível</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-agendaja-light mr-1"></div>
                  <span>Disponível</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-agendaja-primary mr-1"></div>
                  <span>Data selecionada</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-yellow-200 mr-1"></div>
                  <span>Parcialmente ocupado</span>
                </div>
              </div>
              
              <Calendar
                mode="single"
                selected={dataSelecionada}
                onSelect={setDataSelecionada}
                className="border rounded-md p-3"
                locale={ptBR}
                modifiers={{
                  available: (date) => isDayAvailable(date),
                  unavailable: (date) => isDayUnavailable(date),
                  partiallyAvailable: (date) => isDayPartiallyAvailable(date),
                }}
                modifiersClassNames={{
                  available: "bg-agendaja-light text-agendaja-primary",
                  unavailable: "bg-gray-200 text-gray-400",
                  partiallyAvailable: "bg-yellow-200",
                }}
                disabled={(date) => 
                  !agendaAtual.diasDisponiveis.some(dia => 
                    isSameDay(dia.data, date) && dia.disponivel
                  )
                }
              />
              
              {dataSelecionada && (
                <div className="mt-4 text-center">
                  <p>
                    Data selecionada: <strong>{format(dataSelecionada, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</strong>
                  </p>
                  <p className="text-sm text-gray-500">
                    {getPrestadoresCountForDate(dataSelecionada)} de 3 vagas ocupadas
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Detalhes do Pagamento</CardTitle>
            <CardDescription>
              Configure os prestadores e valores para pagamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">
                  Prestadores Selecionados
                </label>
                <div className="space-y-2">
                  {prestadoresSelecionados.map((prestador, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                      <span>{prestador}</span>
                      <Badge variant="outline">
                        {index === 0 ? "5 guias" : "3 guias"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Valor Total:</span>
                  <span className="font-medium">{formatMoeda(valorTotal)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-gray-600">Data de Pagamento:</span>
                  <span className="font-medium">
                    {dataSelecionada 
                      ? format(dataSelecionada, "dd/MM/yyyy") 
                      : "Selecione uma data"}
                  </span>
                </div>
                
                <Button 
                  className="w-full bg-agendaja-primary hover:bg-agendaja-secondary"
                  disabled={!dataSelecionada}
                >
                  Confirmar Agendamento
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgendaPagamentos;
