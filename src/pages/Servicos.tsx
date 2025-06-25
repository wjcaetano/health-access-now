
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  User, 
  FileText,
  Clipboard,
  Link,
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useServicos } from "@/hooks/useServicos";
import { usePrestadores } from "@/hooks/usePrestadores";
import GerenciarVinculos from "@/components/servicos/GerenciarVinculos";

const Servicos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [prestadorFiltro, setPrestadorFiltro] = useState("todos");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  
  const { data: servicos, isLoading: carregandoServicos } = useServicos();
  const { data: prestadores, isLoading: carregandoPrestadores } = usePrestadores();
  
  // Extrair categorias únicas para o filtro
  const categorias = Array.from(new Set(servicos?.map(s => s.categoria) || []));
  
  // Aplicar filtros
  const servicosFiltrados = servicos?.filter(servico => {
    const matchBusca = 
      !searchTerm || 
      servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servico.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchCategoria = categoriaFiltro === "todas" || servico.categoria === categoriaFiltro;
    const matchPrestador = prestadorFiltro === "todos" || servico.prestador_id === prestadorFiltro;
    const matchStatus = statusFiltro === "todos" || 
      (statusFiltro === "ativo" && servico.ativo) || 
      (statusFiltro === "inativo" && !servico.ativo);
    
    return matchBusca && matchCategoria && matchPrestador && matchStatus;
  }) || [];

  const formatMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  if (carregandoServicos || carregandoPrestadores) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-8">
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Serviços</h2>
          <p className="text-gray-500 mt-1">
            Gerencie todos os serviços e prestadores da plataforma
          </p>
        </div>
        <RouterLink to="/novo-servico">
          <Button className="bg-agendaja-primary hover:bg-agendaja-secondary">
            <Plus className="h-5 w-5 mr-2" />
            Novo Serviço
          </Button>
        </RouterLink>
      </div>

      <Tabs defaultValue="servicos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="servicos">Lista de Serviços</TabsTrigger>
          <TabsTrigger value="vinculos">Gerenciar Vínculos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="servicos">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Lista de Serviços</CardTitle>
                  <CardDescription>
                    Total de {servicosFiltrados.length} serviços cadastrados
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={prestadorFiltro} onValueChange={setPrestadorFiltro}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Prestador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      {prestadores?.map((prestador) => (
                        <SelectItem key={prestador.id} value={prestador.id}>{prestador.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={statusFiltro} onValueChange={setStatusFiltro}>
                    <SelectTrigger className="w-full sm:w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="ativo">Ativos</SelectItem>
                      <SelectItem value="inativo">Inativos</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Buscar serviços..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vinculos">
          <GerenciarVinculos />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Servicos;
