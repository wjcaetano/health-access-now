
import React, { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PrintContainerProps {
  children: ReactNode;
  className?: string;
  printOnly?: boolean;
  pageBreakAfter?: boolean;
}

export const PrintContainer = forwardRef<HTMLDivElement, PrintContainerProps>(({
  children,
  className,
  printOnly = false,
  pageBreakAfter = false
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        printOnly && 'hidden print:block',
        pageBreakAfter && 'page-break-after',
        className
      )}
    >
      {children}
    </div>
  );
});

PrintContainer.displayName = 'PrintContainer';
