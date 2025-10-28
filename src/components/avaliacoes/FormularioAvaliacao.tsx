import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useCriarAvaliacao } from '@/hooks/useAvaliacoes';

interface FormularioAvaliacaoProps {
  guiaId: string;
  clienteId: string;
  prestadorId: string;
  prestadorNome: string;
  onSuccess?: () => void;
}

export const FormularioAvaliacao: React.FC<FormularioAvaliacaoProps> = ({
  guiaId,
  clienteId,
  prestadorId,
  prestadorNome,
  onSuccess
}) => {
  const [nota, setNota] = useState<number>(0);
  const [comentario, setComentario] = useState('');
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  const { mutate: criarAvaliacao, isPending } = useCriarAvaliacao();

  const handleSubmit = () => {
    if (nota === 0) {
      return;
    }

    criarAvaliacao({
      guia_id: guiaId,
      cliente_id: clienteId,
      prestador_id: prestadorId,
      nota,
      comentario: comentario.trim() || undefined
    }, {
      onSuccess: () => {
        setNota(0);
        setComentario('');
        onSuccess?.();
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliar {prestadorNome}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Como foi sua experiência?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setNota(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoveredStar || nota)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {nota > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              {nota === 1 && 'Muito ruim'}
              {nota === 2 && 'Ruim'}
              {nota === 3 && 'Regular'}
              {nota === 4 && 'Bom'}
              {nota === 5 && 'Excelente'}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Comentário (opcional)
          </label>
          <Textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Conte-nos mais sobre sua experiência..."
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {comentario.length}/500 caracteres
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={nota === 0 || isPending}
          className="w-full"
        >
          {isPending ? 'Enviando...' : 'Enviar Avaliação'}
        </Button>
      </CardContent>
    </Card>
  );
};
