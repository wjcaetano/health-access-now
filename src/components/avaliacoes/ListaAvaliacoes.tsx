import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Avaliacao } from '@/hooks/useAvaliacoes';

interface ListaAvaliacoesProps {
  avaliacoes: Avaliacao[];
  isLoading?: boolean;
}

export const ListaAvaliacoes: React.FC<ListaAvaliacoesProps> = ({
  avaliacoes,
  isLoading
}) => {
  if (isLoading) {
    return <div className="text-center py-8">Carregando avaliações...</div>;
  }

  if (!avaliacoes.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Nenhuma avaliação ainda
        </CardContent>
      </Card>
    );
  }

  const renderStars = (nota: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= nota ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {avaliacoes.map((avaliacao) => (
        <Card key={avaliacao.id}>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">
                    {avaliacao.cliente?.nome || 'Cliente'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(avaliacao.created_at), "d 'de' MMMM 'de' yyyy", {
                      locale: ptBR
                    })}
                  </p>
                </div>
                {renderStars(avaliacao.nota)}
              </div>

              {avaliacao.comentario && (
                <p className="text-sm">{avaliacao.comentario}</p>
              )}

              {avaliacao.resposta_prestador && (
                <div className="mt-4 pl-4 border-l-2 border-primary">
                  <p className="text-sm font-medium text-primary mb-1">
                    Resposta do prestador:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {avaliacao.resposta_prestador}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
