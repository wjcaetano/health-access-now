import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FileText, Download, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useGerarRelatorio, useExportarCSV, TipoRelatorio } from '@/hooks/useRelatoriosCentralizados';
import { cn } from '@/lib/utils';

export const RelatoriosCentralizados: React.FC = () => {
  const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>('vendas');
  const [dataInicio, setDataInicio] = useState<Date>(new Date());
  const [dataFim, setDataFim] = useState<Date>(new Date());

  const { mutate: gerarRelatorio, isPending: gerando, data: relatorioData } = useGerarRelatorio();
  const { mutate: exportarCSV, isPending: exportando } = useExportarCSV();

  const handleGerar = () => {
    gerarRelatorio({
      tipo: tipoRelatorio,
      dataInicio,
      dataFim
    });
  };

  const handleExportar = () => {
    if (relatorioData?.data) {
      exportarCSV({
        data: Array.isArray(relatorioData.data) ? relatorioData.data : [],
        tipo: tipoRelatorio
      });
    }
  };

  const tiposRelatorio = [
    { value: 'vendas', label: 'Vendas' },
    { value: 'agendamentos', label: 'Agendamentos' },
    { value: 'prestadores', label: 'Prestadores' },
    { value: 'clientes', label: 'Clientes' },
    { value: 'avaliacoes', label: 'Avaliações' },
    { value: 'financeiro', label: 'Financeiro' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Gerar Relatórios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Tipo de Relatório
              </label>
              <Select
                value={tipoRelatorio}
                onValueChange={(value) => setTipoRelatorio(value as TipoRelatorio)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tiposRelatorio.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Data Início
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !dataInicio && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataInicio ? (
                      format(dataInicio, 'dd/MM/yyyy', { locale: ptBR })
                    ) : (
                      <span>Selecione</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dataInicio}
                    onSelect={(date) => date && setDataInicio(date)}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Data Fim
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !dataFim && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataFim ? (
                      format(dataFim, 'dd/MM/yyyy', { locale: ptBR })
                    ) : (
                      <span>Selecione</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dataFim}
                    onSelect={(date) => date && setDataFim(date)}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleGerar} disabled={gerando} className="flex-1">
              {gerando ? 'Gerando...' : 'Gerar Relatório'}
            </Button>
            {relatorioData && (
              <Button
                onClick={handleExportar}
                disabled={exportando}
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                {exportando ? 'Exportando...' : 'Exportar CSV'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {relatorioData && (
        <Card>
          <CardHeader>
            <CardTitle>Prévia do Relatório</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>
                Relatório de <strong>{tiposRelatorio.find(t => t.value === tipoRelatorio)?.label}</strong>
              </p>
              <p>
                Período: {format(dataInicio, 'dd/MM/yyyy')} até {format(dataFim, 'dd/MM/yyyy')}
              </p>
              <p className="mt-2">
                Total de registros: <strong>
                  {Array.isArray(relatorioData.data) ? relatorioData.data.length : 'N/A'}
                </strong>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
