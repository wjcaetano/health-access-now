
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileLayout } from "./MobileLayout";
import { DesktopLayout } from "./DesktopLayout";
import { LoadingLayout } from "./LoadingLayout";
import { InactiveUserLayout } from "./InactiveUserLayout";

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { loading, isActive, profile } = useAuth();
  const isMobile = useIsMobile();
  
  // Estados de carregamento
  if (loading) {
    return <LoadingLayout isMobile={isMobile} />;
  }

  // Usuário inativo
  if (!isActive) {
    return <InactiveUserLayout />;
  }

  // Determinar tipo de perfil baseado na estrutura mais simples
  const userProfile = profile?.prestador_id ? "prestador" : "unidade";

  // Renderizar layout apropriado
  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ backgroundColor: '#ffffff', color: '#1f2937' }}>
      {isMobile ? (
        <MobileLayout userProfile={userProfile}>
          {children}
        </MobileLayout>
      ) : (
        <DesktopLayout userProfile={userProfile}>
          {children}
        </DesktopLayout>
      )}
    </div>
  );
};

export default AppLayout;
