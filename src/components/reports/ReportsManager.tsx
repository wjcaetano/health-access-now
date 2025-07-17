
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDateRangePicker } from '@/components/ui/date-range-picker';
import { useReports, ReportType, ReportFormat, reportUtils } from '@/hooks/useReports';
import { Download, FileText, Filter, Calendar } from 'lucide-react';
import { subDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function ReportsManager() {
  const [reportType, setReportType] = useState<ReportType>('revenue');
  const [reportFormat, setReportFormat] = useState<ReportFormat>('pdf');
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const { generateReport, getReports, downloadReport } = useReports();
  const { data: reports } = getReports;
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    try {
      await generateReport.mutateAsync({
        type: reportType,
        dateRange,
        format: reportFormat,
        includeCharts: true
      });

      toast({
        title: 'Relatório em processamento',
        description: 'Você será notificado quando o relatório estiver pronto.'
      });
    } catch (error) {
      toast({
        title: 'Erro ao gerar relatório',
        description: 'Tente novamente em alguns instantes.',
        variant: 'destructive'
      });
    }
  };

  const handleQuickExport = async (type: 'customers' | 'revenue') => {
    try {
      let data;
      if (type === 'revenue') {
        data = await reportUtils.generateRevenueReport(dateRange);
      } else {
        data = await reportUtils.generateCustomerReport(dateRange);
      }

      if (data) {
        reportUtils.exportToCsv(data, `${type}-report`);
        toast({
          title: 'Dados exportados',
          description: 'O arquivo CSV foi baixado com sucesso.'
        });
      }
    } catch (error) {
      toast({
        title: 'Erro na exportação',
        description: 'Não foi possível exportar os dados.',
        variant: 'destructive'
      });
    }
  };

  const reportTypeOptions = [
    { value: 'revenue', label: 'Receitas' },
    { value: 'appointments', label: 'Agendamentos' },
    { value: 'customers', label: 'Clientes' },
    { value: 'services', label: 'Serviços' },
    { value: 'financial', label: 'Financeiro' },
    { value: 'performance', label: 'Performance' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel' },
    { value: 'csv', label: 'CSV' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Relatórios do Sistema</h2>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Gerar Relatório</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="quick">Exportação Rápida</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Configurar Relatório
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Relatório</label>
                  <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Formato</label>
                  <Select value={reportFormat} onValueChange={(value) => setReportFormat(value as ReportFormat)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formatOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Período</label>
                  <CalendarDateRangePicker
                    date={dateRange}
                    onDateChange={setDateRange}
                  />
                </div>
              </div>

              <Button 
                onClick={handleGenerateReport}
                disabled={generateReport.isPending}
                className="w-full"
              >
                {generateReport.isPending ? 'Gerando...' : 'Gerar Relatório'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Gerados</CardTitle>
            </CardHeader>
            <CardContent>
              {reports && reports.length > 0 ? (
                <div className="space-y-3">
                  {reports.map(report => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{report.title}</h4>
                        <p className="text-sm text-gray-500">
                          Criado em {new Date(report.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-xs text-gray-400">
                          Status: {report.status}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {report.status === 'completed' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => downloadReport(report.id)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Baixar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Nenhum relatório encontrado
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exportação Rápida (CSV)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <CalendarDateRangePicker
                  date={dateRange}
                  onDateChange={setDateRange}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => handleQuickExport('revenue')}
                    className="h-20 flex-col"
                  >
                    <Download className="h-6 w-6 mb-2" />
                    Exportar Receitas
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleQuickExport('customers')}
                    className="h-20 flex-col"
                  >
                    <Download className="h-6 w-6 mb-2" />
                    Exportar Clientes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
