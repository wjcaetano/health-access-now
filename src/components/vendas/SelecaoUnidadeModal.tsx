
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { unidades, Unidade } from "@/data/unidades";

interface SelecaoUnidadeModalProps {
  tipoServico: string;
}

const SelecaoUnidadeModal = ({ tipoServico }: SelecaoUnidadeModalProps) => {
  const [estadoSelecionado, setEstadoSelecionado] = useState<string>("");
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<Unidade | null>(null);

  const estados = [...new Set(unidades.map((u) => u.estado))].sort();
  const cidadesFiltradas = unidades.filter((u) => u.estado === estadoSelecionado);

  const handleEstadoChange = (estado: string) => {
    setEstadoSelecionado(estado);
    setUnidadeSelecionada(null);
  };

  const handleCidadeChange = (unidadeId: string) => {
    const unidade = unidades.find((u) => u.id === unidadeId);
    setUnidadeSelecionada(unidade || null);
  };

  const handleAgendarWhatsapp = () => {
    if (unidadeSelecionada) {
      const message = `Olá! Gostaria de agendar um(a) ${tipoServico.toLowerCase()} na unidade de ${unidadeSelecionada.cidade}.`;
      const whatsappUrl = `https://wa.me/${unidadeSelecionada.whatsapp}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Selecione a Unidade de Atendimento</DialogTitle>
        <DialogDescription>
          Escolha o estado e a cidade para direcionarmos você ao WhatsApp da unidade correta.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Select onValueChange={handleEstadoChange} value={estadoSelecionado}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {estados.map((estado) => (
                <SelectItem key={estado} value={estado}>
                  {estado}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={handleCidadeChange} value={unidadeSelecionada?.id || ""} disabled={!estadoSelecionado}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a Cidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {cidadesFiltradas.map((unidade) => (
                <SelectItem key={unidade.id} value={unidade.id}>
                  {unidade.cidade}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button onClick={handleAgendarWhatsapp} disabled={!unidadeSelecionada}>
          Ir para o WhatsApp
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default SelecaoUnidadeModal;
