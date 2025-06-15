
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRegistrarPonto } from "@/hooks/usePontoEletronico";
import { format } from "date-fns";
import { Clock } from "lucide-react";

interface ModalPontoObrigatorioProps {
  open: boolean;
  colaboradorId: string;
  colaboradorNome: string;
  onPontoRegistrado: () => void;
}

export default function ModalPontoObrigatorio({
  open,
  colaboradorId,
  colaboradorNome,
  onPontoRegistrado
}: ModalPontoObrigatorioProps) {
  const [loading, setLoading] = useState(false);
  const registrarPonto = useRegistrarPonto();

  const handleRegistrarPonto = async () => {
    setLoading(true);
    try {
      await registrarPonto.mutateAsync({
        colaborador_id: colaboradorId,
        data_ponto: format(new Date(), "yyyy-MM-dd"),
        tipo_ponto: "entrada"
      });
      onPontoRegistrado();
    } catch (error) {
      console.error("Erro ao registrar ponto:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Registrar Ponto de Entrada
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-lg">Olá, <strong>{colaboradorNome}</strong>!</p>
            <p className="text-gray-600 mt-2">
              Você precisa registrar seu ponto de entrada para continuar.
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Data:</strong> {format(new Date(), "dd/MM/yyyy")}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Hora:</strong> {format(new Date(), "HH:mm:ss")}
              </p>
            </div>
          </div>
          <Button 
            onClick={handleRegistrarPonto} 
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? "Registrando..." : "Registrar Entrada"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
