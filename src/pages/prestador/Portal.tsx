
import React from "react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from "@/components/dashboard/StatCard";
import GuiaAgendamento from "@/components/guias/GuiaAgendamento";
import { Calendar, FileText, Clipboard, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const PortalPrestador = () => {
  // Dados fictícios para demonstração
  const prestador = {
    nome: "Clínica CardioSaúde",
    tipo: "clinica",
    especialidades: ["Cardiologia", "Clínica Geral"],
    totalGuias: 24,
    guiasNaoFaturadas: 8,
    valorAPagar: 3250.75,
    ultimoPagamento: new Date(2023, 4, 15),
    proximoPagamento: new Date(2023, 5, 20),
    guias: [
      {
        id: "guia-001",
        cliente: "Maria Santos",
        procedimento: "Consulta Cardiologista",
        dataAgendamento: new Date(2023, 4, 28),
        valor: 220.00,
        status: "realizada"
      },
      {
        id: "guia-002",
        cliente: "João Silva",
        procedimento: "Eletrocardiograma",
        dataAgendamento: new Date(2023, 5, 2),
        valor: 180.50,
        status: "agendada"
      },
      {
        id: "guia-003",
        cliente: "Ana Oliveira",
        procedimento: "Holter 24h",
        dataAgendamento: new Date(2023, 5, 5),
        valor: 350.00,
        status: "agendada"
      }
    ]
  };

  // Formatação de valores monetários
  const formatMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Bem-vindo, {prestador.nome}!
        </h2>
        <p className="text-gray-500 mt-1">
          Gerencie suas guias e faturamentos na plataforma AGENDAJA
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Guias Totais"
          value={prestador.totalGuias.toString()}
          icon={<FileText className="h-5 w-5" />}
          description="Guias recebidas este mês"
        />
        
        <StatCard
          title="Pendentes de Faturamento"
          value={prestador.guiasNaoFaturadas.toString()}
          icon={<Clipboard className="h-5 w-5" />}
          description="Guias que precisam ser faturadas"
        />
        
        <StatCard
          title="Valor a Receber"
          value={formatMoeda(prestador.valorAPagar)}
          icon={<Calendar className="h-5 w-5" />}
          description={`Próximo pagamento: ${format(prestador.proximoPagamento, "dd/MM/yyyy")}`}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Guias Recentes</CardTitle>
          <CardDescription>
            Últimas guias recebidas para atendimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {prestador.guias.map((guia) => (
              <Card key={guia.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="p-4 sm:p-6 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary mr-3">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{guia.cliente}</p>
                          <div className="text-sm text-gray-500">
                            {guia.procedimento}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-agendaja-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Data Agendada</p>
                          <p>{format(guia.dataAgendamento, "dd/MM/yyyy")}</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {format(guia.dataAgendamento, "EEEE", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-agendaja-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Valor</p>
                          <p>{formatMoeda(guia.valor)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 sm:p-6 sm:w-48 sm:border-l flex flex-col gap-2">
                    <Button className="bg-agendaja-primary hover:bg-agendaja-secondary">
                      Visualizar Guia
                    </Button>
                    
                    {guia.status === "realizada" && (
                      <Button variant="outline">
                        Faturar Guia
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="guias" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="guias">Guias Pendentes</TabsTrigger>
          <TabsTrigger value="faturadas">Faturadas</TabsTrigger>
          <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="guias" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Guias Pendentes de Faturamento</CardTitle>
              <CardDescription>
                Confirme a realização dos procedimentos para faturamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>As guias pendentes aparecerão aqui após serem realizadas.</p>
                <Button variant="outline" className="mt-4">
                  Ir para Guias
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faturadas" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Guias Faturadas</CardTitle>
              <CardDescription>
                Guias já faturadas aguardando pagamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma guia faturada no momento.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pagamentos" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <CardDescription>
                Pagamentos recebidos pela prestação de serviços
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Seu histórico de pagamentos aparecerá aqui.</p>
                <Button variant="outline" className="mt-4">
                  Ir para Faturamento
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortalPrestador;
