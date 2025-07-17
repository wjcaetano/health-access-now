
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, X } from "lucide-react";
import { useGuiasProximasVencimento, calcularDiasParaExpiracao } from "@/hooks/useGuias";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AlertasGuiasProps {
  onViewGuias?: () => void;
}

const AlertasGuias: React.FC<AlertasGuiasProps> = ({ onViewGuias }) => {
  const { data: guiasProximasVencimento, isLoading } = useGuiasProximasVencimento();
  const [dismissed, setDismissed] = React.useState(false);

  if (isLoading || dismissed || !guiasProximasVencimento || guiasProximasVencimento.length === 0) {
    return null;
  }

  return (
    <Alert className="border-orange-200 bg-orange-50 relative">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <strong>{guiasProximasVencimento.length} guia(s)</strong>
              <span>próximas do vencimento (30 dias)</span>
              <Clock className="h-4 w-4" />
            </div>
            
            <div className="space-y-1 mb-3">
              {guiasProximasVencimento.slice(0, 3).map((guia) => {
                const diasRestantes = calcularDiasParaExpiracao(guia.data_emissao);
                return (
                  <div key={guia.id} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="text-xs bg-orange-100">
                      {diasRestantes} dia{diasRestantes !== 1 ? 's' : ''}
                    </Badge>
                    <span className="font-mono">{guia.codigo_autenticacao}</span>
                    <span>-</span>
                    <span>{guia.clientes?.nome}</span>
                    <span>-</span>
                    <span>{guia.servicos?.nome}</span>
                  </div>
                );
              })}
              
              {guiasProximasVencimento.length > 3 && (
                <p className="text-xs text-orange-700">
                  E mais {guiasProximasVencimento.length - 3} guia(s)...
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onViewGuias}
                className="bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-200"
              >
                Ver todas as guias
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setDismissed(true)}
                className="bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-200"
              >
                Entendi
              </Button>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 h-6 w-6 p-0 text-orange-600 hover:text-orange-800"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default AlertasGuias;
