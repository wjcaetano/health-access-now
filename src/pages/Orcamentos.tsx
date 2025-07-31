import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { LazyVisualizarOrcamento } from "@/components/layout/LazyPages";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load para melhor performance
const LazyOptimizedOrcamentosLista = lazy(() => import("@/components/orcamentos/OptimizedOrcamentosLista"));

const Orcamentos: React.FC = () => {
  return (
    <Routes>
      <Route index element={
        <Suspense fallback={
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        }>
          <LazyOptimizedOrcamentosLista />
        </Suspense>
      } />
      <Route path=":id" element={
        <SuspenseWrapper>
          <LazyVisualizarOrcamento />
        </SuspenseWrapper>
      } />
    </Routes>
  );
};

export default Orcamentos;