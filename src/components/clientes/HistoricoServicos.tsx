
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, User, Search, Download, Star } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HistoricoServicosProps {
  clienteId: string;
}

const HistoricoServicos: React.FC<HistoricoServicosProps> = ({ clienteId }) => {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroAno, setFiltroAno] = useState("");

  // Mock data - em implementação real, buscar do banco
  const historico = [
    {
      id: "1",
      servico: "Consulta Cardiológica",
      prestador: "Dr. João Silva",
      unidade: "AGENDAJA Centro",
      data: new Date(2024, 0, 15),
      valor: 220.00,
      status: "realizada",
      avaliacao: 5,
      observacoes: "Consulta de rotina, exames normais"
    },
    {
      id: "2",
      servico: "Eletrocardiograma",
      prestador: "Dr. João Silva",
      unidade: "AGENDAJA Centro",
      data: new Date(2024, 0, 10),
      valor: 180.50,
      status: "realizada",
      avaliacao: 5,
      observacoes: "Resultado normal"
    },
    {
      id: "3",
      servico: "Holter 24h",
      prestador: "Dra. Maria Santos",
      unidade: "AGENDAJA Norte",
      data: new Date(2023, 11, 20),
      valor: 350.00,
      status: "realizada",
      avaliacao: 4,
      observacoes: "Monitoramento cardíaco completo"
    },
    {
      id: "4",
      servico: "Consulta Cardiológica",
      prestador: "Dr. João Silva",
      unidade: "AGENDAJA Centro",
      data: new Date(2024, 0, 25),
      valor: 220.00,
      status: "agendada",
      avaliacao: null,
      observacoes: null
    }
  ];

  // Filtrar histórico
  const historicoFiltrado = historico.filter(item => {
    const matchBusca = item.servico.toLowerCase().includes(busca.toLowerCase()) ||
                      item.prestador.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = !filtroStatus || item.status === filtroStatus;
    const matchAno = !filtroAno || item.data.getFullYear().toString() === filtroAno;
    return matchBusca && matchStatus && matchAno;
  });

  // Anos únicos
  const anos = [...new Set(historico.map(h => h.data.getFullYear().toString()))];

  const formatMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'realizada': return 'bg-green-100 text-green-800';
      case 'agendada': return 'bg-blue-100 text-blue-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (nota: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < nota ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por serviço ou prestador..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="realizada">Realizada</SelectItem>
                <SelectItem value="agendada">Agendada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroAno} onValueChange={setFiltroAno}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {anos.map(ano => (
                  <SelectItem key={ano} value={ano}>
                    {ano}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista do Histórico */}
      <div className="space-y-4">
        {historicoFiltrado.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Nenhum serviço encontrado</p>
            </CardContent>
          </Card>
        ) : (
          historicoFiltrado.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{item.servico}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {item.prestador}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {item.unidade}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(item.data, "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    <div className="text-lg font-semibold text-green-600 mt-2">
                      {formatMoeda(item.valor)}
                    </div>
                  </div>
                </div>

                {item.observacoes && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>Observações:</strong> {item.observacoes}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {item.avaliacao ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Sua avaliação:</span>
                        <div className="flex">
                          {renderStars(item.avaliacao)}
                        </div>
                      </div>
                    ) : item.status === 'realizada' ? (
                      <Button variant="outline" size="sm">
                        <Star className="h-4 w-4 mr-2" />
                        Avaliar
                      </Button>
                    ) : null}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Comprovante
                    </Button>
                    {item.status === 'agendada' && (
                      <>
                        <Button variant="outline" size="sm">
                          Reagendar
                        </Button>
                        <Button variant="destructive" size="sm">
                          Cancelar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Resumo */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {historico.filter(h => h.status === 'realizada').length}
              </div>
              <div className="text-sm text-gray-600">Serviços Realizados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatMoeda(historico.filter(h => h.status === 'realizada')
                  .reduce((sum, h) => sum + h.valor, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Investido</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {historico.filter(h => h.avaliacao).length > 0 
                  ? (historico.filter(h => h.avaliacao)
                      .reduce((sum, h) => sum + (h.avaliacao || 0), 0) / 
                     historico.filter(h => h.avaliacao).length).toFixed(1)
                  : '0.0'}⭐
              </div>
              <div className="text-sm text-gray-600">Avaliação Média</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoricoServicos;
