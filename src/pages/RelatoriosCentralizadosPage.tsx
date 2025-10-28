import React from 'react';
import { RelatoriosCentralizados } from '@/components/relatorios/RelatoriosCentralizados';

const RelatoriosCentralizadosPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">
          Gere e exporte relatórios detalhados do sistema
        </p>
      </div>
      <RelatoriosCentralizados />
    </div>
  );
};

export default RelatoriosCentralizadosPage;
