
import React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Ban, 
  RotateCcw, 
  Receipt,
  FileText,
  Printer
} from "lucide-react";

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

interface VendaActionsProps {
  venda: Venda;
  onCancelar: (vendaId: string) => void;
  onEstornar: (vendaId: string) => void;
  onImprimirRecibo: (venda: Venda) => void;
  onImprimirGuias: (venda: Venda) => void;
  isLoading: boolean;
  impressaoAtiva: {tipo: 'recibo' | 'guia', vendaId: string} | null;
}

const VendaActions: React.FC<VendaActionsProps> = ({
  venda,
  onCancelar,
  onEstornar,
  onImprimirRecibo,
  onImprimirGuias,
  isLoading,
  impressaoAtiva
}) => {
  if (venda.status !== 'concluida') {
    return (
      <div className="flex items-center justify-center gap-1">
        <span className="text-xs text-gray-400">Sem ações</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onImprimirRecibo(venda)}
        disabled={impressaoAtiva?.tipo === 'recibo' && impressaoAtiva?.vendaId === venda.id}
        title="Imprimir Recibo"
      >
        {impressaoAtiva?.tipo === 'recibo' && impressaoAtiva?.vendaId === venda.id ? (
          <Printer className="h-3 w-3 animate-pulse" />
        ) : (
          <Receipt className="h-3 w-3" />
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onImprimirGuias(venda)}
        disabled={impressaoAtiva?.tipo === 'guia' && impressaoAtiva?.vendaId === venda.id}
        title="Imprimir Guias"
      >
        {impressaoAtiva?.tipo === 'guia' && impressaoAtiva?.vendaId === venda.id ? (
          <Printer className="h-3 w-3 animate-pulse" />
        ) : (
          <FileText className="h-3 w-3" />
        )}
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={isLoading}
            title="Cancelar Venda"
          >
            <Ban className="h-3 w-3" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Venda</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta venda? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onCancelar(venda.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={isLoading}
            title="Estornar Venda"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Estornar Venda</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja estornar esta venda? O valor será devolvido ao cliente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onEstornar(venda.id)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Confirmar Estorno
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VendaActions;
