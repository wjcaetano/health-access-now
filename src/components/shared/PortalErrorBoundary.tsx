
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface PortalErrorBoundaryProps {
  children: React.ReactNode;
  portalType: 'unidade' | 'prestador' | 'franqueadora';
}

function ErrorFallback({ error, resetErrorBoundary, portalType }: { 
  error: Error; 
  resetErrorBoundary: () => void;
  portalType: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Erro no Portal {portalType}
          </h2>
          <p className="text-gray-600 mb-4">
            Ocorreu um erro inesperado no portal. Por favor, tente novamente.
          </p>
          <pre className="text-sm text-gray-500 bg-gray-100 p-3 rounded mb-4 overflow-auto">
            {error.message}
          </pre>
          <button
            onClick={resetErrorBoundary}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PortalErrorBoundary({ children, portalType }: PortalErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} portalType={portalType} />
      )}
      onError={(error, errorInfo) => {
        console.error(`Portal ${portalType} error:`, error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
