
import React, { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load para melhor performance
const LazyOptimizedVendasContainer = lazy(() => import("@/components/vendas/OptimizedVendasContainer"));

const Vendas: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    }>
      <LazyOptimizedVendasContainer />
    </Suspense>
  );
};

export default Vendas;
