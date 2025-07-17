
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

export function ClientesSkeleton() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Card className="w-full">
        <CardHeader className="p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-full max-w-72" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end items-center gap-2 pt-2 border-t">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="p-4 md:p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-10 w-72" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col space-y-3 p-4 border-b last:border-b-0"
            >
              <div className="flex items-start space-x-3">
                <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center space-x-2 sm:col-span-2">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <div className="flex items-center space-x-2 sm:col-span-2">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-4 w-56" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <Skeleton className="h-6 w-16 rounded-full" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
