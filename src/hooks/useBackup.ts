
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface BackupConfig {
  tables: string[];
  includeFiles?: boolean;
  format: 'json' | 'sql';
  compression?: boolean;
}

export interface BackupStatus {
  isBackingUp: boolean;
  progress: number;
  currentTable?: string;
  error?: string;
}

export function useBackup() {
  const [status, setStatus] = useState<BackupStatus>({
    isBackingUp: false,
    progress: 0
  });
  const { toast } = useToast();

  const createBackup = async (config: BackupConfig) => {
    setStatus({ isBackingUp: true, progress: 0 });

    try {
      const totalTables = config.tables.length;
      let completedTables = 0;

      const backupData: Record<string, any[]> = {};

      for (const table of config.tables) {
        setStatus(prev => ({ 
          ...prev, 
          currentTable: table,
          progress: (completedTables / totalTables) * 100 
        }));

        const { data, error } = await supabase
          .from(table)
          .select('*');

        if (error) {
          throw new Error(`Error backing up table ${table}: ${error.message}`);
        }

        backupData[table] = data || [];
        completedTables++;
      }

      setStatus(prev => ({ ...prev, progress: 100 }));

      // Generate backup file
      const backupContent = JSON.stringify({
        timestamp: new Date().toISOString(),
        version: '1.0',
        tables: backupData
      }, null, 2);

      // Create and download file
      const blob = new Blob([backupContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Backup criado com sucesso',
        description: 'O arquivo de backup foi baixado para seu computador.'
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setStatus(prev => ({ ...prev, error: errorMessage }));
      
      toast({
        title: 'Erro ao criar backup',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setStatus(prev => ({ ...prev, isBackingUp: false, currentTable: undefined }));
    }
  };

  const exportData = async (tableName: string, filters?: Record<string, any>) => {
    try {
      let query = supabase.from(tableName).select('*');

      // Apply filters if provided
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            query = query.eq(key, value);
          }
        });
      }

      const { data, error } = await query;

      if (error) throw error;

      // Export as CSV
      if (data && data.length > 0) {
        const headers = Object.keys(data[0]);
        const csvContent = [
          headers.join(','),
          ...data.map(row => 
            headers.map(header => {
              const value = row[header];
              if (typeof value === 'string' && value.includes(',')) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value;
            }).join(',')
          )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${tableName}-export-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);

        toast({
          title: 'Dados exportados',
          description: `${data.length} registros exportados com sucesso.`
        });
      } else {
        toast({
          title: 'Nenhum dado encontrado',
          description: 'Não há dados para exportar com os filtros aplicados.'
        });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: 'Erro ao exportar dados',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  return {
    status,
    createBackup,
    exportData
  };
}
