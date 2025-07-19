
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import TenantAwareLayout from "./TenantAwareLayout";
import LoadingLayout from "./LoadingLayout";
import InactiveUserLayout from "./InactiveUserLayout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { loading, isActive } = useAuth();

  if (loading) {
    return <LoadingLayout />;
  }

  if (!isActive) {
    return <InactiveUserLayout />;
  }

  return (
    <TenantAwareLayout>
      {children}
    </TenantAwareLayout>
  );
};

export default Layout;
