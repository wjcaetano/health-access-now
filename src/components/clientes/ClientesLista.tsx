import React, { lazy, Suspense } from "react";
import FormularioCliente from "@/components/clientes/FormularioCliente";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load para melhor performance
const LazyOptimizedClientesLista = lazy(() => import("@/components/clientes/OptimizedClientesLista"));

const ClientesLista = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in max-w-7xl">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Gestão de Clientes</h2>
        <p className="text-gray-500 text-sm md:text-base">
          Cadastre e gerencie os clientes do sistema
        </p>
      </div>

      <div className="space-y-6">
        <FormularioCliente />
        <Suspense fallback={
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        }>
          <LazyOptimizedClientesLista />
        </Suspense>
      </div>
    </div>
  );
};

export default ClientesLista;