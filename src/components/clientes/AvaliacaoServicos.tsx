
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AvaliacaoServicosProps {
  clienteId: string;
}

const AvaliacaoServicos: React.FC<AvaliacaoServicosProps> = ({ clienteId }) => {
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState<string | null>(null);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");

  // Mock data - em implementação real, buscar do banco
  const servicosPendentes = [
    {
      id: "1",
      servico: "Consulta Cardiológica",
      prestador: "Dr. João Silva",
      data: new Date(2024, 0, 15),
      valor: 220.00
    },
    {
      id: "2",
      servico: "Eletrocardiograma",
      prestador: "Dr. João Silva",
      data: new Date(2024, 0, 10),
      valor: 180.50
    }
  ];

  const avaliacoesFeitas = [
    {
      id: "1",
      servico: "Holter 24h",
      prestador: "Dra. Maria Santos",
      data: new Date(2023, 11, 20),
      nota: 5,
      comentario: "Excelente atendimento! Dra. muito atenciosa e profissional.",
      respostaPrestador: "Muito obrigada pelo feedback! Foi um prazer atendê-la."
    },
    {
      id: "2",
      servico: "Consulta Geral",
      prestador: "Dr. Carlos Lima",
      data: new Date(2023, 11, 10),
      nota: 4,
      comentario: "Bom atendimento, mas a consulta poderia ter sido mais detalhada.",
      respostaPrestador: null
    }
  ];

  const renderStars = (nota: number, interactive = false, onStarClick?: (star: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-6 w-6 cursor-pointer transition-colors ${
          i < nota ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-200'
        }`}
        onClick={() => interactive && onStarClick && onStarClick(i + 1)}
      />
    ));
  };

  const renderStarsSmall = (nota: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < nota ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const enviarAvaliacao = () => {
    if (avaliacaoSelecionada && nota > 0) {
      // Implementar envio da avaliação
      console.log("Avaliação enviada:", {
        servicoId: avaliacaoSelecionada,
        nota,
        comentario
      });
      
      // Reset do formulário
      setAvaliacaoSelecionada(null);
      setNota(0);
      setComentario("");
    }
  };

  const formatMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  return (
    <div className="space-y-6">
      {/* Serviços Pendentes de Avaliação */}
      {servicosPendentes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Avaliar Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {servicosPendentes.map((servico) => (
                <div
                  key={servico.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    avaliacaoSelecionada === servico.id ? 'border-blue-500 bg-blue-50' : 'hover:shadow-md'
                  }`}
                  onClick={() => setAvaliacaoSelecionada(
                    avaliacaoSelecionada === servico.id ? null : servico.id
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{servico.servico}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {servico.prestador}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(servico.data, "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        {formatMoeda(servico.valor)}
                      </div>
                      <Badge variant="outline" className="mt-1">
                        Pendente
                      </Badge>
                    </div>
                  </div>

                  {avaliacaoSelecionada === servico.id && (
                    <div className="mt-6 pt-4 border-t">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Como foi sua experiência?
                          </label>
                          <div className="flex gap-1">
                            {renderStars(nota, true, setNota)}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Comentário (opcional)
                          </label>
                          <Textarea
                            placeholder="Conte como foi sua experiência..."
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            rows={3}
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button onClick={enviarAvaliacao} disabled={nota === 0}>
                            Enviar Avaliação
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setAvaliacaoSelecionada(null);
                              setNota(0);
                              setComentario("");
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Avaliações Feitas */}
      <Card>
        <CardHeader>
          <CardTitle>Suas Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {avaliacoesFeitas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Você ainda não fez nenhuma avaliação</p>
              </div>
            ) : (
              avaliacoesFeitas.map((avaliacao) => (
                <div key={avaliacao.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{avaliacao.servico}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {avaliacao.prestador}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(avaliacao.data, "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStarsSmall(avaliacao.nota)}
                      <span className="font-medium">{avaliacao.nota}/5</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700">{avaliacao.comentario}</p>
                  </div>
                  
                  {avaliacao.respostaPrestador && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-blue-800 mb-2">
                        Resposta do prestador:
                      </div>
                      <p className="text-blue-700">{avaliacao.respostaPrestador}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas das Avaliações */}
      <Card>
        <CardHeader>
          <CardTitle>Suas Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {avaliacoesFeitas.length}
              </div>
              <div className="text-sm text-gray-600">Avaliações Feitas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {avaliacoesFeitas.length > 0 
                  ? (avaliacoesFeitas.reduce((sum, av) => sum + av.nota, 0) / avaliacoesFeitas.length).toFixed(1)
                  : '0.0'}⭐
              </div>
              <div className="text-sm text-gray-600">Sua Média</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {servicosPendentes.length}
              </div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvaliacaoServicos;
