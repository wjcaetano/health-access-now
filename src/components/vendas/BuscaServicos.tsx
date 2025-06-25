
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";
import { useServicos } from "@/hooks/useServicos";
import { usePrestadores } from "@/hooks/usePrestadores";

interface ServicoSelecionado {
  id: string;
  nome: string;
  categoria: string;
  prestadorId: string;
  prestadorNome: string;
  valorVenda: number;
  descricao?: string;
}

interface BuscaServicosProps {
  onServicoSelecionado: (servico: ServicoSelecionado) => void;
}

const BuscaServicos: React.FC<BuscaServicosProps> = ({ onServicoSelecionado }) => {
  const [termoBusca, setTermoBusca] = useState("");
  const [servicoSelecionado, setServicoSelecionado] = useState<any>(null);
  const [prestadorSelecionado, setPrestadorSelecionado] = useState<string>("");
  
  const { data: servicos, isLoading: carregandoServicos } = useServicos();
  const { data: prestadores, isLoading: carregandoPrestadores } = usePrestadores();

  console.log("Serviços carregados:", servicos);
  console.log("Prestadores carregados:", prestadores);

  const servicosFiltrados = servicos?.filter((servico) =>
    servico.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    servico.categoria.toLowerCase().includes(termoBusca.toLowerCase())
  ) || [];

  // Buscar prestadores que oferecem o serviço selecionado
  const prestadoresDisponiveis = prestadores?.filter((prestador) => {
    if (!servicoSelecionado) return false;
    // Por enquanto, assumimos que todos os prestadores podem oferecer qualquer serviço
    // Em uma implementação futura, isso poderia ser baseado em especialidades
    return prestador.ativo;
  }) || [];

  const handleSelecionarServico = (servico: any) => {
    console.log("Serviço selecionado:", servico);
    setServicoSelecionado(servico);
    setPrestadorSelecionado("");
  };

  const handleAdicionarServico = () => {
    if (servicoSelecionado && prestadorSelecionado) {
      const prestador = prestadores?.find(p => p.id === prestadorSelecionado);
      
      const servicoParaAdicionar: ServicoSelecionado = {
        id: servicoSelecionado.id,
        nome: servicoSelecionado.nome,
        categoria: servicoSelecionado.categoria,
        prestadorId: prestadorSelecionado,
        prestadorNome: prestador?.nome || "",
        valorVenda: servicoSelecionado.valor_venda,
        descricao: servicoSelecionado.descricao
      };

      console.log("Adicionando serviço:", servicoParaAdicionar);
      onServicoSelecionado(servicoParaAdicionar);
      setServicoSelecionado(null);
      setPrestadorSelecionado("");
      setTermoBusca("");
    }
  };

  if (carregandoServicos || carregandoPrestadores) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p>Carregando serviços...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Buscar Serviços</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Busca de Serviços */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Digite o nome do serviço ou categoria..."
              className="pl-8"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>
        </div>

        {/* Debug: Mostrar total de serviços disponíveis */}
        {servicos && (
          <div className="text-sm text-gray-500">
            Total de serviços disponíveis: {servicos.length}
          </div>
        )}

        {/* Lista de Serviços */}
        {termoBusca && servicosFiltrados.length > 0 && (
          <div className="border rounded-lg max-h-60 overflow-y-auto">
            {servicosFiltrados.map((servico) => (
              <div
                key={servico.id}
                className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                  servicoSelecionado?.id === servico.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => handleSelecionarServico(servico)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{servico.nome}</h4>
                    <p className="text-sm text-gray-600">{servico.categoria}</p>
                    {servico.descricao && (
                      <p className="text-xs text-gray-500 mt-1">{servico.descricao}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      R$ {servico.valor_venda.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Seleção de Prestador */}
        {servicoSelecionado && prestadoresDisponiveis.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Selecione o Prestador:</h4>
            <div className="grid gap-2">
              {prestadoresDisponiveis.map((prestador) => (
                <label
                  key={prestador.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="prestador"
                    value={prestador.id}
                    checked={prestadorSelecionado === prestador.id}
                    onChange={(e) => setPrestadorSelecionado(e.target.value)}
                    className="text-agendaja-primary"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{prestador.nome}</p>
                    <p className="text-sm text-gray-600 capitalize">{prestador.tipo}</p>
                    {prestador.especialidades && prestador.especialidades.length > 0 && (
                      <p className="text-xs text-gray-500">
                        {prestador.especialidades.join(", ")}
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>

            <Button
              onClick={handleAdicionarServico}
              disabled={!prestadorSelecionado}
              className="w-full bg-agendaja-primary hover:bg-agendaja-secondary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Serviço
            </Button>
          </div>
        )}

        {/* Mensagem quando nenhum prestador está disponível */}
        {servicoSelecionado && prestadoresDisponiveis.length === 0 && (
          <div className="text-center py-8 text-amber-600">
            <p>Nenhum prestador ativo disponível para este serviço</p>
          </div>
        )}

        {termoBusca && servicosFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum serviço encontrado para "{termoBusca}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BuscaServicos;
