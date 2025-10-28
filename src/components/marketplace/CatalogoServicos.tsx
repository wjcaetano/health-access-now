import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, DollarSign, Clock, Star, Calendar } from 'lucide-react';
import { useMarketplaceServicos, useCategoriasServicos, FiltrosMarketplace } from '@/hooks/useMarketplaceServicos';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/formatters';
import { AgendarServicoModal } from './AgendarServicoModal';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const CatalogoServicos: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState<FiltrosMarketplace>({});
  const [busca, setBusca] = useState('');
  const [servicoSelecionado, setServicoSelecionado] = useState<any>(null);
  const [showAgendarModal, setShowAgendarModal] = useState(false);

  const { data: servicos, isLoading } = useMarketplaceServicos(filtros);
  const { data: categorias } = useCategoriasServicos();

  const handleAgendar = (servico: any) => {
    if (!profile) {
      navigate('/login');
      return;
    }
    setServicoSelecionado(servico);
    setShowAgendarModal(true);
  };

  const handleBuscar = () => {
    setFiltros(prev => ({ ...prev, busca }));
  };

  const handleFiltroChange = (key: keyof FiltrosMarketplace, value: any) => {
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
            Catálogo de Serviços
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar serviços..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
            />
            <Button onClick={handleBuscar}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={filtros.categoria}
              onValueChange={(value) => handleFiltroChange('categoria', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {categorias?.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Preço mínimo"
              value={filtros.precoMin || ''}
              onChange={(e) => handleFiltroChange('precoMin', e.target.value ? Number(e.target.value) : undefined)}
            />

            <Input
              type="number"
              placeholder="Preço máximo"
              value={filtros.precoMax || ''}
              onChange={(e) => handleFiltroChange('precoMax', e.target.value ? Number(e.target.value) : undefined)}
            />
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
        ) : !servicos?.length ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Nenhum serviço encontrado
          </div>
        ) : (
          servicos.map((servico) => (
            <Card key={servico.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold">{servico.nome}</h3>
                    <Badge variant="secondary" className="mt-1">
                      {servico.categoria}
                    </Badge>
                  </div>

                  {servico.descricao && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {servico.descricao}
                    </p>
                  )}

                  {servico.prestador && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {servico.prestador.nome}
                      </span>
                      {servico.prestador.media_avaliacoes > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">
                            {servico.prestador.media_avaliacoes.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {servico.tempo_estimado && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {servico.tempo_estimado}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-1 text-primary font-semibold">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(servico.valor_venda)}
                    </div>
                    <Button size="sm" onClick={() => handleAgendar(servico)}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {servicoSelecionado && (
        <AgendarServicoModal
          servico={servicoSelecionado}
          open={showAgendarModal}
          onOpenChange={setShowAgendarModal}
        />
      )}
    </div>
  );
};
