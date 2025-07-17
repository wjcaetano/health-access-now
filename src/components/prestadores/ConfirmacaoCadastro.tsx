
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmacaoCadastroProps {
  isOpen: boolean;
  onClose: () => void;
  onCadastrarNovo: () => void;
  onVoltarInicio: () => void;
  nomePrestador: string;
}

const ConfirmacaoCadastro: React.FC<ConfirmacaoCadastroProps> = ({
  isOpen,
  onClose,
  onCadastrarNovo,
  onVoltarInicio,
  nomePrestador,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Prestador cadastrado com sucesso!</DialogTitle>
          <DialogDescription>
            O prestador <strong>{nomePrestador}</strong> foi cadastrado com sucesso no sistema.
            <br /><br />
            Deseja cadastrar um novo prestador?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onVoltarInicio} className="w-full sm:w-auto">
            Não, voltar ao início
          </Button>
          <Button onClick={onCadastrarNovo} className="w-full sm:w-auto bg-agendaja-primary hover:bg-agendaja-secondary">
            Sim, cadastrar novo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmacaoCadastro;
