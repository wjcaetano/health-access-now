
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useColaboradorByEmail } from "@/hooks/useColaboradores";
import { usePontosColaborador, useUltimoPonto, useJaBateuPontoHoje, useRegistrarPonto } from "@/hooks/usePontoEletronico";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Clock, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { format, startOfMonth, endOfMonth, differenceInMinutes, addMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function PontoEletronicoCompleto() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [observacao, setObservacao] = useState("");
  
  const { data: colaborador } = useColaboradorByEmail(profile?.email || "");
  const { data: pontos } = usePontosColaborador(colaborador?.id || "");
  const { data: ultimoPonto } = useUltimoPonto(colaborador?.id || "");
  const { data: jaBateuPonto } = useJaBateuPontoHoje(colaborador?.id || "");
  const registrarPonto = useRegistrarPonto();

  const hoje = new Date();
  const inicioMes = startOfMonth(hoje);
  const fimMes = endOfMonth(hoje);

  // Filtrar pontos do dia atual
  const pontosHoje = pontos?.filter(ponto => 
    format(new Date(ponto.data_ponto), 'yyyy-MM-dd') === format(hoje, 'yyyy-MM-dd')
  ) || [];

  // Filtrar pontos do mês atual
  const pontosMes = pontos?.filter(ponto => {
    const dataPonto = new Date(ponto.data_ponto);
    return dataPonto >= inicioMes && dataPonto <= fimMes;
  }) || [];

  // Calcular banco de horas
  const calcularBancoHoras = () => {
    let totalMinutos = 0;
    const horasDiariasPadrao = 8 * 60; // 8 horas em minutos

    // Agrupar pontos por dia
    const pontosPorDia = pontosMes.reduce((acc: any, ponto) => {
      const dia = format(new Date(ponto.data_ponto), 'yyyy-MM-dd');
      if (!acc[dia]) acc[dia] = [];
      acc[dia].push(ponto);
      return acc;
    }, {});

    // Calcular horas trabalhadas por dia
    Object.entries(pontosPorDia).forEach(([dia, pontosDia]: [string, any]) => {
      const entradas = pontosDia.filter((p: any) => p.tipo_ponto === 'entrada');
      const saidas = pontosDia.filter((p: any) => p.tipo_ponto === 'saida');
      
      let horasTrabalhadasDia = 0;
      for (let i = 0; i < Math.min(entradas.length, saidas.length); i++) {
        const entrada = new Date(`${dia}T${entradas[i].hora_entrada || '00:00'}`);
        const saida = new Date(`${dia}T${saidas[i].hora_saida || '23:59'}`);
        horasTrabalhadasDia += differenceInMinutes(saida, entrada);
      }
      
      totalMinutos += horasTrabalhadasDia - horasDiariasPadrao;
    });

    return totalMinutos;
  };

  const bancoHorasMinutos = calcularBancoHoras();
  const bancoHoras = Math.floor(Math.abs(bancoHorasMinutos) / 60);
  const bancoMinutos = Math.abs(bancoHorasMinutos) % 60;

  const handleRegistrarPonto = async (tipo: 'entrada' | 'saida') => {
    if (!colaborador) return;

    try {
      const agora = new Date();
      await registrarPonto.mutateAsync({
        colaborador_id: colaborador.id,
        tipo_ponto: tipo,
        data_ponto: format(agora, 'yyyy-MM-dd'),
        hora_entrada: tipo === 'entrada' ? format(agora, 'HH:mm:ss') : null,
        hora_saida: tipo === 'saida' ? format(agora, 'HH:mm:ss') : null,
        observacao: observacao || null
      });

      toast({
        title: "Ponto registrado",
        description: `${tipo === 'entrada' ? 'Entrada' : 'Saída'} registrada às ${format(agora, 'HH:mm')}`,
      });
      
      setObservacao("");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível registrar o ponto",
        variant: "destructive",
      });
    }
  };

  if (!colaborador) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            Você não está cadastrado como colaborador
          </p>
        </CardContent>
      </Card>
    );
  }

  const proximoTipo = ultimoPonto?.tipo_ponto === 'entrada' ? 'saida' : 'entrada';

  return (
    <div className="space-y-6">
      {/* Registrar Ponto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Ponto Eletrônico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {format(hoje, 'HH:mm:ss')}
            </div>
            <div className="text-gray-600">
              {format(hoje, 'EEEE, dd MMMM yyyy', { locale: ptBR })}
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={() => handleRegistrarPonto(proximoTipo)}
              disabled={registrarPonto.isPending}
              className={proximoTipo === 'entrada' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {registrarPonto.isPending ? 'Registrando...' : 
               proximoTipo === 'entrada' ? 'Registrar Entrada' : 'Registrar Saída'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Banco de Horas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Banco de Horas</p>
                <p className="text-2xl font-bold flex items-center gap-2">
                  {bancoHorasMinutos >= 0 ? (
                    <>
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="text-green-600">+{bancoHoras}h {bancoMinutos}m</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-5 w-5 text-red-600" />
                      <span className="text-red-600">-{bancoHoras}h {bancoMinutos}m</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Status Atual</p>
                <p className="text-lg font-semibold">
                  <Badge variant={colaborador.status_trabalho === 'trabalhando' ? 'default' : 'secondary'}>
                    {colaborador.status_trabalho === 'trabalhando' ? 'Trabalhando' : 'Fora do Trabalho'}
                  </Badge>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para registros */}
      <Tabs defaultValue="hoje" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hoje">Registros de Hoje</TabsTrigger>
          <TabsTrigger value="mes">Folha de Ponto do Mês</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hoje">
          <Card>
            <CardHeader>
              <CardTitle>Registros de Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              {pontosHoje.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Nenhum registro encontrado para hoje
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Observação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pontosHoje.map((ponto) => (
                      <TableRow key={ponto.id}>
                        <TableCell>
                          <Badge variant={ponto.tipo_ponto === 'entrada' ? 'default' : 'secondary'}>
                            {ponto.tipo_ponto === 'entrada' ? 'Entrada' : 'Saída'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {ponto.tipo_ponto === 'entrada' ? ponto.hora_entrada : ponto.hora_saida}
                        </TableCell>
                        <TableCell>{ponto.observacao || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Folha de Ponto - {format(hoje, 'MMMM yyyy', { locale: ptBR })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pontosMes.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Nenhum registro encontrado para este mês
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Observação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pontosMes.map((ponto) => (
                      <TableRow key={ponto.id}>
                        <TableCell>
                          {format(new Date(ponto.data_ponto), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={ponto.tipo_ponto === 'entrada' ? 'default' : 'secondary'}>
                            {ponto.tipo_ponto === 'entrada' ? 'Entrada' : 'Saída'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {ponto.tipo_ponto === 'entrada' ? ponto.hora_entrada : ponto.hora_saida}
                        </TableCell>
                        <TableCell>{ponto.observacao || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
