
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

interface ErrorHandlerOptions {
  title?: string;
  defaultMessage?: string;
  showToast?: boolean;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((
    error: any, 
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      title = "Erro",
      defaultMessage = "Ocorreu um erro inesperado. Tente novamente.",
      showToast = true
    } = options;

    console.error("Error handled:", error);

    const errorMessage = error?.message || defaultMessage;

    if (showToast) {
      toast({
        title,
        description: errorMessage,
        variant: "destructive",
      });
    }

    return errorMessage;
  }, [toast]);

  return { handleError };
};
