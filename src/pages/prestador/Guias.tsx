import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Calendar, Check } from "lucide-react";
import { Guia } from "@/types";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Dados simulados de guias
const guiasMock: Guia[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `guia-${i + 1}`,
  agendamentoId: `agend-${i + 1}`,
  prestadorId: "prestador-1",
  clienteId: `cliente-${Math.floor(Math.random() * 10) + 1}`,
  cliente: {
    id: `cliente-${Math.floor(Math.random() * 10) + 1}`,
    nome: `Cliente ${Math.floor(Math.random() * 10) + 1}`,
    cpf: "123.456.789-00",
    telefone: "(11) 98765-4321",
    email: "cliente@exemplo.com",
    endereco: "Rua Exemplo, 123",
    dataCadastro: new Date(),
    idAssociado: `ASS${Math.floor(10000 + Math.random() * 90000)}`
  },
  servico: ["Consulta Cardiologista", "Exame de Sangue", "Raio-X", "Ultrassonografia"][Math.floor(Math.random() * 4)],
  valor: Math.floor(15000 + Math.random() * 50000),
  codigoAutenticacao: `AG${Math.floor(100000 + Math.random() * 900000)}`,
  status: ["emitida", "realizada", "faturada", "paga"][Math.floor(Math.random() * 3)] as any,
  dataEmissao: new Date(2025, 3 + Math.floor(Math.random() * 3), Math.floor(1 + Math.random() * 28)),
  dataRealizacao: Math.random() > 0.3 ? new Date() : undefined,
  dataFaturamento: Math.random() > 0.7 ? new Date() : undefined,
  dataPagamento: undefined
}));

// Ordenar por data de emissão (mais recentes primeiro)
guiasMock.sort((a, b) => b.dataEmissao.getTime() - a.dataEmissao.getTime());

const statusMap: Record<string, { label: string; color: string }> = {
  emitida: {
    label: "Emitida",
    color: "bg-yellow-100 hover:bg-yellow-100 text-yellow-800"
  },
  realizada: {
    label: "Realizada",
    color: "bg-blue-100 hover:bg-blue-100 text-blue-800"
  },
  faturada: {
    label: "Faturada",
    color: "bg-green-100 hover:bg-green-100 text-green-800"
  },
  paga: {
    label: "Paga",
    color: "bg-gray-100 hover:bg-gray-100 text-gray-800"
  }
};

