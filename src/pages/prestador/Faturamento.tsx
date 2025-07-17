
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Calendar as CalendarIcon, Check, AlertCircle } from "lucide-react";
import { Guia, DiaAgendaPagamento } from "@/types";
import { format, addDays, getDate, startOfMonth, endOfMonth, isAfter, isBefore, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

// Dados simulados de guias realizadas mas não faturadas
const guiasMock: Guia[] = Array.from({ length: 10 }).map((_, i) => ({
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
  status: "realizada",
  dataEmissao: new Date(2025, 4, Math.floor(1 + Math.random() * 28)),
  dataRealizacao: new Date(),
  dataFaturamento: undefined,
  dataPagamento: undefined
}));

// Gerar agenda de pagamentos simulada
const hoje = new Date();
const mesAtual = hoje.getMonth();
const anoAtual = hoje.getFullYear();

const gerarDiasDisponiveis = (): DiaAgendaPagamento[] => {
  const inicio = startOfMonth(new Date(anoAtual, mesAtual + 1, 1)); // Próximo mês
  const fim = endOfMonth(inicio);
  const dias: DiaAgendaPagamento[] = [];
  
  // Começando do dia 10
  let data = new Date(anoAtual, mesAtual + 1, 10);
  
  while (isBefore(data, fim) || isSameDay(data, fim)) {
    // Simulação de disponibilidade - alguns dias têm mais reservas
    const prestadoresAgendados = Math.floor(Math.random() * 4); // 0 a 3 prestadores
    dias.push({
      data: new Date(data),
      prestadoresAgendados,
      disponivel: prestadoresAgendados < 3
    });
    
    data = addDays(data, 1);
  }
  
  return dias;
};

const diasDisponiveis = gerarDiasDisponiveis();

const FaturamentoPrestador: React.FC = () => {
  const { toast } = useToast();
  const [selectedGuias, setSelectedGuias] = useState<string[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState<Date | undefined>(undefined);
  const [step, setStep] = useState<'select' | 'calendar' | 'confirm'>('select');
  
  // Valor total das guias selecionadas
  const valorTotal = guiasMock
    .filter(guia => selectedGuias.includes(guia.id))
    .reduce((acc, guia) => acc + guia.valor, 0);
  
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
  
  // Marcar todas ou desmarcar todas
  const handleCheckAll = (checked: boolean) => {
    if (checked) {
      setSelectedGuias(guiasMock.map(guia => guia.id));
    } else {
      setSelectedGuias([]);
    }
  };
  
  // Verificar se um dia está disponível
  const isDiaDisponivel = (date: Date) => {
    // Dias antes do dia 10 não estão disponíveis
    if (getDate(date) < 10) return false;
    
    // Verificar na lista de dias disponíveis
    const dia = diasDisponiveis.find(d => 
      isSameDay(d.data, date)
    );
    
    return dia?.disponivel ?? false;
  };
  
  // Função para o calendário
  const diasDesabilitados = (date: Date) => {
    // Desabilitar dias atuais e anteriores
    if (isBefore(date, startOfMonth(new Date(anoAtual, mesAtual + 1, 1)))) {
      return true;
    }
    
    // Dias depois do próximo mês
    if (isAfter(date, endOfMonth(new Date(anoAtual, mesAtual + 1, 31)))) {
      return true;
    }
    
    // Dias antes do dia 10 do próximo mês
    if (getDate(date) < 10) {
      return true;
    }
    
    // Dias que já têm 3 prestadores agendados
    const dia = diasDisponiveis.find(d => isSameDay(d.data, date));
    if (dia && !dia.disponivel) {
      return true;
    }
    
    return false;
  };
  
  // Avançar para escolha da data
  const avancarParaCalendario = () => {
    if (selectedGuias.length === 0) {
      toast({
        title: "Nenhuma guia selecionada",
        description: "Por favor, selecione pelo menos uma guia para faturar.",
        variant: "destructive"
      });
      return;
    }
    
    setStep('calendar');
  };
  
  // Avançar para confirmação
  const avancarParaConfirmacao = () => {
    if (!dataSelecionada) {
      toast({
        title: "Nenhuma data selecionada",
        description: "Por favor, selecione uma data disponível para recebimento.",
        variant: "destructive"
      });
      return;
    }
    
    setStep('confirm');
  };
  
  // Voltar para etapa anterior
  const voltarEtapa = () => {
    if (step === 'calendar') {
      setStep('select');
    } else if (step === 'confirm') {
      setStep('calendar');
    }
  };
  
  // Confirmar faturamento
  const confirmarFaturamento = () => {
    // Em uma aplicação real, aqui seria feita uma chamada à API
    toast({
      title: "Faturamento solicitado com sucesso!",
      description: `Pagamento programado para ${format(dataSelecionada!, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`,
      action: (
        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="h-5 w-5 text-green-600" />
        </div>
      )
    });
    
    // Limpar seleção e voltar para primeira etapa
    setSelectedGuias([]);
    setDataSelecionada(undefined);
    setStep('select');
  };
  
  // Renderizar etapas
  const renderEtapa = () => {
    switch (step) {
      case 'select':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Solicitação de Faturamento</CardTitle>
              <CardDescription>
                Selecione as guias realizadas que você deseja faturar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          checked={
                            selectedGuias.length > 0 && 
                            selectedGuias.length === guiasMock.length
                          }
                          onCheckedChange={handleCheckAll}
                        />
                      </TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Serviço</TableHead>
                      <TableHead>Data Realização</TableHead>
                      <TableHead>Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guiasMock.map((guia) => (
                      <TableRow key={guia.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedGuias.includes(guia.id)}
                            onCheckedChange={(checked) => 
                              handleCheckGuia(guia.id, !!checked)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {guia.codigoAutenticacao}
                        </TableCell>
                        <TableCell>{guia.cliente?.nome}</TableCell>
                        <TableCell>{guia.servico}</TableCell>
                        <TableCell>
                          {guia.dataRealizacao && format(guia.dataRealizacao, "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatarValor(guia.valor)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-6 flex items-center justify-between bg-gray-50 p-4 rounded-md">
                <div>
                  <p className="text-sm text-gray-600">Total selecionado</p>
                  <p className="text-xl font-bold text-agendaja-primary">
                    {formatarValor(valorTotal)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedGuias.length} guia(s) selecionada(s)
                  </p>
                </div>
                <Button
                  onClick={avancarParaCalendario}
                  className="bg-agendaja-primary hover:bg-agendaja-secondary"
                  disabled={selectedGuias.length === 0}
                >
                  Escolher Data de Pagamento
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      
      case 'calendar':
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Agende o Recebimento</CardTitle>
                  <CardDescription>
                    Escolha uma data disponível na agenda de pagamentos
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={voltarEtapa}>
                  Voltar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex gap-3">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-medium text-amber-800">Informação Importante</h4>
                  <p className="text-amber-700 text-sm mt-1">
                    Os pagamentos estão disponíveis apenas após o dia 10 de cada mês. 
                    Para garantir seu pagamento, escolha uma data que tenha menos de 3 
                    prestadores agendados.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <p className="font-medium mb-3">Calendário de Pagamentos</p>
                  <div className="border rounded-md p-3">
                    <Calendar
                      mode="single"
                      selected={dataSelecionada}
                      onSelect={setDataSelecionada}
                      disabled={diasDesabilitados}
                      locale={ptBR}
                      className="mx-auto"
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <p className="font-medium mb-3">Resumo do Pedido</p>
                  <div className="border rounded-md p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Número de guias:</span>
                      <span className="font-medium">{selectedGuias.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor a receber:</span>
                      <span className="font-bold text-agendaja-primary">{formatarValor(valorTotal)}</span>
                    </div>
                    <Separator />
                    <div>
                      <p className="font-medium mb-2">Data selecionada:</p>
                      {dataSelecionada ? (
                        <div className="bg-agendaja-light rounded-md p-3 text-center">
                          <CalendarIcon className="h-5 w-5 text-agendaja-primary mx-auto mb-2" />
                          <p className="font-bold text-agendaja-primary">
                            {format(dataSelecionada, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-3">
                          Nenhuma data selecionada
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={avancarParaConfirmacao}
                className="bg-agendaja-primary hover:bg-agendaja-secondary"
                disabled={!dataSelecionada}
              >
                Continuar
              </Button>
            </CardFooter>
          </Card>
        );
      
      case 'confirm':
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Confirme seu Faturamento</CardTitle>
                  <CardDescription>
                    Revise os detalhes antes de confirmar
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={voltarEtapa}>
                  Voltar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-agendaja-light rounded-full flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-agendaja-primary" />
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-md p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Guias selecionadas</p>
                  <p className="font-medium">{selectedGuias.length} guia(s)</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Valor total do faturamento</p>
                  <p className="text-xl font-bold text-agendaja-primary">{formatarValor(valorTotal)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Data programada para pagamento</p>
                  <p className="font-medium">
                    {dataSelecionada && format(dataSelecionada, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <RadioGroup defaultValue="pix">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix">Receber via Pix usando os dados bancários cadastrados</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-700">
                <p>
                  Ao confirmar este faturamento, todas as guias selecionadas serão marcadas como "faturadas" 
                  e seu pagamento será programado para a data escolhida.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={confirmarFaturamento}
                className="bg-agendaja-primary hover:bg-agendaja-secondary"
              >
                Confirmar Faturamento
              </Button>
            </CardFooter>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold flex items-center">
        <CreditCard className="h-6 w-6 mr-2" />
        Faturamento
      </h1>
      
      <div className="mb-6">
        <nav className="flex border-b border-gray-200">
          <ol className="flex w-full overflow-hidden">
            <li className={`flex-1 relative overflow-hidden ${step === 'select' ? 'text-agendaja-primary' : 'text-gray-500'}`}>
              <span className={`flex items-center justify-center h-12 transition-colors ${step === 'select' ? 'bg-agendaja-light' : 'bg-gray-50'}`}>
                <span className="font-medium text-sm">Selecionar Guias</span>
              </span>
              <span className="absolute inset-0 left-full top-0 h-full w-6 z-10 block transform -skew-x-12 bg-white" />
            </li>
            <li className={`flex-1 relative overflow-hidden ${step === 'calendar' ? 'text-agendaja-primary' : 'text-gray-500'}`}>
              <span className={`flex items-center justify-center h-12 transition-colors ${step === 'calendar' ? 'bg-agendaja-light' : 'bg-gray-50'}`}>
                <span className="font-medium text-sm">Escolher Data</span>
              </span>
              <span className="absolute inset-0 left-full top-0 h-full w-6 z-10 block transform -skew-x-12 bg-white" />
            </li>
            <li className={`flex-1 relative overflow-hidden ${step === 'confirm' ? 'text-agendaja-primary' : 'text-gray-500'}`}>
              <span className={`flex items-center justify-center h-12 transition-colors ${step === 'confirm' ? 'bg-agendaja-light' : 'bg-gray-50'}`}>
                <span className="font-medium text-sm">Confirmar</span>
              </span>
            </li>
          </ol>
        </nav>
      </div>
      
      {renderEtapa()}
    </div>
  );
};

export default FaturamentoPrestador;
