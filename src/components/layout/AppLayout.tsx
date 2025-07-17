
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileLayout } from "./MobileLayout";
import { DesktopLayout } from "./DesktopLayout";
import { LoadingLayout } from "./LoadingLayout";
import { InactiveUserLayout } from "./InactiveUserLayout";

const AppLayout: React.FC = () => {
  const { loading, isActive, profile } = useAuth();
  const isMobile = useIsMobile();
  
  const userProfile = profile?.prestador_id ? "prestador" : "agendaja";

  if (loading) {
    return <LoadingLayout isMobile={isMobile} />;
  }

  if (!isActive) {
    return <InactiveUserLayout />;
  }

  return isMobile ? (
    <MobileLayout userProfile={userProfile} />
  ) : (
    <DesktopLayout userProfile={userProfile} />
  );
};

export default AppLayout;