const GuiasPrestador: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedGuias, setSelectedGuias] = useState<string[]>([]);
  const isMobile = useIsMobile();
  
  // Filtrar guias
  const guiasFiltradas = guiasMock.filter(guia => {
    const matchesSearch = 
      guia.servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guia.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guia.codigoAutenticacao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || guia.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Formatar valor em reais
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor / 100);
  };
  
  // Lidar com a marcação de guias
  const handleCheckGuia = (guiaId: string, checked: boolean) => {
    if (checked) {
      setSelectedGuias(prev => [...prev, guiaId]);
    } else {
      setSelectedGuias(prev => prev.filter(id => id !== guiaId));
    }
  };
  
  // Marcar guias como realizadas
  const marcarComoRealizadas = () => {
    if (selectedGuias.length === 0) {
      toast({
        title: "Nenhuma guia selecionada",
        description: "Por favor, selecione pelo menos uma guia para marcar como realizada.",
        variant: "destructive"
      });
      return;
    }
    
    // Em uma aplicação real, aqui seria feita uma chamada à API
    toast({
      title: `${selectedGuias.length} guia(s) marcada(s) como realizadas`,
      description: "As guias foram atualizadas com sucesso.",
      action: (
        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="h-5 w-5 text-green-600" />
        </div>
      )
    });
    
    // Limpar seleção
    setSelectedGuias([]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className={`flex ${isMobile ? 'flex-col gap-4' : 'flex-col md:flex-row md:items-center md:justify-between gap-4'}`}>
        <h1 className={`font-bold flex items-center ${isMobile ? 'text-xl' : 'text-2xl'}`}>
          <FileText className={`mr-2 ${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
          Guias de Serviço
        </h1>
        
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} gap-2`}>
          {selectedGuias.length > 0 && (
            <Button 
              onClick={marcarComoRealizadas}
              className="bg-agendaja-primary hover:bg-agendaja-secondary"
            >
              {isMobile ? `Marcar (${selectedGuias.length})` : `Marcar como Realizadas (${selectedGuias.length})`}
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => setSelectedGuias([])}
            disabled={selectedGuias.length === 0}
          >
            Limpar seleção
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className={isMobile ? "p-4" : ""}>
          <div className={`flex ${isMobile ? 'flex-col gap-4' : 'flex-col md:flex-row md:items-center md:justify-between gap-4'}`}>
            <div>
              <CardTitle>Minhas Guias</CardTitle>
              <CardDescription>
                Total de {guiasFiltradas.length} guias
              </CardDescription>
            </div>
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} gap-2`}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar guias..."
                  className={`pl-8 ${isMobile ? 'w-full' : 'w-full md:w-64'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className={isMobile ? 'w-full' : 'w-full sm:w-40'}>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="emitida">Emitidas</SelectItem>
                  <SelectItem value="realizada">Realizadas</SelectItem>
                  <SelectItem value="faturada">Faturadas</SelectItem>
                  <SelectItem value="paga">Pagas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className={isMobile ? "p-2" : ""}>
          <div className="rounded-md border overflow-hidden">
            {isMobile ? (
              // Layout móvel com cards
              <div className="space-y-3 p-2">
                {guiasFiltradas.map((guia) => (
                  <div key={guia.id} className="border rounded-lg p-4 bg-white">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {guia.status === 'emitida' && (
                            <Checkbox 
                              checked={selectedGuias.includes(guia.id)}
                              onCheckedChange={(checked) => 
                                handleCheckGuia(guia.id, !!checked)
                              }
                              className="mt-1"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-sm font-medium">
                                {guia.codigoAutenticacao}
                              </span>
                              <Badge 
                                variant="outline" 
                                className={statusMap[guia.status].color}
                              >
                                {statusMap[guia.status].label}
                              </Badge>
                            </div>
                            <h3 className="font-medium text-sm truncate">{guia.cliente?.nome}</h3>
                            <p className="text-sm text-gray-600 truncate">{guia.servico}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-sm text-green-600">
                            {formatarValor(guia.valor)}
                          </span>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{format(guia.dataEmissao, "dd/MM/yyyy")}</span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-agendaja-primary hover:text-agendaja-primary/80 hover:bg-agendaja-light/50"
                        >
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Layout desktop original com tabela
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox 
                        checked={
                          selectedGuias.length > 0 && 
                          selectedGuias.length === guiasFiltradas.filter(g => g.status === 'emitida').length
                        }
                        onCheckedChange={(checked) => {
                          const guiasEmitidas = guiasFiltradas
                            .filter(g => g.status === 'emitida')
                            .map(g => g.id);
                            
                          if (checked) {
                            setSelectedGuias(guiasEmitidas);
                          } else {
                            setSelectedGuias([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guiasFiltradas.map((guia) => (
                    <TableRow key={guia.id}>
                      <TableCell>
                        {guia.status === 'emitida' && (
                          <Checkbox 
                            checked={selectedGuias.includes(guia.id)}
                            onCheckedChange={(checked) => 
                              handleCheckGuia(guia.id, !!checked)
                            }
                          />
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {guia.codigoAutenticacao}
                      </TableCell>
                      <TableCell>{guia.cliente?.nome}</TableCell>
                      <TableCell>{guia.servico}</TableCell>
                      <TableCell className="font-medium">
                        {formatarValor(guia.valor)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                          <span>{format(guia.dataEmissao, "dd/MM/yyyy")}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={statusMap[guia.status].color}
                        >
                          {statusMap[guia.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-agendaja-primary hover:text-agendaja-primary/80 hover:bg-agendaja-light/50"
                        >
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {guiasFiltradas.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        Nenhuma guia encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuiasPrestador;
