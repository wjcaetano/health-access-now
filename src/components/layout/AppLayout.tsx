
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
  return isMobile ? (
    <MobileLayout userProfile={userProfile}>
      {children}
    </MobileLayout>
  ) : (
    <DesktopLayout userProfile={userProfile}>
      {children}
    </DesktopLayout>
  );
};

export default AppLayout;
