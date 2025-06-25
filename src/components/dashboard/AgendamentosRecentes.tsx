
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Agendamento {
  id: string;
  status: string;
  data_agendamento: string;
  horario: string;
  observacoes?: string;
  clientes?: {
    nome: string;
    cpf: string;
    telefone: string;
  };
  servicos?: {
    nome: string;
    categoria: string;
  };
  prestadores?: {
    nome: string;
    tipo: string;
  };
}

interface AgendamentosRecentesProps {
  agendamentos: Agendamento[];
}

const statusStyles = {
  agendado: "bg-blue-100 hover:bg-blue-100 text-blue-800",
  confirmado: "bg-green-100 hover:bg-green-100 text-green-800",
  cancelado: "bg-red-100 hover:bg-red-100 text-red-800",
  realizado: "bg-purple-100 hover:bg-purple-100 text-purple-800",
};

const AgendamentosRecentes: React.FC<AgendamentosRecentesProps> = ({ agendamentos }) => {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Agendamentos Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          {agendamentos.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum agendamento encontrado</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {agendamentos.map((agendamento) => (
                <li key={agendamento.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary mr-4">
                        {agendamento.clientes?.nome ? (
                          <span className="text-sm font-medium">
                            {agendamento.clientes.nome
                              .split(" ")
                              .map((n) => n.charAt(0))
                              .slice(0, 2)
                              .join("")}
                          </span>
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{agendamento.clientes?.nome || 'Cliente não informado'}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{agendamento.servicos?.nome || 'Serviço não informado'}</span>
                          <span className="mx-1.5">•</span>
                          <span>{agendamento.prestadores?.nome || 'Prestador não informado'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant="outline" className={statusStyles[agendamento.status as keyof typeof statusStyles] || "bg-gray-100 hover:bg-gray-100 text-gray-800"}>
                        {agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1)}
                      </Badge>
                      <div className="flex items-center mt-1.5 text-sm text-gray-500">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>
                          {format(new Date(agendamento.data_agendamento), "dd/MM/yyyy", { locale: ptBR })} às {agendamento.horario || 'Horário não definido'}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgendamentosRecentes;
