
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Calendar,
  Search,
  User
} from "lucide-react";
import { Orcamento } from "@/types";
import { format } from "date-fns";
import { orcamentos } from "@/data/mock";

const statusMap = {
  pendente: {
    label: "Pendente",
    color: "bg-yellow-100 hover:bg-yellow-100 text-yellow-800"
  },
  aprovado: {
    label: "Aprovado",
    color: "bg-green-100 hover:bg-green-100 text-green-800"
  },
  recusado: {
    label: "Recusado",
    color: "bg-red-100 hover:bg-red-100 text-red-800"
  },
  expirado: {
    label: "Expirado",
    color: "bg-gray-100 hover:bg-gray-100 text-gray-800"
  }
};

const formatarValor = (valor: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor / 100);
};

const Orcamentos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filtrar orçamentos com base no termo de busca
  const orcamentosFiltrados = orcamentos.filter((orcamento) => 
    orcamento.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orcamento.servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orcamento.clinica.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(orcamento.valorFinal).includes(searchTerm)
  );
  
  // Organizar por data de criação, mais recentes primeiro
  const orcamentosOrdenados = [...orcamentosFiltrados].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Orçamentos</h2>
        <p className="text-gray-500 mt-1">
          Gerencie todos os orçamentos enviados para clientes
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Lista de Orçamentos</CardTitle>
              <CardDescription>
                Total de {orcamentosFiltrados.length} orçamentos
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar orçamentos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Prestador</TableHead>
                  <TableHead>Valor Final</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orcamentosOrdenados.map((orcamento) => (
                  <TableRow key={orcamento.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary mr-2">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{orcamento.cliente?.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell>{orcamento.servico}</TableCell>
                    <TableCell>{orcamento.clinica}</TableCell>
                    <TableCell className="font-medium">
                      {formatarValor(orcamento.valorFinal)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                        <div className="flex flex-col">
                          <span>{format(orcamento.createdAt, "dd/MM/yyyy")}</span>
                          <span className="text-xs text-gray-500">
                            Validade: {format(orcamento.dataValidade, "dd/MM/yyyy")}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusMap[orcamento.status].color}>
                        {statusMap[orcamento.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-agendaja-primary hover:text-agendaja-primary/80 hover:bg-agendaja-light/50"
                      >
                        Visualizar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orcamentos;
