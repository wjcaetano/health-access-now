
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

const GestaoEquipe = () => {
  const [activeTab, setActiveTab] = useState("colaboradores");

  const colaboradores = [
    {
      id: 1,
      nome: "Ana Silva",
      cargo: "Atendente",
      status: "trabalhando",
      entrada: "08:00",
      saida: null,
      horasTrabalho: "6h 30min",
      vendas: 8,
      valorVendas: 2400,
      meta: 3000,
      foto: null
    },
    {
      id: 2,
      nome: "Carlos Santos",
      cargo: "Gerente",
      status: "trabalhando",
      entrada: "07:30",
      saida: null,
      horasTrabalho: "7h 00min",
      vendas: 12,
      valorVendas: 4800,
      meta: 5000,
      foto: null
    },
    {
      id: 3,
      nome: "Maria Costa",
      cargo: "Atendente",
      status: "fora_trabalho",
      entrada: "08:00",
      saida: "17:00",
      horasTrabalho: "8h 00min",
      vendas: 6,
      valorVendas: 1800,
      meta: 2500,
      foto: null
    }
  ];

  const prestadores = [
    {
      id: 1,
      nome: "Dr. João Carvalho",
      especialidade: "Cardiologia",
      status: "disponivel",
      proximoAtendimento: "09:30",
      atendimentosHoje: 6,
      avaliacaoMedia: 4.8,
      telefone: "(11) 99999-1234",
      email: "joao@exemplo.com"
    },
    {
      id: 2,
      nome: "Dra. Sandra Lima",
      especialidade: "Clínica Geral",
      status: "ocupado",
      proximoAtendimento: "10:00",
      atendimentosHoje: 8,
      avaliacaoMedia: 4.9,
      telefone: "(11) 99999-5678",
      email: "sandra@exemplo.com"
    },
    {
      id: 3,
      nome: "Dr. Roberto Silva",
      especialidade: "Dermatologia",
      status: "indisponivel",
      proximoAtendimento: "14:00",
      atendimentosHoje: 4,
      avaliacaoMedia: 4.7,
      telefone: "(11) 99999-9012",
      email: "roberto@exemplo.com"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'trabalhando': return 'bg-green-100 text-green-800';
      case 'fora_trabalho': return 'bg-gray-100 text-gray-800';
      case 'disponivel': return 'bg-green-100 text-green-800';
      case 'ocupado': return 'bg-yellow-100 text-yellow-800';
      case 'indisponivel': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Equipe</h2>
          <p className="text-muted-foreground">Monitoramento da equipe e prestadores</p>
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Relatório de Equipe
        </Button>
      </div>

      {/* Métricas da Equipe */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Colaboradores Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {colaboradores.filter(c => c.status === 'trabalhando').length}
            </div>
            <p className="text-xs text-muted-foreground">
              de {colaboradores.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prestadores Online</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {prestadores.filter(p => p.status === 'disponivel').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {prestadores.filter(p => p.status === 'ocupado').length} ocupados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta da Equipe</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">82%</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(8200)} de {formatCurrency(10000)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">
              Avaliação média
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="colaboradores">Colaboradores</TabsTrigger>
          <TabsTrigger value="prestadores">Prestadores</TabsTrigger>
        </TabsList>

        <TabsContent value="colaboradores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Colaboradores da Unidade</CardTitle>
              <CardDescription>Status atual e performance da equipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {colaboradores.map((colaborador) => (
                  <div key={colaborador.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={colaborador.foto || ""} />
                        <AvatarFallback>{getInitials(colaborador.nome)}</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h4 className="font-medium">{colaborador.nome}</h4>
                        <p className="text-sm text-muted-foreground">{colaborador.cargo}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(colaborador.status)} variant="outline">
                            {colaborador.status === 'trabalhando' ? 'Trabalhando' : 'Fora do trabalho'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {colaborador.horasTrabalho}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Vendas</p>
                        <p className="font-medium">{colaborador.vendas}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Valor</p>
                        <p className="font-medium">{formatCurrency(colaborador.valorVendas)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Meta</p>
                        <p className="font-medium">
                          {Math.round((colaborador.valorVendas / colaborador.meta) * 100)}%
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4 mr-1" />
                        Perfil
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prestadores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prestadores Vinculados</CardTitle>
              <CardDescription>Status e agenda dos prestadores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prestadores.map((prestador) => (
                  <div key={prestador.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{getInitials(prestador.nome)}</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h4 className="font-medium">{prestador.nome}</h4>
                        <p className="text-sm text-muted-foreground">{prestador.especialidade}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(prestador.status)} variant="outline">
                            {prestador.status === 'disponivel' ? 'Disponível' : 
                             prestador.status === 'ocupado' ? 'Ocupado' : 'Indisponível'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            ⭐ {prestador.avaliacaoMedia}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Próximo</p>
                        <p className="font-medium">{prestador.proximoAtendimento}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Hoje</p>
                        <p className="font-medium">{prestador.atendimentosHoje} atendimentos</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Contato</p>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Mail className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        Agenda
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GestaoEquipe;
