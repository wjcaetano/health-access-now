import React from "react";
import { cn } from "@/lib/utils";
import { Check, User, ShoppingCart, CreditCard, CheckCircle } from "lucide-react";

export interface VendaStep {
  id: number;
  name: string;
  description: string;
  icon: React.ElementType;
}

const steps: VendaStep[] = [
  { 
    id: 1, 
    name: 'Cliente', 
    description: 'Buscar ou cadastrar',
    icon: User 
  },
  { 
    id: 2, 
    name: 'Serviços', 
    description: 'Selecionar serviços',
    icon: ShoppingCart 
  },
  { 
    id: 3, 
    name: 'Pagamento', 
    description: 'Forma de pagamento',
    icon: CreditCard 
  },
  { 
    id: 4, 
    name: 'Conclusão', 
    description: 'Finalizar venda',
    icon: CheckCircle 
  }
];

interface VendaStepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const VendaStepper: React.FC<VendaStepperProps> = ({ 
  currentStep, 
  onStepClick 
}) => {
  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between">
        {/* Linha de conexão */}
        <div className="absolute top-[22px] left-0 right-0 h-0.5 bg-border -z-10" />
        <div 
          className="absolute top-[22px] left-0 h-0.5 bg-primary transition-all duration-500 ease-in-out -z-10"
          style={{ 
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
          }}
        />

        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = onStepClick && step.id <= currentStep;

          return (
            <div 
              key={step.id}
              className="flex flex-col items-center flex-1 relative"
            >
              {/* Círculo do step */}
              <button
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={cn(
                  "relative flex items-center justify-center w-11 h-11 rounded-full border-2 transition-all duration-300",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                  isCompleted && "bg-primary border-primary text-primary-foreground",
                  isCurrent && "bg-primary border-primary text-primary-foreground scale-110 shadow-lg",
                  !isCompleted && !isCurrent && "bg-background border-border text-muted-foreground",
                  isClickable && "cursor-pointer hover:scale-105",
                  !isClickable && "cursor-not-allowed opacity-50"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 animate-scale-in" />
                ) : (
                  <StepIcon className={cn(
                    "w-5 h-5",
                    isCurrent && "animate-pulse"
                  )} />
                )}
              </button>

              {/* Label do step */}
              <div className="mt-3 text-center max-w-[120px]">
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  (isCompleted || isCurrent) ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 hidden md:block">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
