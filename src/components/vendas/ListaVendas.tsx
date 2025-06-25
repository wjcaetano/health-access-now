
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { useCancelarVenda, useEstornarVenda } from "@/hooks/useVendas";
import { useToast } from "@/hooks/use-toast";
import { useVendaImpressao } from "@/hooks/useVendaImpressao";
import VendaTableRow from "./VendaTableRow";
import ReciboVenda from "./ReciboVenda";
import GuiaServico from "./GuiaServico";
import { formatarMetodoPagamento } from "@/lib/formatters";

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

interface ListaVendasProps {
  vendas: Venda[];
}

const ListaVendas: React.FC<ListaVendasProps> = ({ vendas }) => {
  const { mutate: cancelarVenda, isPending: isCanceling } = useCancelarVenda();
  const { mutate: estornarVenda, isPending: isEstornando } = useEstornarVenda();
  const { toast } = useToast();
  const { impressaoAtiva, imprimirRecibo, imprimirGuias, gerarCodigoGuia } = useVendaImpressao();

  const handleCancelar = (vendaId: string) => {
    cancelarVenda(vendaId, {
      onSuccess: () => {
        toast({
          title: "Venda cancelada",
          description: "A venda foi cancelada com sucesso."
        });
      },
      onError: (error) => {
        toast({
          title: "Erro ao cancelar",
          description: "Ocorreu um erro ao cancelar a venda.",
          variant: "destructive"
        });
        console.error('Erro ao cancelar venda:', error);
      }
    });
  };

  const handleEstornar = (vendaId: string) => {
    estornarVenda(vendaId, {
      onSuccess: () => {
        toast({
          title: "Venda estornada",
          description: "A venda foi estornada com sucesso."
        });
      },
      onError: (error) => {
        toast({
          title: "Erro ao estornar",
          description: "Ocorreu um erro ao estornar a venda.",
          variant: "destructive"
        });
        console.error('Erro ao estornar venda:', error);
      }
    });
  };

  if (vendas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vendas Realizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Nenhuma venda encontrada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Vendas Realizadas ({vendas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="hidden md:table-cell">Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="hidden lg:table-cell">Pagamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Serviços</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendas.map((venda) => (
                  <VendaTableRow
                    key={venda.id}
                    venda={venda}
                    onCancelar={handleCancelar}
                    onEstornar={handleEstornar}
                    onImprimirRecibo={imprimirRecibo}
                    onImprimirGuias={imprimirGuias}
                    isLoading={isCanceling || isEstornando}
                    impressaoAtiva={impressaoAtiva}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Componentes de impressão ocultos */}
      {vendas.map((venda) => (
        <div key={`print-${venda.id}`} className="hidden">
          <div id={`recibo-${venda.id}`} className="print:block">
            <ReciboVenda
              venda={venda}
              cliente={venda.clientes!}
              servicos={venda.vendas_servicos || []}
              metodoPagamento={formatarMetodoPagamento(venda.metodo_pagamento)}
            />
          </div>
          
          <div id={`guias-${venda.id}`} className="print:block">
            {venda.vendas_servicos?.map((servico, index) => (
              <GuiaServico
                key={`guia-${servico.id}`}
                venda={venda}
                cliente={venda.clientes!}
                servico={servico}
                codigoGuia={gerarCodigoGuia(venda.id, index)}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default ListaVendas;
