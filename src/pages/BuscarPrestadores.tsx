import React from 'react';
import { BuscaGlobalPrestadores } from '@/components/prestadores/BuscaGlobalPrestadores';

const BuscarPrestadores: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Buscar Prestadores</h1>
        <p className="text-muted-foreground">
          Encontre o profissional ou serviço ideal para suas necessidades
        </p>
      </div>
      <BuscaGlobalPrestadores />
    </div>
  );
};

export default BuscarPrestadores;
