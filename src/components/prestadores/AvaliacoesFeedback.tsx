
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AvaliacoesFeedbackProps {
  prestadorId: string;
}

const AvaliacoesFeedback: React.FC<AvaliacoesFeedbackProps> = ({ prestadorId }) => {
  const [filtroEstrela, setFiltroEstrela] = useState<number | null>(null);

  // Mock data - em implementação real, buscar do banco
  const avaliacoes = [
    {
      id: "1",
      cliente: "Maria Silva",
      servico: "Consulta Cardiológica",
      nota: 5,
      comentario: "Excelente atendimento! Dr. muito atencioso e profissional.",
      data: new Date(2024, 0, 15),
      resposta: null
    },
    {
      id: "2",
      cliente: "João Santos",
      servico: "Eletrocardiograma",
      nota: 4,
      comentario: "Bom atendimento, mas a espera foi um pouco longa.",
      data: new Date(2024, 0, 12),
      resposta: "Obrigado pelo feedback! Estamos trabalhando para melhorar os tempos de espera."
    },
    {
      id: "3",
      cliente: "Ana Costa",
      servico: "Holter 24h",
      nota: 5,
      comentario: "Perfeito! Recomendo a todos.",
      data: new Date(2024, 0, 10),
      resposta: null
    },
    {
      id: "4",
      cliente: "Carlos Lima",
      servico: "Consulta Geral",
      nota: 3,
      comentario: "Atendimento ok, mas poderia ser mais detalhado.",
      data: new Date(2024, 0, 8),
      resposta: null
    }
  ];

  // Calcular métricas
  const totalAvaliacoes = avaliacoes.length;
  const mediaGeral = avaliacoes.reduce((sum, av) => sum + av.nota, 0) / totalAvaliacoes;
  const distribuicaoEstrelas = {
    5: avaliacoes.filter(av => av.nota === 5).length,
    4: avaliacoes.filter(av => av.nota === 4).length,
    3: avaliacoes.filter(av => av.nota === 3).length,
    2: avaliacoes.filter(av => av.nota === 2).length,
    1: avaliacoes.filter(av => av.nota === 1).length,
  };

  // Filtrar avaliações
  const avaliacoesFiltradas = filtroEstrela 
    ? avaliacoes.filter(av => av.nota === filtroEstrela)
    : avaliacoes;

  const renderStars = (nota: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < nota ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getCorNota = (nota: number) => {
    if (nota >= 4) return 'text-green-600';
    if (nota >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Métricas Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Média Geral</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {mediaGeral.toFixed(1)}
                </p>
                <div className="flex items-center mt-1">
                  {renderStars(Math.round(mediaGeral))}
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Avaliações</p>
                <p className="text-3xl font-bold">
                  {totalAvaliacoes}
                </p>
                <p className="text-sm text-gray-500">Este mês</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avaliações 5⭐</p>
                <p className="text-3xl font-bold text-green-600">
                  {Math.round((distribuicaoEstrelas[5] / totalAvaliacoes) * 100)}%
                </p>
                <p className="text-sm text-gray-500">
                  {distribuicaoEstrelas[5]} avaliações
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sem Resposta</p>
                <p className="text-3xl font-bold text-orange-600">
                  {avaliacoes.filter(av => !av.resposta).length}
                </p>
                <p className="text-sm text-gray-500">Pendentes</p>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de Estrelas */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((estrela) => {
              const quantidade = distribuicaoEstrelas[estrela as keyof typeof distribuicaoEstrelas];
              const porcentagem = totalAvaliacoes > 0 ? (quantidade / totalAvaliacoes) * 100 : 0;
              
              return (
                <div key={estrela} className="flex items-center gap-4">
                  <Button
                    variant={filtroEstrela === estrela ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFiltroEstrela(filtroEstrela === estrela ? null : estrela)}
                    className="min-w-[80px]"
                  >
                    {estrela} ⭐
                  </Button>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${porcentagem}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 min-w-[60px]">
                    {quantidade} ({porcentagem.toFixed(0)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Avaliações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Avaliações e Comentários
            {filtroEstrela && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFiltroEstrela(null)}
              >
                Limpar Filtro
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {avaliacoesFiltradas.map((avaliacao) => (
              <div key={avaliacao.id} className="border-b pb-6 last:border-b-0">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{avaliacao.cliente}</span>
                      <Badge variant="secondary">{avaliacao.servico}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(avaliacao.nota)}
                      <span className={`font-medium ${getCorNota(avaliacao.nota)}`}>
                        {avaliacao.nota}/5
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(avaliacao.data, "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4">{avaliacao.comentario}</p>
                
                {avaliacao.resposta ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                    <div className="text-sm font-medium text-blue-800 mb-1">
                      Sua resposta:
                    </div>
                    <p className="text-blue-700">{avaliacao.resposta}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Responder avaliação..."
                      className="resize-none"
                      rows={2}
                    />
                    <Button size="sm">
                      Enviar Resposta
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvaliacoesFeedback;
