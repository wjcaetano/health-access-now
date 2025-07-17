
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText } from "lucide-react";

interface Orcamento {
  id: string;
  status: string;
  valor_final: number;
  data_validade: string;
  created_at: string;
  clientes?: {
    id: string;
    nome: string;
    cpf: string;
  };
  servicos?: {
    id: string;
    nome: string;
    categoria: string;
  };
  prestadores?: {
    id: string;
    nome: string;
  };
}

interface OrcamentosRecentesProps {
  orcamentos: Orcamento[];
}

const statusStyles = {
  pendente: "bg-yellow-100 hover:bg-yellow-100 text-yellow-800",
  aprovado: "bg-green-100 hover:bg-green-100 text-green-800",
  recusado: "bg-red-100 hover:bg-red-100 text-red-800",
  expirado: "bg-gray-100 hover:bg-gray-100 text-gray-800",
  cancelado: "bg-red-100 hover:bg-red-100 text-red-800",
};

const formatarValor = (valor: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};

const OrcamentosRecentes: React.FC<OrcamentosRecentesProps> = ({ orcamentos }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Orçamentos Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          {orcamentos.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum orçamento encontrado</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {orcamentos.map((orcamento) => (
                <li key={orcamento.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{orcamento.clientes?.nome || 'Cliente não informado'}</p>
                      <p className="text-sm text-gray-500">{orcamento.servicos?.nome || 'Serviço não informado'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-agendaja-primary">
                        {formatarValor(orcamento.valor_final)}
                      </p>
                      <div className="flex items-center justify-end gap-2 mt-1">
                        <Badge variant="outline" className={statusStyles[orcamento.status as keyof typeof statusStyles] || "bg-gray-100 hover:bg-gray-100 text-gray-800"}>
                          {orcamento.status.charAt(0).toUpperCase() + orcamento.status.slice(1)}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Válido até: {format(new Date(orcamento.data_validade), "dd/MM", { locale: ptBR })}
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

export default OrcamentosRecentes;
