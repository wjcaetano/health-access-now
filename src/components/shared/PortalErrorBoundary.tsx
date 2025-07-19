
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
  portalType: 'unidade' | 'prestador' | 'franqueadora';
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// Hook para navigation dentro da classe
const NavigationHandler: React.FC<{ onReset: () => void; portalType: string }> = ({ 
  onReset, 
  portalType 
}) => {
  const navigate = useNavigate();
  
  const handleGoHome = () => {
    navigate(`/${portalType}/dashboard`);
    onReset();
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex gap-2 justify-center">
      <Button onClick={onReset} variant="outline" size="sm">
        <RotateCcw className="h-4 w-4 mr-2" />
        Tentar Novamente
      </Button>
      <Button onClick={handleGoHome} variant="outline" size="sm">
        <Home className="h-4 w-4 mr-2" />
        Ir para Dashboard
      </Button>
      <Button onClick={handleReload} size="sm">
        Recarregar Página
      </Button>
    </div>
  );
};

class PortalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Portal ${this.props.portalType} Error:`, error, errorInfo);
    
    // Enviar erro para serviço de monitoramento (futuro)
    // sendErrorToService(error, errorInfo, this.props.portalType);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const portalNames = {
        unidade: 'Unidade',
        prestador: 'Prestador',
        franqueadora: 'Franqueadora'
      };

      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-red-600">
                Erro no Portal {portalNames[this.props.portalType]}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Ocorreu um erro inesperado no portal. Nossa equipe foi notificada.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left text-xs bg-gray-100 p-3 rounded border">
                  <summary className="cursor-pointer font-medium">
                    Detalhes técnicos (desenvolvimento)
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap text-red-600">
                    {this.state.error.message}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              
              <NavigationHandler 
                onReset={this.handleReset} 
                portalType={this.props.portalType} 
              />
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PortalErrorBoundary;
