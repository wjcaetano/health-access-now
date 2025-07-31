import React, { memo, lazy, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load tabs para melhor performance
const LazyNovaVendaTab = lazy(() => import("./NovaVendaTab"));
const LazyHistoricoVendasTab = lazy(() => import("./HistoricoVendasTab"));

const TabSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-8 w-full" />
  </div>
);

const OptimizedVendasContainer: React.FC = memo(() => {
  const { isMobile, getContainerPadding } = useResponsiveLayout();

  return (
    <div className={`space-y-4 ${getContainerPadding()} min-h-0 overflow-hidden`}>
      <header className="space-y-2">
        <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
          Vendas
        </h2>
        <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-base'}`}>
          Gerencie vendas, orçamentos e histórico de transações
        </p>
      </header>

      <Tabs defaultValue="nova-venda" className="w-full">
        <TabsList className={`grid w-full grid-cols-2 ${isMobile ? 'h-9 text-xs' : 'h-10'}`}>
          <TabsTrigger value="nova-venda" className={isMobile ? 'text-xs px-2' : ''}>
            {isMobile ? 'Nova' : 'Nova Venda'}
          </TabsTrigger>
          <TabsTrigger value="historico" className={isMobile ? 'text-xs px-2' : ''}>
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nova-venda" className="mt-4 space-y-4 min-h-0">
          <Suspense fallback={<TabSkeleton />}>
            <LazyNovaVendaTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="historico" className="mt-4 space-y-4 min-h-0">
          <Suspense fallback={<TabSkeleton />}>
            <LazyHistoricoVendasTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
});

OptimizedVendasContainer.displayName = "OptimizedVendasContainer";

export default OptimizedVendasContainer;