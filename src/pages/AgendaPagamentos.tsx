
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CalendarGrid, CalendarCell, CalendarHeader, CalendarHeading, CalendarNext, CalendarPrevious, CalendarViewport } from "@/components/ui/calendar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar as CalendarIcon, CreditCard, ChevronDown, Info } from "lucide-react";
import { Usuario, DiaAgendaPagamento, Prestador } from "@/types";
import { format, addMonths, subMonths, getMonth, getYear, getDate, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";

// Dados simulados dos próximos meses
const gerarDadosCalendario = (mes: number, ano: number) => {
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const diasAgendados: Record<number, { prestadores: {id: string; nome: string}[]; disponivel: boolean }> = {};
  
  // Gerar dados para cada dia
  for (let dia = 10; dia <= diasNoMes; dia++) {
    const prestadores = [];
    const qtdPrestadores = Math.floor(Math.random() * 4); // 0 a 3 prestadores
    
    for (let i = 0; i < qtdPrestadores; i++) {
      prestadores.push({
        id: `prestador-${i}`,
        nome: [`Clínica Saúde Plena`, `Laboratório Diagnóstico`, `Dra. Ana Silva`, `Dr. Roberto Martins`][i]
      });
    }
    
    diasAgendados[dia] = {
      prestadores,
      disponivel: prestadores.length < 3
    };
  }
  
  return diasAgendados;
};

// Calendário para os próximos meses
const dadosCalendario: Record<string, Record<number, { prestadores: {id: string; nome: string}[]; disponivel: boolean }>> = {};

// Gerar dados para os próximos 3 meses
const hoje = new Date();
const mesAtual = hoje.getMonth();
const anoAtual = hoje.getFullYear();

for (let i = 0; i < 3; i++) {
  const data = addMonths(hoje, i);
  const mes = getMonth(data);
  const ano = getYear(data);
  const chave = `${mes}-${ano}`;
  dadosCalendario[chave] = gerarDadosCalendario(mes, ano);
}

const AgendaPagamentos: React.FC = () => {
  const [date, setDate] = useState<Date>(hoje);
  const [visualizacao, setVisualizacao] = useState<"mes" | "dia">("mes");
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);
  
  // Obter dados do mês selecionado
  const mesChave = `${getMonth(date)}-${getYear(date)}`;
  const dadosMes = dadosCalendario[mesChave] || {};
  
  // Verificar se é um dia com agendamentos
  const isDiaComAgendamentos = (dia: number) => {
    return dia >= 10 && dadosMes[dia];
  };
  
  // Formatar data por extenso
  const dataFormatada = format(date, "MMMM 'de' yyyy", { locale: ptBR });
  
  // Mudar para o mês anterior ou próximo
  const mesAnterior = () => {
    const novaData = subMonths(date, 1);
    setDate(novaData);
    setDiaSelecionado(null);
  };
  
  const proximoMes = () => {
    const novaData = addMonths(date, 1);
    setDate(novaData);
    setDiaSelecionado(null);
  };
  
  // Selecionar um dia específico
  const selecionarDia = (dia: number) => {
    if (isDiaComAgendamentos(dia)) {
      setDiaSelecionado(dia);
      setVisualizacao("dia");
    }
  };
  
  // Voltar para visualização de mês
  const voltarParaMes = () => {
    setVisualizacao("mes");
    setDiaSelecionado(null);
  };
  
  // Renderizar o conteúdo baseado na visualização
  const renderConteudo = () => {
    if (visualizacao === "dia" && diaSelecionado) {
      const dadosDia = dadosMes[diaSelecionado];
      const dataSelecionada = new Date(getYear(date), getMonth(date), diaSelecionado);
      
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              {format(dataSelecionada, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </h2>
            <Button variant="outline" size="sm" onClick={voltarParaMes}>
              Voltar ao Calendário
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Prestadores Agendados</CardTitle>
              <CardDescription>
                {dadosDia.prestadores.length} prestador(es) programado(s) para esta data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dadosDia.prestadores.length > 0 ? (
                <div className="space-y-4">
                  {dadosDia.prestadores.map((prestador, index) => (
                    <div key={prestador.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium">{prestador.nome}</p>
                        <p className="text-sm text-gray-500">ID: {prestador.id}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className="bg-green-100 hover:bg-green-100 text-green-800"
                      >
                        Confirmado
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhum prestador agendado para esta data.
                </div>
              )}
              
              <div className="flex justify-between items-center mt-6 p-4 bg-blue-50 rounded-md">
                <div>
                  <p className="font-medium text-blue-900">Status do Dia</p>
                  <p className="text-sm text-blue-700">
                    {dadosDia.disponivel 
                      ? "Este dia ainda pode receber mais agendamentos."
                      : "Este dia atingiu o limite de prestadores."}
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className={dadosDia.disponivel 
                    ? "bg-green-100 hover:bg-green-100 text-green-800"
                    : "bg-red-100 hover:bg-red-100 text-red-800"}
                >
                  {dadosDia.disponivel ? "Disponível" : "Lotado"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // Visualização de mês
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Agenda de Pagamentos</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={mesAnterior}>
                <CalendarPrevious />
              </Button>
              <span className="font-medium min-w-[140px] text-center">
                {dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1)}
              </span>
              <Button variant="outline" size="icon" onClick={proximoMes}>
                <CalendarNext />
              </Button>
            </div>
          </div>
          <CardDescription className="flex items-center gap-1">
            <Info className="h-4 w-4" />
            Máximo de 3 prestadores por dia. Disponível apenas após o dia 10 de cada mês.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              if (date) {
                setDate(date);
                const dia = getDate(date);
                if (isDiaComAgendamentos(dia)) {
                  selecionarDia(dia);
                }
              }
            }}
            className="border rounded-md"
            locale={ptBR}
          >
            <CalendarHeader>
              <CalendarHeading />
            </CalendarHeader>
            <CalendarViewport>
              <CalendarGrid>
                {(day) => {
                  const dia = getDate(day);
                  const ehHoje = isToday(day);
                  const temAgendamento = isDiaComAgendamentos(dia);
                  const dadosDia = dadosMes[dia];
                  
                  let className = "";
                  let status = "";
                  
                  if (dia < 10) {
                    className = "text-gray-300 cursor-not-allowed";
                  } else if (temAgendamento) {
                    const prestadoresCount = dadosDia.prestadores.length;
                    
                    if (prestadoresCount === 0) {
                      className = "bg-green-50 hover:bg-green-100";
                      status = "Livre";
                    } else if (prestadoresCount < 3) {
                      className = "bg-yellow-50 hover:bg-yellow-100";
                      status = `${prestadoresCount}/3`;
                    } else {
                      className = "bg-red-50 hover:bg-red-100";
                      status = "Lotado";
                    }
                  }
                  
                  if (ehHoje) {
                    className += " font-bold border-2 border-blue-400";
                  }
                  
                  return (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <CalendarCell 
                            day={day} 
                            className={className}
                            onClick={() => dia >= 10 && selecionarDia(dia)}
                          >
                            {dia}
                            {temAgendamento && (
                              <div className="text-xs mt-1 font-normal">
                                {status}
                              </div>
                            )}
                          </CalendarCell>
                        </TooltipTrigger>
                        {temAgendamento && (
                          <TooltipContent>
                            <div className="text-sm">
                              <p className="font-medium">Status: {status}</p>
                              <p>Prestadores: {dadosDia.prestadores.length}/3</p>
                              {dadosDia.prestadores.map((p, i) => (
                                <p key={i} className="text-xs text-gray-600">{p.nome}</p>
                              ))}
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  );
                }}
              </CalendarGrid>
            </CalendarViewport>
          </Calendar>
          
          <div className="mt-6 flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span className="text-sm">Indisponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-50 rounded"></div>
              <span className="text-sm">Livre</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-50 rounded"></div>
              <span className="text-sm">Parcialmente ocupado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-50 rounded"></div>
              <span className="text-sm">Lotado</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center">
          <CreditCard className="h-6 w-6 mr-2" />
          Agenda de Pagamentos
        </h1>
        <Select defaultValue="proximos3meses">
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mesAtual">Mês Atual</SelectItem>
            <SelectItem value="proximoMes">Próximo Mês</SelectItem>
            <SelectItem value="proximos3meses">Próximos 3 Meses</SelectItem>
            <SelectItem value="personalizado">Período Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {renderConteudo()}
    </div>
  );
};

export default AgendaPagamentos;
