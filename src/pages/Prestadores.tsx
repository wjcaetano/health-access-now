
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Building, User, Phone, Mail, Edit, Trash2, Plus } from "lucide-react";
import { usePrestadores } from "@/hooks/usePrestadores";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Prestadores = () => {
  const navigate = useNavigate();
  const { data: prestadores, isLoading, error } = usePrestadores();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) return <div>Carregando prestadores...</div>;
  if (error) return <div>Erro ao carregar prestadores: {error.message}</div>;

  const prestadoresFiltrados = prestadores?.filter((prestador) =>
    prestador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prestador.cnpj.includes(searchTerm) ||
    prestador.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'clinica':
        return <Building className="h-6 w-6" />;
      case 'laboratorio':
        return <Building className="h-6 w-6" />;
      case 'profissional':
        return <User className="h-6 w-6" />;
      default:
        return <Building className="h-6 w-6" />;
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'clinica':
        return 'Clínica';
      case 'laboratorio':
        return 'Laboratório';
      case 'profissional':
        return 'Profissional';
      default:
        return tipo;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Prestadores</h2>
          <p className="text-gray-500 mt-1">
            Gerencie clínicas, laboratórios e profissionais parceiros
          </p>
        </div>
        <Button 
          onClick={() => navigate("/dashboard/prestadores/novo")}
          className="bg-agendaja-primary hover:bg-agendaja-secondary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Prestador
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Prestadores Cadastrados ({prestadoresFiltrados.length})</span>
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por nome, CNPJ ou email..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {prestadoresFiltrados.map((prestador) => (
              <div
                key={prestador.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 space-y-4 md:space-y-0"
              >
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 flex-1">
                  <div className="h-12 w-12 rounded-full bg-agendaja-light flex items-center justify-center text-agendaja-primary shrink-0">
                    {getTipoIcon(prestador.tipo)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg">{prestador.nome}</h3>
                    <ScrollArea className="h-16 md:h-auto">
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 text-sm text-gray-500 space-y-1 md:space-y-0">
                        <span className="break-all">{prestador.cnpj}</span>
                        <span className="flex items-center">
                          <Phone className="h-3 w-3 mr-1 shrink-0" />
                          {prestador.telefone}
                        </span>
                        <span className="flex items-center break-all">
                          <Mail className="h-3 w-3 mr-1 shrink-0" />
                          {prestador.email}
                        </span>
                      </div>
                    </ScrollArea>
                    {prestador.especialidades && prestador.especialidades.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {prestador.especialidades.map((esp, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {esp}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-row md:flex-col lg:flex-row items-center space-x-2 md:space-x-0 md:space-y-2 lg:space-y-0 lg:space-x-2 shrink-0">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 whitespace-nowrap">
                    {getTipoLabel(prestador.tipo)}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`whitespace-nowrap ${prestador.ativo ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                  >
                    {prestador.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {prestadoresFiltrados.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                {searchTerm ? "Nenhum prestador encontrado" : "Nenhum prestador cadastrado"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Prestadores;
