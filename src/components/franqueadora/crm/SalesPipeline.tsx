
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Phone, 
  Star, 
  FileText, 
  CheckCircle, 
  XCircle,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { LeadFranqueado } from "@/hooks/useFranqueadora";
import { formatDate } from "@/lib/formatters";

interface SalesPipelineProps {
  leads: LeadFranqueado[];
  onStatusChange: (leadId: string, newStatus: string) => void;
}

const pipelineStages = [
  { 
    status: 'novo', 
    label: 'Novos Leads', 
    icon: User, 
    color: 'bg-blue-100 text-blue-800',
    percentage: 0
  },
  { 
    status: 'contatado', 
    label: 'Contatados', 
    icon: Phone, 
    color: 'bg-purple-100 text-purple-800',
    percentage: 20
  },
  { 
    status: 'qualificado', 
    label: 'Qualificados', 
    icon: Star, 
    color: 'bg-yellow-100 text-yellow-800',
    percentage: 40
  },
  { 
    status: 'apresentacao', 
    label: 'Apresentação', 
    icon: FileText, 
    color: 'bg-orange-100 text-orange-800',
    percentage: 60
  },
  { 
    status: 'proposta', 
    label: 'Proposta', 
    icon: FileText, 
    color: 'bg-indigo-100 text-indigo-800',
    percentage: 80
  },
  { 
    status: 'aprovado', 
    label: 'Aprovados', 
    icon: CheckCircle, 
    color: 'bg-green-100 text-green-800',
    percentage: 100
  }
];

export const SalesPipeline = ({ leads, onStatusChange }: SalesPipelineProps) => {
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  const getConversionRate = (fromStatus: string, toStatus: string) => {
    const fromCount = getLeadsByStatus(fromStatus).length;
    const toCount = getLeadsByStatus(toStatus).length;
    return fromCount > 0 ? Math.round((toCount / fromCount) * 100) : 0;
  };

  const getTotalValue = (status: string) => {
    return getLeadsByStatus(status).reduce((sum, lead) => {
      return sum + (lead.capital_disponivel || 0);
    }, 0);
  };

  const handleMoveToNext = (leadId: string, currentStatus: string) => {
    const currentIndex = pipelineStages.findIndex(stage => stage.status === currentStatus);
    if (currentIndex < pipelineStages.length - 1) {
      const nextStatus = pipelineStages[currentIndex + 1].status;
      onStatusChange(leadId, nextStatus);
    }
  };

  const totalLeads = leads.length;
  const approvedLeads = getLeadsByStatus('aprovado').length;
  const overallConversionRate = totalLeads > 0 ? Math.round((approvedLeads / totalLeads) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline de Vendas - Visão Geral</CardTitle>
          <CardDescription>
            Acompanhe o progresso dos leads através do funil de vendas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{totalLeads}</div>
              <div className="text-sm text-muted-foreground">Total de Leads</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">{approvedLeads}</div>
              <div className="text-sm text-muted-foreground">Aprovados</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{overallConversionRate}%</div>
              <div className="text-sm text-muted-foreground">Taxa de Conversão</div>
            </div>
          </div>

          <div className="space-y-4">
            {pipelineStages.map((stage, index) => {
              const stageLeads = getLeadsByStatus(stage.status);
              const Icon = stage.icon;
              const isExpanded = expandedStage === stage.status;
              const nextStage = pipelineStages[index + 1];
              const conversionRate = nextStage ? getConversionRate(stage.status, nextStage.status) : 0;

              return (
                <div key={stage.status} className="border rounded-lg p-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedStage(isExpanded ? null : stage.status)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${stage.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{stage.label}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{stageLeads.length} leads</span>
                          <span>R$ {getTotalValue(stage.status).toLocaleString()}</span>
                          {nextStage && (
                            <span className="flex items-center gap-1">
                              <ArrowRight className="h-3 w-3" />
                              {conversionRate}% conversão
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress value={stage.percentage} className="w-20 h-2" />
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-2">
                      {stageLeads.map((lead) => (
                        <div key={lead.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{lead.nome}</div>
                            <div className="text-sm text-muted-foreground">
                              {lead.cidade_interesse} • Score: {lead.score}
                              {lead.capital_disponivel && (
                                <span> • R$ {lead.capital_disponivel.toLocaleString()}</span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(lead.created_at)}
                            </div>
                          </div>
                          {index < pipelineStages.length - 2 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMoveToNext(lead.id, stage.status)}
                            >
                              Avançar
                            </Button>
                          )}
                        </div>
                      ))}
                      {stageLeads.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                          Nenhum lead nesta etapa
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
