
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingLayoutProps {
  isMobile: boolean;
}

export const LoadingLayout: React.FC<LoadingLayoutProps> = ({ isMobile }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-[250px_1fr]'} h-screen`}>
        {!isMobile && <Skeleton className="h-full" />}
        <div className="flex flex-col flex-1">
          <Skeleton className="h-16" />
          <div className="flex-1 p-4 space-y-4 overflow-hidden">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
