
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUltimoPonto, useRegistrarPonto } from "@/hooks/usePontoEletronico";
import { format } from "date-fns";
import { Clock, LogIn, LogOut } from "lucide-react";

interface PontoInteligenteProps {
  colaboradorId: string;
  colaboradorNome: string;
}

export default function PontoInteligente({ colaboradorId, colaboradorNome }: PontoInteligenteProps) {
  const [loading, setLoading] = useState(false);
  const { data: ultimoPonto, refetch } = useUltimoPonto(colaboradorId);
  const registrarPonto = useRegistrarPonto();

  const proximoTipoPonto = () => {
    if (!ultimoPonto) return "entrada";
    
    const hoje = format(new Date(), "yyyy-MM-dd");
    const dataUltimoPonto = format(new Date(ultimoPonto.data_ponto), "yyyy-MM-dd");
    
    // Se o último ponto foi hoje e foi entrada, próximo é saída
    if (dataUltimoPonto === hoje && ultimoPonto.tipo_ponto === "entrada") {
      return "saida";
    }
    
    // Caso contrário, próximo é entrada
    return "entrada";
  };

  const handleRegistrarPonto = async () => {
    setLoading(true);
    const tipoPonto = proximoTipoPonto();
    
    try {
      await registrarPonto.mutateAsync({
        colaborador_id: colaboradorId,
        data_ponto: format(new Date(), "yyyy-MM-dd"),
        tipo_ponto: tipoPonto
      });
      refetch();
    } catch (error) {
      console.error("Erro ao registrar ponto:", error);
    } finally {
      setLoading(false);
    }
  };

  const tipoPonto = proximoTipoPonto();
  const isEntrada = tipoPonto === "entrada";

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Ponto Eletrônico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-lg">Olá, <strong>{colaboradorNome}</strong>!</p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Data:</strong> {format(new Date(), "dd/MM/yyyy")}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Hora:</strong> {format(new Date(), "HH:mm:ss")}
            </p>
          </div>
          
          {ultimoPonto && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">Último registro:</p>
              <p className="text-sm text-blue-900">
                <strong>{ultimoPonto.tipo_ponto === "entrada" ? "Entrada" : "Saída"}</strong> em{" "}
                {format(new Date(ultimoPonto.data_ponto), "dd/MM/yyyy")}
              </p>
            </div>
          )}
        </div>
        
        <Button 
          onClick={handleRegistrarPonto} 
          disabled={loading}
          className={`w-full ${isEntrada ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
          size="lg"
        >
          {isEntrada ? <LogIn className="h-4 w-4 mr-2" /> : <LogOut className="h-4 w-4 mr-2" />}
          {loading 
            ? "Registrando..." 
            : `Registrar ${isEntrada ? "Entrada" : "Saída"}`
          }
        </Button>
      </CardContent>
    </Card>
  );
}
