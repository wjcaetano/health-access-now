import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useClienteDetalhes } from "@/hooks/useClienteDetalhes";
import { useUpdateCliente } from "@/hooks/useClientes";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Edit2, ShoppingCart, Calendar, FileText, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClienteDetalhesDialogProps {
  clienteId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ClienteDetalhesDialog({
  clienteId,
  open,
  onOpenChange,
}: ClienteDetalhesDialogProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const {
    cliente,
    isLoadingCliente,
    vendas,
    isLoadingVendas,
    agendamentos,
    isLoadingAgendamentos,
    orcamentos,
    isLoadingOrcamentos,
  } = useClienteDetalhes(clienteId);

  const updateCliente = useUpdateCliente();

  React.useEffect(() => {
    if (cliente) {
      setFormData({
        nome: cliente.nome || "",
        cpf: cliente.cpf || "",
        telefone: cliente.telefone || "",
        email: cliente.email || "",
        endereco: cliente.endereco || "",
        id_associado: cliente.id_associado || "",
      });
    }
  }, [cliente]);

  const handleSave = async () => {
    if (!clienteId) return;

    try {
      await updateCliente.mutateAsync({
        id: clienteId,
        updates: formData,
      });
      setEditMode(false);
      toast({
        title: "Cliente atualizado",
        description: "As informações foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar as informações.",
        variant: "destructive",
      });
    }
  };

  const handleNovaVenda = () => {
    onOpenChange(false);
    navigate(`/hub/sales/new?clienteId=${clienteId}`);
  };

  if (isLoadingCliente) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner size="lg" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!cliente) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Cliente
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="vendas">Vendas</TabsTrigger>
            <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
            <TabsTrigger value="orcamentos">Orçamentos</TabsTrigger>
          </TabsList>

          {/* Tab Informações */}
          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Dados Pessoais</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (editMode ? handleSave() : setEditMode(true))}
                  disabled={updateCliente.isPending}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  {editMode ? "Salvar" : "Editar"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    {editMode ? (
                      <Input
                        value={formData.nome}
                        onChange={(e) =>
                          setFormData({ ...formData, nome: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm font-medium">{cliente.nome}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>CPF</Label>
                    {editMode ? (
                      <Input
                        value={formData.cpf}
                        onChange={(e) =>
                          setFormData({ ...formData, cpf: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm font-medium">{cliente.cpf}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    {editMode ? (
                      <Input
                        value={formData.telefone}
                        onChange={(e) =>
                          setFormData({ ...formData, telefone: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm font-medium">{cliente.telefone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    {editMode ? (
                      <Input
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm font-medium">{cliente.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>ID Associado</Label>
                    {editMode ? (
                      <Input
                        value={formData.id_associado}
                        onChange={(e) =>
                          setFormData({ ...formData, id_associado: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm font-medium">{cliente.id_associado}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Data de Cadastro</Label>
                    <p className="text-sm font-medium">
                      {format(new Date(cliente.data_cadastro), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label>Endereço</Label>
                    {editMode ? (
                      <Input
                        value={formData.endereco}
                        onChange={(e) =>
                          setFormData({ ...formData, endereco: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm font-medium">
                        {cliente.endereco || "Não informado"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <Button onClick={handleNovaVenda} className="flex-1">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Nova Venda
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Vendas */}
          <TabsContent value="vendas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Vendas</CardTitle>
                <CardDescription>
                  Últimas 10 vendas realizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingVendas ? (
                  <LoadingSpinner />
                ) : vendas.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhuma venda encontrada
                  </p>
                ) : (
                  <div className="space-y-2">
                    {vendas.map((venda: any) => (
                      <div
                        key={venda.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {formatCurrency(venda.valor_total)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(venda.created_at), "dd/MM/yyyy HH:mm", {
                              locale: ptBR,
                            })}
                          </p>
                        </div>
                        <Badge variant="outline">{venda.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Agendamentos */}
          <TabsContent value="agendamentos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Agendamentos</CardTitle>
                <CardDescription>
                  Últimos 10 agendamentos realizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAgendamentos ? (
                  <LoadingSpinner />
                ) : agendamentos.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhum agendamento encontrado
                  </p>
                ) : (
                  <div className="space-y-2">
                    {agendamentos.map((agendamento: any) => (
                      <div
                        key={agendamento.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {agendamento.servicos?.nome || "Serviço"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(
                              new Date(agendamento.data_agendamento),
                              "dd/MM/yyyy",
                              { locale: ptBR }
                            )}{" "}
                            às {agendamento.horario}
                          </p>
                        </div>
                        <Badge variant="outline">{agendamento.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Orçamentos */}
          <TabsContent value="orcamentos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Orçamentos</CardTitle>
                <CardDescription>
                  Últimos 10 orçamentos realizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOrcamentos ? (
                  <LoadingSpinner />
                ) : orcamentos.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhum orçamento encontrado
                  </p>
                ) : (
                  <div className="space-y-2">
                    {orcamentos.map((orcamento: any) => (
                      <div
                        key={orcamento.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {formatCurrency(orcamento.valor_final)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(orcamento.created_at), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                            {" - Válido até "}
                            {format(
                              new Date(orcamento.data_validade),
                              "dd/MM/yyyy",
                              { locale: ptBR }
                            )}
                          </p>
                        </div>
                        <Badge variant="outline">{orcamento.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
