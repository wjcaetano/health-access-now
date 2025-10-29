import React, { useState, useMemo, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Phone, Mail, MapPin, Edit, Trash2 } from "lucide-react";
import { useClientes, useDeleteCliente } from "@/hooks/useClientes";
import { useIsMobile } from "@/hooks/use-mobile";
import OptimizedTable from "@/components/shared/OptimizedTable";
import { ClientesSkeleton } from "./ClientesSkeleton";
import ClienteDetalhesDialog from "@/components/clientes/ClienteDetalhesDialog";
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

// Memoized components
const ClienteCard = memo(({ 
  cliente, 
  onDelete, 
  onClick 
}: { 
  cliente: any; 
  onDelete: (id: string) => void;
  onClick: () => void;
}) => (
  <div 
    className="border rounded-lg p-4 bg-white cursor-pointer hover:shadow-md transition-shadow"
    onClick={onClick}
  >
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary flex-shrink-0">
          <User className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-base text-gray-900 truncate">
            {cliente.nome}
          </h3>
          <p className="text-sm text-gray-500">{cliente.cpf}</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 text-xs shrink-0">
          ID: {cliente.id_associado}
        </Badge>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Phone className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{cliente.telefone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{cliente.email}</span>
        </div>
        {cliente.endereco && (
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{cliente.endereco}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-end items-center gap-2 pt-2 border-t">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o cliente {cliente.nome}? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(cliente.id);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  </div>
));
ClienteCard.displayName = "ClienteCard";

const OptimizedClientesLista = memo(() => {
  const { data: clientes, isLoading, error } = useClientes();
  const deleteCliente = useDeleteCliente();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClienteId, setSelectedClienteId] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  // Memoized filtered data
  const clientesFiltrados = useMemo(() => {
    if (!clientes) return [];
    return clientes.filter((cliente) =>
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.cpf.includes(searchTerm) ||
      cliente.telefone.includes(searchTerm) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clientes, searchTerm]);

  const handleClienteClick = (clienteId: string) => {
    setSelectedClienteId(clienteId);
    setDetailsDialogOpen(true);
  };

  // Memoized table columns
  const columns = useMemo(() => [
    {
      header: "Cliente",
      accessorKey: "nome",
      cell: ({ row }: { row: any }) => (
        <div 
          className="flex items-start space-x-3 cursor-pointer hover:bg-muted/50 -m-2 p-2 rounded"
          onClick={() => handleClienteClick(row.original.id)}
        >
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary flex-shrink-0">
            <User className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-base md:text-lg text-gray-900 truncate">
              {row.original.nome}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-500 mt-1">
              <span className="flex items-center">
                <User className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{row.original.cpf}</span>
              </span>
              <span className="flex items-center">
                <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{row.original.telefone}</span>
              </span>
              <span className="flex items-center sm:col-span-2">
                <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate" title={row.original.email}>{row.original.email}</span>
              </span>
              {row.original.endereco && (
                <span className="flex items-center sm:col-span-2">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate" title={row.original.endereco}>{row.original.endereco}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "ID",
      accessorKey: "id_associado",
      cell: ({ row }: { row: any }) => (
        <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
          ID: {row.original.id_associado}
        </Badge>
      ),
    },
    {
      header: "Ações",
      id: "actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              handleClienteClick(row.original.id);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir o cliente {row.original.nome}? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCliente.mutate(row.original.id);
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ], [deleteCliente]);

  const handleDeleteCliente = (id: string) => {
    deleteCliente.mutate(id);
  };

  if (isLoading) return <ClientesSkeleton />;
  
  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Erro ao carregar clientes: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader className={isMobile ? "p-4" : "p-4 md:p-6"}>
          <CardTitle className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <span className={isMobile ? "text-lg" : "text-lg md:text-xl"}>
                Clientes Cadastrados ({clientesFiltrados.length})
              </span>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por nome, CPF, telefone ou email..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className={isMobile ? "p-2" : "p-0"}>
          {isMobile ? (
            // Layout móvel com cards otimizados
            <div className="space-y-3">
              {clientesFiltrados.map((cliente) => (
                <ClienteCard 
                  key={cliente.id} 
                  cliente={cliente} 
                  onDelete={handleDeleteCliente}
                  onClick={() => handleClienteClick(cliente.id)}
                />
              ))}
            </div>
          ) : (
            // Layout desktop com OptimizedTable
            <OptimizedTable 
              data={clientesFiltrados}
              columns={columns}
              loading={isLoading}
              pageSize={20}
            />
          )}
          {clientesFiltrados.length === 0 && (
            <div className="text-center text-gray-500 py-8 px-4">
              {searchTerm ? "Nenhum cliente encontrado com os critérios de busca" : "Nenhum cliente cadastrado ainda"}
            </div>
          )}
        </CardContent>
      </Card>

      <ClienteDetalhesDialog
        clienteId={selectedClienteId}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </>
  );
});

OptimizedClientesLista.displayName = "OptimizedClientesLista";

export default OptimizedClientesLista;
