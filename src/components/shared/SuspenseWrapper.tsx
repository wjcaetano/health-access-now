
import React, { Suspense } from "react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";

interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minHeight?: string;
}

const DefaultFallback: React.FC<{ minHeight?: string }> = ({ minHeight = "400px" }) => (
  <Card className="w-full" style={{ minHeight }}>
    <CardContent className="flex items-center justify-center h-full">
      <LoadingSpinner size="lg" text="Carregando..." />
    </CardContent>
  </Card>
);

export const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({ 
  children, 
  fallback,
  minHeight 
}) => {
  return (
    <Suspense fallback={fallback || <DefaultFallback minHeight={minHeight} />}>
      {children}
    </Suspense>
  );
};

export default SuspenseWrapper;
