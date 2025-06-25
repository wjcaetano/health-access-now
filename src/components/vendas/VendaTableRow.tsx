
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import VendaInfo from "./VendaInfo";
import VendaStatus from "./VendaStatus";
import VendaActions from "./VendaActions";
import { formatCurrency, formatarMetodoPagamento } from "@/lib/formatters";

interface Venda {
  id: string;
  valor_total: number;
  metodo_pagamento: string;
  status: string;
  observacoes?: string;
  created_at: string;
  clientes?: {
    nome: string;
    cpf: string;
    telefone?: string;
    email?: string;
    id_associado?: string;
  };
  vendas_servicos?: Array<{
    id: string;
    servicos?: {
      nome: string;
      categoria: string;
    };
    prestadores?: {
      nome: string;
      especialidades?: string[];
    };
    valor: number;
    servico_id: string;
    prestador_id: string;
  }>;
}

interface VendaTableRowProps {
  venda: Venda;
  onCancelar: (vendaId: string) => void;
  onEstornar: (vendaId: string) => void;
  onImprimirRecibo: (venda: Venda) => void;
  onImprimirGuias: (venda: Venda) => void;
  isLoading: boolean;
  impressaoAtiva: {tipo: 'recibo' | 'guia', vendaId: string} | null;
}

const VendaTableRow: React.FC<VendaTableRowProps> = ({
  venda,
  onCancelar,
  onEstornar,
  onImprimirRecibo,
  onImprimirGuias,
  isLoading,
  impressaoAtiva
}) => {
  return (
    <TableRow key={venda.id}>
      <TableCell>
        <VendaInfo 
          nome={venda.clientes?.nome || 'Cliente não identificado'}
          cpf={venda.clientes?.cpf || ''}
        />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-4 w-4" />
          {format(new Date(venda.created_at), "dd/MM/yy", { locale: ptBR })}
        </div>
      </TableCell>
      <TableCell>
        <span className="font-bold text-green-600">
          {formatCurrency(venda.valor_total)}
        </span>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <span className="capitalize text-sm">
          {formatarMetodoPagamento(venda.metodo_pagamento)}
        </span>
      </TableCell>
      <TableCell>
        <VendaStatus status={venda.status} />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <div className="max-w-32">
          {venda.vendas_servicos?.slice(0, 2).map((vs, index) => (
            <p key={index} className="text-xs text-gray-600 truncate">
              {vs.servicos?.nome}
            </p>
          ))}
          {(venda.vendas_servicos?.length || 0) > 2 && (
            <p className="text-xs text-gray-400">
              +{(venda.vendas_servicos?.length || 0) - 2} mais
            </p>
          )}
        </div>
      </TableCell>
      <TableCell>
        <VendaActions
          venda={venda}
          onCancelar={onCancelar}
          onEstornar={onEstornar}
          onImprimirRecibo={onImprimirRecibo}
          onImprimirGuias={onImprimirGuias}
          isLoading={isLoading}
          impressaoAtiva={impressaoAtiva}
        />
      </TableCell>
    </TableRow>
  );
};

export default VendaTableRow;
