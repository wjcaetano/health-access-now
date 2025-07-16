
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addDays, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useServicos } from "@/hooks/useServicos";
import { usePrestadores } from "@/hooks/usePrestadores";

interface AgendamentoOnlineProps {
  clienteId: string;
}

const AgendamentoOnline: React.FC<AgendamentoOnlineProps> = ({ clienteId }) => {
  const [etapa, setEtapa] = useState<'servico' | 'prestador' | 'horario' | 'confirmacao'>('servico');
  const [servicoSelecionado, setServicoSelecionado] = useState<any>(null);
  const [prestadorSelecionado, setPrestadorSelecionado] = useState<any>(null);
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  const { data: servicos } = useServicos();
  const { data: prestadores } = usePrestadores();

  // Filtrar serviços
  const servicosFiltrados = servicos?.filter(servico => {
    const matchBusca = servico.nome.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria = !filtroCategoria || servico.categoria === filtroCategoria;
    return matchBusca && matchCategoria;
  }) || [];

  // Categorias únicas
  const categorias = [...new Set(servicos?.map(s => s.categoria) || [])];

  // Gerar horários disponíveis (mock)
  const horariosDisponiveis = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  // Gerar próximos 7 dias úteis
  const proximosDias = Array.from({ length: 7 }, (_, i) => {
    const data = addDays(new Date(), i + 1);
    return data.getDay() === 0 || data.getDay() === 6 ? null : data;
  }).filter(Boolean) as Date[];

  const formatMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  const confirmarAgendamento = () => {
    // Implementar lógica de confirmação
    console.log("Agendamento confirmado:", {
      servico: servicoSelecionado,
      prestador: prestadorSelecionado,
      data: dataSelecionada,
      horario: horarioSelecionado
    });
    
    // Reset do formulário
    setEtapa('servico');
    setServicoSelecionado(null);
    setPrestadorSelecionado(null);
    setDataSelecionada(null);
    setHorarioSelecionado(null);
  };

  return (
    <div className="space-y-6">
      {/* Progresso */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {['servico', 'prestador', 'horario', 'confirmacao'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  etapa === step ? 'bg-blue-500 text-white' : 
                  ['servico', 'prestador', 'horario', 'confirmacao'].indexOf(etapa) > index ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    ['servico', 'prestador', 'horario', 'confirmacao'].indexOf(etapa) > index ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span>Serviço</span>
            <span>Prestador</span>
            <span>Horário</span>
            <span>Confirmação</span>
          </div>
        </CardContent>
      </Card>

      {/* Etapa 1: Seleção de Serviço */}
      {etapa === 'servico' && (
        <Card>
          <CardHeader>
            <CardTitle>Escolha o Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Filtros */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar serviços..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    {categorias.map(categoria => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Lista de Serviços */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicosFiltrados.map((servico) => (
                  <div
                    key={servico.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      servicoSelecionado?.id === servico.id ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setServicoSelecionado(servico)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{servico.nome}</h3>
                      <Badge variant="secondary">{servico.categoria}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{servico.descricao}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-green-600">
                        {formatMoeda(Number(servico.valor_venda))}
                      </span>
                      {servico.tempo_estimado && (
                        <span className="text-sm text-gray-500">
                          {servico.tempo_estimado}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {servicoSelecionado && (
                <div className="flex justify-end">
                  <Button onClick={() => setEtapa('prestador')}>
                    Continuar
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Etapa 2: Seleção de Prestador */}
      {etapa === 'prestador' && (
        <Card>
          <CardHeader>
            <CardTitle>Escolha o Prestador</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prestadores?.map((prestador) => (
                  <div
                    key={prestador.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      prestadorSelecionado?.id === prestador.id ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setPrestadorSelecionado(prestador)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{prestador.nome}</h3>
                        <p className="text-sm text-gray-600">{prestador.tipo}</p>
                        {prestador.especialidades && prestador.especialidades.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {prestador.especialidades.slice(0, 2).map((esp, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {esp}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>2.5 km</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current text-yellow-400" />
                            <span>4.8</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {prestadorSelecionado && (
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setEtapa('servico')}>
                    Voltar
                  </Button>
                  <Button onClick={() => setEtapa('horario')}>
                    Continuar
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Etapa 3: Seleção de Horário */}
      {etapa === 'horario' && (
        <Card>
          <CardHeader>
            <CardTitle>Escolha Data e Horário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Seleção de Data */}
              <div>
                <h3 className="font-medium mb-3">Selecione o Dia</h3>
                <div className="grid grid-cols-7 gap-2">
                  {proximosDias.map((dia) => (
                    <Button
                      key={dia.toISOString()}
                      variant={dataSelecionada?.toDateString() === dia.toDateString() ? "default" : "outline"}
                      className="flex flex-col h-auto p-3"
                      onClick={() => setDataSelecionada(dia)}
                    >
                      <span className="text-xs">
                        {format(dia, "EEE", { locale: ptBR })}
                      </span>
                      <span className="text-lg font-bold">
                        {format(dia, "dd")}
                      </span>
                      <span className="text-xs">
                        {format(dia, "MMM", { locale: ptBR })}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Seleção de Horário */}
              {dataSelecionada && (
                <div>
                  <h3 className="font-medium mb-3">Selecione o Horário</h3>
                  <div className="grid grid-cols-6 gap-2">
                    {horariosDisponiveis.map((horario) => (
                      <Button
                        key={horario}
                        variant={horarioSelecionado === horario ? "default" : "outline"}
                        onClick={() => setHorarioSelecionado(horario)}
                      >
                        {horario}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {dataSelecionada && horarioSelecionado && (
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setEtapa('prestador')}>
                    Voltar
                  </Button>
                  <Button onClick={() => setEtapa('confirmacao')}>
                    Continuar
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Etapa 4: Confirmação */}
      {etapa === 'confirmacao' && (
        <Card>
          <CardHeader>
            <CardTitle>Confirmar Agendamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold mb-4">Resumo do Agendamento</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Serviço:</span>
                    <span className="font-medium">{servicoSelecionado?.nome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prestador:</span>
                    <span className="font-medium">{prestadorSelecionado?.nome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data:</span>
                    <span className="font-medium">
                      {dataSelecionada && format(dataSelecionada, "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Horário:</span>
                    <span className="font-medium">{horarioSelecionado}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor:</span>
                      <span className="font-semibold text-green-600">
                        {formatMoeda(Number(servicoSelecionado?.valor_venda || 0))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setEtapa('horario')}>
                  Voltar
                </Button>
                <Button onClick={confirmarAgendamento}>
                  Confirmar Agendamento
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgendamentoOnline;
