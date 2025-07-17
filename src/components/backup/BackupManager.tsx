
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useBackup } from '@/hooks/useBackup';
import { Database, Download, Upload, Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AVAILABLE_TABLES = [
  { id: 'clientes', label: 'Clientes', essential: true },
  { id: 'prestadores', label: 'Prestadores', essential: true },
  { id: 'servicos', label: 'Serviços', essential: true },
  { id: 'agendamentos', label: 'Agendamentos', essential: true },
  { id: 'vendas', label: 'Vendas', essential: true },
  { id: 'orcamentos', label: 'Orçamentos', essential: false },
  { id: 'guias', label: 'Guias', essential: true },
  { id: 'mensagens', label: 'Mensagens', essential: false },
  { id: 'colaboradores', label: 'Colaboradores', essential: true },
  { id: 'notifications', label: 'Notificações', essential: false }
];

export default function BackupManager() {
  const [selectedTables, setSelectedTables] = useState<string[]>(
    AVAILABLE_TABLES.filter(table => table.essential).map(table => table.id)
  );
  const [includeFiles, setIncludeFiles] = useState(false);
  
  const { status, createBackup, exportData } = useBackup();
  const { toast } = useToast();

  const handleTableToggle = (tableId: string) => {
    setSelectedTables(prev => 
      prev.includes(tableId) 
        ? prev.filter(id => id !== tableId)
        : [...prev, tableId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTables(AVAILABLE_TABLES.map(table => table.id));
  };

  const handleSelectEssential = () => {
    setSelectedTables(AVAILABLE_TABLES.filter(table => table.essential).map(table => table.id));
  };

  const handleCreateBackup = async () => {
    if (selectedTables.length === 0) {
      toast({
        title: 'Nenhuma tabela selecionada',
        description: 'Selecione pelo menos uma tabela para fazer backup.',
        variant: 'destructive'
      });
      return;
    }

    await createBackup({
      tables: selectedTables,
      includeFiles,
      format: 'json',
      compression: true
    });
  };

  const handleExportTable = (tableName: string) => {
    exportData(tableName);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Backup e Exportação</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backup Completo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backup Completo do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Selecionar Tabelas:</span>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={handleSelectEssential}>
                  Essenciais
                </Button>
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  Todas
                </Button>
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {AVAILABLE_TABLES.map(table => (
                <div key={table.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={table.id}
                    checked={selectedTables.includes(table.id)}
                    onCheckedChange={(checked) => {
                      if (checked === true) {
                        setSelectedTables(prev => [...prev, table.id]);
                      } else {
                        setSelectedTables(prev => prev.filter(id => id !== table.id));
                      }
                    }}
                  />
                  <label 
                    htmlFor={table.id} 
                    className="text-sm flex items-center gap-2 cursor-pointer"
                  >
                    {table.label}
                    {table.essential && (
                      <Shield className="h-3 w-3 text-orange-500" />
                    )}
                  </label>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-files"
                checked={includeFiles}
                onCheckedChange={(checked) => setIncludeFiles(checked === true)}
              />
              <label htmlFor="include-files" className="text-sm">
                Incluir arquivos anexos
              </label>
            </div>

            {status.isBackingUp && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Fazendo backup...</span>
                  <span>{Math.round(status.progress)}%</span>
                </div>
                <Progress value={status.progress} />
                {status.currentTable && (
                  <p className="text-xs text-gray-500">
                    Processando: {status.currentTable}
                  </p>
                )}
              </div>
            )}

            {status.error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700">{status.error}</span>
              </div>
            )}

            <Button 
              onClick={handleCreateBackup}
              disabled={status.isBackingUp || selectedTables.length === 0}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {status.isBackingUp ? 'Criando Backup...' : 'Criar Backup Completo'}
            </Button>
          </CardContent>
        </Card>

        {/* Exportação Individual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Exportação Individual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Exporte dados específicos em formato CSV para análise ou migração.
            </p>

            <div className="space-y-2">
              {AVAILABLE_TABLES.map(table => (
                <div key={table.id} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm font-medium">{table.label}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportTable(table.id)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    CSV
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações de Segurança */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-orange-800">
                Importantes Considerações de Segurança
              </h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Os backups contêm dados sensíveis. Armazene-os com segurança.</li>
                <li>• Teste a restauração dos backups periodicamente.</li>
                <li>• Para dados críticos, considere fazer backups automáticos diários.</li>
                <li>• Mantenha múltiplas cópias em locais diferentes.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
