import React from 'react';
import { CatalogoServicos } from '@/components/marketplace/CatalogoServicos';

const MarketplaceServicos: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Marketplace de Serviços</h1>
        <p className="text-muted-foreground">
          Explore e agende serviços de saúde de forma rápida e fácil
        </p>
      </div>
      <CatalogoServicos />
    </div>
  );
};

export default MarketplaceServicos;
