
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, 
  DollarSign, 
  Calendar, 
  MapPin,
  User,
  Phone,
  Mail
} from "lucide-react";
import { LeadFranqueado } from "@/hooks/useFranqueadora";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SalesPipelineProps {
  leads: LeadFranqueado[];
  onStatusChange: (leadId: string, newStatus: string) => void;
}

const statusConfig = {
  novo: { label: "Novo", color: "bg-gray-500", stage: 1 },
  contatado: { label: "Contatado", color: "bg-blue-500", stage: 2 },
  qualificado: { label: "Qualificado", color: "bg-yellow-500", stage: 3 },
  apresentacao: { label: "Apresentação", color: "bg-orange-500", stage: 4 },
  proposta: { label: "Proposta", color: "bg-purple-500", stage: 5 },
  aprovado: { label: "Aprovado", color: "bg-green-500", stage: 6 },
  rejeitado: { label: "Rejeitado", color: "bg-red-500", stage: 7 },
  perdido: { label: "Perdido", color: "bg-gray-400", stage: 8 },
};

export const SalesPipeline = ({ leads, onStatusChange }: SalesPipelineProps) => {
  const getStatusInfo = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.novo;
  };

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  const stages = [
    { key: "novo", leads: getLeadsByStatus("novo") },
    { key: "contatado", leads: getLeadsByStatus("contatado") },
    { key: "qualificado", leads: getLeadsByStatus("qualificado") },
    { key: "apresentacao", leads: getLeadsByStatus("apresentacao") },
    { key: "proposta", leads: getLeadsByStatus("proposta") },
    { key: "aprovado", leads: getLeadsByStatus("aprovado") },
  ];

  const nextStatuses = {
    novo: ["contatado", "perdido"],
    contatado: ["qualificado", "perdido"],
    qualificado: ["apresentacao", "rejeitado"],
    apresentacao: ["proposta", "rejeitado"],
    proposta: ["aprovado", "rejeitado"],
    aprovado: [],
    rejeitado: ["novo"],
    perdido: ["novo"],
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {Object.entries(statusConfig).slice(0, 6).map(([status, config]) => {
          const count = getLeadsByStatus(status).length;
          const value = getLeadsByStatus(status).reduce(
            (sum, lead) => sum + (lead.capital_disponivel || 0), 
            0
          );
          
          return (
            <Card key={status}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{config.label}</span>
                  <div className={`w-3 h-3 rounded-full ${config.color}`} />
                </div>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">
                  R$ {value.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pipeline Stages */}
      <div className="grid gap-4 lg:grid-cols-6">
        {stages.map(({ key, leads: stageLeads }) => {
          const config = getStatusInfo(key);
          
          return (
            <Card key={key} className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${config.color}`} />
                  {config.label}
                  <Badge variant="secondary" className="ml-auto">
                    {stageLeads.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stageLeads.map((lead) => (
                  <Card key={lead.id} className="p-3 border-l-4" style={{
                    borderLeftColor: config.color.includes('bg-') ? 
                      config.color.replace('bg-', '').replace('-500', '') : 
                      '#6b7280'
                  }}>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{lead.nome}</h4>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {(nextStatuses[key as keyof typeof nextStatuses] || []).map((nextStatus) => (
                              <DropdownMenuItem
                                key={nextStatus}
                                onClick={() => onStatusChange(lead.id, nextStatus)}
                              >
                                Mover para {getStatusInfo(nextStatus).label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{lead.email}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{lead.telefone}</span>
                        </div>
                        
                        {lead.cidade_interesse && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{lead.cidade_interesse}</span>
                          </div>
                        )}
                        
                        {lead.capital_disponivel && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span>R$ {lead.capital_disponivel.toLocaleString()}</span>
                          </div>
                        )}
                        
                        {lead.score !== null && (
                          <div className="flex items-center justify-between">
                            <span>Score:</span>
                            <Badge variant={lead.score >= 60 ? "default" : "secondary"}>
                              {lead.score}/100
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                
                {stageLeads.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    Nenhum lead neste estágio
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
