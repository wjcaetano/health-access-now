
import React, { useState } from "react";
import { useColaboradorByEmail } from "@/hooks/useColaboradores";
import { useJaBateuPontoHoje } from "@/hooks/usePontoEletronico";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PontoInteligente from "@/components/ponto/PontoInteligente";
import ModalPontoObrigatorio from "@/components/ponto/ModalPontoObrigatorio";
import { Search } from "lucide-react";

export default function PontoEletronicoPainel() {
  const [email, setEmail] = useState("");
  const [emailPesquisado, setEmailPesquisado] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { data: colaborador, isLoading: loadingColaborador } = useColaboradorByEmail(emailPesquisado);
  const { data: jaBateuPonto, isLoading: loadingPonto } = useJaBateuPontoHoje(colaborador?.id || "");

  const handlePesquisar = () => {
    setEmailPesquisado(email);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePesquisar();
    }
  };

  const verificarPontoObrigatorio = () => {
    if (colaborador && jaBateuPonto === false) {
      setShowModal(true);
    }
  };

  React.useEffect(() => {
    verificarPontoObrigatorio();
  }, [colaborador, jaBateuPonto]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sistema de Ponto Eletrônico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Digite o email do colaborador"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handlePesquisar}
              disabled={!email || loadingColaborador}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {loadingColaborador && (
            <div className="text-center py-4">
              <p>Buscando colaborador...</p>
            </div>
          )}

          {emailPesquisado && !loadingColaborador && !colaborador && (
            <div className="text-center py-4 text-red-600">
              <p>Colaborador não encontrado com este email.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {colaborador && !loadingPonto && (
        <PontoInteligente 
          colaboradorId={colaborador.id}
          colaboradorNome={colaborador.nome}
        />
      )}

      {colaborador && (
        <ModalPontoObrigatorio
          open={showModal}
          colaboradorId={colaborador.id}
          colaboradorNome={colaborador.nome}
          onPontoRegistrado={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
