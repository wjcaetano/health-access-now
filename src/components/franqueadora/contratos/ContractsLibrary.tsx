
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Download, Edit, Plus, Eye } from "lucide-react";

interface ContractTemplate {
  id: string;
  nome: string;
  categoria: 'franquia' | 'master' | 'microfranquia' | 'aditivo';
  versao: string;
  data_criacao: string;
  ativo: boolean;
  descricao: string;
  arquivo_url?: string;
}

const mockTemplates: ContractTemplate[] = [
  {
    id: '1',
    nome: 'Contrato de Franquia Padrão',
    categoria: 'franquia',
    versao: '2.1',
    data_criacao: '2024-01-15',
    ativo: true,
    descricao: 'Modelo padrão para contratos de franquia tradicional',
    arquivo_url: '/templates/contrato-franquia-padrao.pdf'
  },
  {
    id: '2',
    nome: 'Contrato Master Franquia',
    categoria: 'master',
    versao: '1.3',
    data_criacao: '2024-02-01',
    ativo: true,
    descricao: 'Modelo para contratos de master franquia',
    arquivo_url: '/templates/contrato-master.pdf'
  },
  {
    id: '3',
    nome: 'Microfranquia',
    categoria: 'microfranquia',
    versao: '1.0',
    data_criacao: '2024-03-10',
    ativo: true,
    descricao: 'Modelo simplificado para microfranquias',
    arquivo_url: '/templates/microfranquia.pdf'
  },
  {
    id: '4',
    nome: 'Aditivo Contratual',
    categoria: 'aditivo',
    versao: '1.2',
    data_criacao: '2024-01-20',
    ativo: true,
    descricao: 'Modelo para aditivos contratuais',
    arquivo_url: '/templates/aditivo.pdf'
  }
];

export default function ContractsLibrary() {
  const [templates, setTemplates] = useState<ContractTemplate[]>(mockTemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || template.categoria === selectedCategory;
    return matchesSearch && matchesCategory && template.ativo;
  });

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'franquia': return 'bg-blue-100 text-blue-800';
      case 'master': return 'bg-purple-100 text-purple-800';
      case 'microfranquia': return 'bg-green-100 text-green-800';
      case 'aditivo': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (categoria: string) => {
    switch (categoria) {
      case 'franquia': return 'Franquia';
      case 'master': return 'Master';
      case 'microfranquia': return 'Microfranquia';
      case 'aditivo': return 'Aditivo';
      default: return categoria;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Biblioteca de Modelos</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie os modelos de contratos disponíveis
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Modelo
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar modelos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="todos">Todas as categorias</option>
          <option value="franquia">Franquia</option>
          <option value="master">Master</option>
          <option value="microfranquia">Microfranquia</option>
          <option value="aditivo">Aditivo</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base mb-2">{template.nome}</CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getCategoryColor(template.categoria)}>
                      {getCategoryLabel(template.categoria)}
                    </Badge>
                    <Badge variant="outline">v{template.versao}</Badge>
                  </div>
                </div>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {template.descricao}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Criado em {new Date(template.data_criacao).toLocaleDateString('pt-BR')}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  Visualizar
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-3 w-3 mr-1" />
                  Baixar
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Nenhum modelo encontrado
          </h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros ou criar um novo modelo.
          </p>
        </div>
      )}
    </div>
  );
}
