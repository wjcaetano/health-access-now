
import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = "md", 
  className, 
  text 
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className={cn(
          "animate-spin rounded-full border-b-2 border-agendaja-primary",
          sizeClasses[size],
          className
        )}
      />
      {text && (
        <p className="text-gray-500 text-sm">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
