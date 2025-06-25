
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Eye,
  Calendar,
  Receipt,
  FileText,
  Printer
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCancelarVenda, useEstornarVenda } from "@/hooks/useVendas";
import { useToast } from "@/hooks/use-toast";
import ReciboVenda from "./ReciboVenda";
import GuiaServico from "./GuiaServico";

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

const statusStyles = {
  concluida: "bg-green-100 hover:bg-green-100 text-green-800",
  cancelada: "bg-red-100 hover:bg-red-100 text-red-800",
  estornada: "bg-orange-100 hover:bg-orange-100 text-orange-800",
};

const formatarValor = (valor: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};

const formatarMetodoPagamento = (metodo: string) => {
  const metodos: Record<string, string> = {
    'dinheiro': 'Dinheiro',
    'cartao_credito': 'Cartão de Crédito',
    'cartao_debito': 'Cartão de Débito',
    'pix': 'PIX',
    'transferencia': 'Transferência',
    'boleto': 'Boleto'
  };
  return metodos[metodo] || metodo.replace('_', ' ');
};

const ListaVendas: React.FC<ListaVendasProps> = ({ vendas }) => {
  const { mutate: cancelarVenda, isPending: isCanceling } = useCancelarVenda();
  const { mutate: estornarVenda, isPending: isEstornando } = useEstornarVenda();
  const { toast } = useToast();
  const [impressaoAtiva, setImpressaoAtiva] = useState<{tipo: 'recibo' | 'guia', vendaId: string} | null>(null);

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

  const gerarCodigoGuia = (vendaId: string, index: number) => {
    return `AG${vendaId.slice(0, 8).toUpperCase()}${(index + 1).toString().padStart(2, '0')}`;
  };

  const imprimirRecibo = (venda: Venda) => {
    setImpressaoAtiva({ tipo: 'recibo', vendaId: venda.id });
    
    setTimeout(() => {
      const printContent = document.querySelector(`#recibo-${venda.id}`);
      if (printContent) {
        const originalBody = document.body.innerHTML;
        document.body.innerHTML = printContent.outerHTML;
        window.print();
        document.body.innerHTML = originalBody;
        window.location.reload();
      }
      setImpressaoAtiva(null);
    }, 500);
  };

  const imprimirGuias = (venda: Venda) => {
    setImpressaoAtiva({ tipo: 'guia', vendaId: venda.id });
    
    setTimeout(() => {
      const printContent = document.querySelector(`#guias-${venda.id}`);
      if (printContent) {
        const originalBody = document.body.innerHTML;
        document.body.innerHTML = printContent.outerHTML;
        window.print();
        document.body.innerHTML = originalBody;
        window.location.reload();
      }
      setImpressaoAtiva(null);
    }, 500);
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
                  <TableRow key={venda.id}>
                    <TableCell>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{venda.clientes?.nome || 'Cliente não identificado'}</p>
                        <p className="text-sm text-gray-500 truncate">{venda.clientes?.cpf}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(venda.created_at), "dd/MM/yy", { locale: ptBR })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-green-600">
                        {formatarValor(venda.valor_total)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="capitalize text-sm">
                        {formatarMetodoPagamento(venda.metodo_pagamento)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={statusStyles[venda.status as keyof typeof statusStyles] || "bg-gray-100 hover:bg-gray-100 text-gray-800"}
                      >
                        {venda.status === 'concluida' ? 'Concluída' : 
                         venda.status === 'cancelada' ? 'Cancelada' : 
                         venda.status === 'estornada' ? 'Estornada' : venda.status}
                      </Badge>
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
                      <div className="flex items-center justify-center gap-1">
                        {venda.status === 'concluida' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => imprimirRecibo(venda)}
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
                              onClick={() => imprimirGuias(venda)}
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
                                  disabled={isCanceling}
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
                                    onClick={() => handleCancelar(venda.id)}
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
                                  disabled={isEstornando}
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
                                    onClick={() => handleEstornar(venda.id)}
                                    className="bg-orange-600 hover:bg-orange-700"
                                  >
                                    Confirmar Estorno
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
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
