import React from 'react';
import { DashboardEstrategico } from '@/components/dashboard/DashboardEstrategico';

const DashboardEstrategicoPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard Estratégico</h1>
        <p className="text-muted-foreground">
          Visão geral e métricas do hub AGENDAJA
        </p>
      </div>
      <DashboardEstrategico />
    </div>
  );
};

export default DashboardEstrategicoPage;
