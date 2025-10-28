import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Star, Building2 } from 'lucide-react';
import { useBuscaPrestadores, useEspecialidadesDisponiveis, useLocalizacoesDisponiveis, FiltrosBusca } from '@/hooks/useBuscaPrestadores';
import { Badge } from '@/components/ui/badge';

export const BuscaGlobalPrestadores: React.FC = () => {
  const [filtros, setFiltros] = useState<FiltrosBusca>({});
  const [busca, setBusca] = useState('');

  const { data: prestadores, isLoading } = useBuscaPrestadores(filtros);
  const { data: especialidades } = useEspecialidadesDisponiveis();
  const { data: localizacoes } = useLocalizacoesDisponiveis();

  const handleBuscar = () => {
    setFiltros(prev => ({ ...prev, busca }));
  };

  const handleFiltroChange = (key: keyof FiltrosBusca, value: any) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
  };

  const limparFiltros = () => {
    setFiltros({});
    setBusca('');
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Prestadores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar por nome, especialidade..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
            />
            <Button onClick={handleBuscar}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              value={filtros.especialidade}
              onValueChange={(value) => handleFiltroChange('especialidade', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Especialidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {especialidades?.map((esp) => (
                  <SelectItem key={esp} value={esp}>
                    {esp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filtros.localizacao}
              onValueChange={(value) => handleFiltroChange('localizacao', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Localização" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {localizacoes?.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filtros.disponibilidade}
              onValueChange={(value) => handleFiltroChange('disponibilidade', value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Disponibilidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="ocupado">Ocupado</SelectItem>
                <SelectItem value="indisponivel">Indisponível</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filtros.avaliacaoMinima?.toString()}
              onValueChange={(value) => handleFiltroChange('avaliacaoMinima', Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Avaliação mínima" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="4">4+ estrelas</SelectItem>
                <SelectItem value="3">3+ estrelas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {Object.keys(filtros).length > 0 && (
            <Button variant="outline" onClick={limparFiltros} size="sm">
              Limpar filtros
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Resultados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-8">Carregando...</div>
        ) : !prestadores?.length ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Nenhum prestador encontrado
          </div>
        ) : (
          prestadores.map((prestador) => (
            <Card key={prestador.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{prestador.nome}</h3>
                      <p className="text-sm text-muted-foreground">{prestador.tipo}</p>
                    </div>
                    {prestador.media_avaliacoes > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {prestador.media_avaliacoes.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({prestador.total_avaliacoes})
                        </span>
                      </div>
                    )}
                  </div>

                  {prestador.especialidades && prestador.especialidades.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {prestador.especialidades.slice(0, 3).map((esp, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {esp}
                        </Badge>
                      ))}
                      {prestador.especialidades.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{prestador.especialidades.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {prestador.localizacao && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {prestador.localizacao}
                      </div>
                    )}
                    {prestador.organizacao && (
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {prestador.organizacao.nome}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        prestador.disponibilidade === 'disponivel'
                          ? 'default'
                          : prestador.disponibilidade === 'ocupado'
                          ? 'secondary'
                          : 'destructive'
                      }
                      className="text-xs"
                    >
                      {prestador.disponibilidade === 'disponivel' && 'Disponível'}
                      {prestador.disponibilidade === 'ocupado' && 'Ocupado'}
                      {prestador.disponibilidade === 'indisponivel' && 'Indisponível'}
                    </Badge>
                  </div>

                  <Button className="w-full" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
