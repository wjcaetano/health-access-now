
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Orcamento } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OrcamentosRecentesProps {
  orcamentos: Orcamento[];
}

const statusStyles = {
  pendente: "bg-yellow-100 hover:bg-yellow-100 text-yellow-800",
  aprovado: "bg-green-100 hover:bg-green-100 text-green-800",
  recusado: "bg-red-100 hover:bg-red-100 text-red-800",
  expirado: "bg-gray-100 hover:bg-gray-100 text-gray-800",
};

const formatarValor = (valor: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor / 100);
};

const OrcamentosRecentes: React.FC<OrcamentosRecentesProps> = ({ orcamentos }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Orçamentos Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {orcamentos.map((orcamento) => (
              <li key={orcamento.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{orcamento.cliente?.nome}</p>
                    <p className="text-sm text-gray-500">{orcamento.servico}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-agendaja-primary">
                      {formatarValor(orcamento.valorFinal)}
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <Badge variant="outline" className={statusStyles[orcamento.status]}>
                        {orcamento.status.charAt(0).toUpperCase() + orcamento.status.slice(1)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Válido até: {format(orcamento.dataValidade, "dd/MM")}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrcamentosRecentes;
