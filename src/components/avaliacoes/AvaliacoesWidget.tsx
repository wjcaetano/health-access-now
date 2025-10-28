import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useEstatisticasAvaliacoes } from '@/hooks/useAvaliacoes';

interface AvaliacoesWidgetProps {
  prestadorId?: string;
  showDistribution?: boolean;
}

export const AvaliacoesWidget: React.FC<AvaliacoesWidgetProps> = ({
  prestadorId,
  showDistribution = true
}) => {
  const { data: stats, isLoading } = useEstatisticasAvaliacoes(prestadorId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          Carregando estatísticas...
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Avaliações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.mediaGeral}</div>
            <div className="flex justify-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(stats.mediaGeral)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {stats.totalAvaliacoes} avaliações
            </p>
          </div>

          {showDistribution && (
            <div className="flex-1 space-y-2">
              {stats.distribuicao.reverse().map((item) => (
                <div key={item.estrelas} className="flex items-center gap-2">
                  <span className="text-sm w-6">{item.estrelas}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${item.percentual}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {item.quantidade}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
