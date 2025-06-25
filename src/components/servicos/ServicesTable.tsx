
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { FileText } from "lucide-react";

interface ServicesTableProps {
  servicosFiltrados: any[];
  formatMoeda: (valor: number) => string;
}

const ServicesTable: React.FC<ServicesTableProps> = ({
  servicosFiltrados,
  formatMoeda
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome do Serviço</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Valor de Custo</TableHead>
            <TableHead>Valor de Venda</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {servicosFiltrados.map((servico) => (
            <TableRow key={servico.id}>
              <TableCell className="font-medium">{servico.nome}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-gray-100 hover:bg-gray-100">
                  {servico.categoria}
                </Badge>
              </TableCell>
              <TableCell>{formatMoeda(servico.valor_custo)}</TableCell>
              <TableCell>{formatMoeda(servico.valor_venda)}</TableCell>
              <TableCell>
                <Badge variant="outline" className={
                  servico.ativo 
                    ? "bg-green-100 text-green-800 hover:bg-green-100" 
                    : "bg-red-100 text-red-800 hover:bg-red-100"
                }>
                  {servico.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" className="text-agendaja-primary hover:text-agendaja-primary/80 hover:bg-agendaja-light/50">
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
          
          {servicosFiltrados.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <FileText className="h-8 w-8 mb-2" />
                  <p>Nenhum serviço encontrado</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServicesTable;
