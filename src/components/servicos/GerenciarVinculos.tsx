
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Link } from "lucide-react";
import { useServicos } from "@/hooks/useServicos";
import { usePrestadores } from "@/hooks/usePrestadores";
import { 
  useServicoPrestadores, 
  useCreateServicoPrestador, 
  useDeleteServicoPrestador 
} from "@/hooks/useServicoPrestadores";
import { useToast } from "@/hooks/use-toast";

const GerenciarVinculos = () => {
  const [servicoSelecionado, setServicoSelecionado] = useState("");
  const [prestadorSelecionado, setPrestadorSelecionado] = useState("");
  
  const { data: servicos } = useServicos();
  const { data: prestadores } = usePrestadores();
  const { data: vinculos } = useServicoPrestadores();
  const { mutate: criarVinculo } = useCreateServicoPrestador();
  const { mutate: deletarVinculo } = useDeleteServicoPrestador();
  const { toast } = useToast();

  const handleCriarVinculo = () => {
    if (!servicoSelecionado || !prestadorSelecionado) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um serviço e um prestador.",
        variant: "destructive"
      });
      return;
    }

    // Verificar se o vínculo já existe
    const vinculoExiste = vinculos?.some(
      v => v.servico_id === servicoSelecionado && v.prestador_id === prestadorSelecionado
    );

    if (vinculoExiste) {
      toast({
        title: "Vínculo já existe",
        description: "Este prestador já está vinculado a este serviço.",
        variant: "destructive"
      });
      return;
    }

    criarVinculo({
      servico_id: servicoSelecionado,
      prestador_id: prestadorSelecionado,
      ativo: true
    }, {
      onSuccess: () => {
        toast({
          title: "Vínculo criado",
          description: "Prestador vinculado ao serviço com sucesso!"
        });
        setServicoSelecionado("");
        setPrestadorSelecionado("");
      },
      onError: (error) => {
        toast({
          title: "Erro ao criar vínculo",
          description: "Ocorreu um erro ao vincular o prestador ao serviço.",
          variant: "destructive"
        });
        console.error('Erro ao criar vínculo:', error);
      }
    });
  };

  const handleDeletarVinculo = (vinculoId: string) => {
    deletarVinculo(vinculoId, {
      onSuccess: () => {
        toast({
          title: "Vínculo removido",
          description: "Vínculo removido com sucesso!"
        });
      },
      onError: (error) => {
        toast({
          title: "Erro ao remover vínculo",
          description: "Ocorreu um erro ao remover o vínculo.",
          variant: "destructive"
        });
        console.error('Erro ao remover vínculo:', error);
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Vincular Serviço a Prestador
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Serviço</label>
              <Select value={servicoSelecionado} onValueChange={setServicoSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent>
                  {servicos?.map((servico) => (
                    <SelectItem key={servico.id} value={servico.id}>
                      {servico.nome} - {servico.categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Prestador</label>
              <Select value={prestadorSelecionado} onValueChange={setPrestadorSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um prestador" />
                </SelectTrigger>
                <SelectContent>
                  {prestadores?.map((prestador) => (
                    <SelectItem key={prestador.id} value={prestador.id}>
                      {prestador.nome} ({prestador.tipo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleCriarVinculo} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Criar Vínculo
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vínculos Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {vinculos && vinculos.length > 0 ? (
            <div className="space-y-3">
              {vinculos.map((vinculo) => (
                <div
                  key={vinculo.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-medium">{vinculo.servicos?.nome}</h4>
                        <Badge variant="outline" className="text-xs">
                          {vinculo.servicos?.categoria}
                        </Badge>
                      </div>
                      <div className="text-gray-400">→</div>
                      <div>
                        <h4 className="font-medium">{vinculo.prestadores?.nome}</h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {vinculo.prestadores?.tipo}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletarVinculo(vinculo.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum vínculo cadastrado ainda</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GerenciarVinculos;
