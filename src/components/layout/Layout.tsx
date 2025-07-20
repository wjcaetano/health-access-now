
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "./AppLayout";
import { LoadingLayout } from "./LoadingLayout";
import { InactiveUserLayout } from "./InactiveUserLayout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { loading, isActive } = useAuth();

  if (loading) {
    return <LoadingLayout isMobile={false} />;
  }

  if (!isActive) {
    return <InactiveUserLayout />;
  }

  return <AppLayout>{children}</AppLayout>;
};

export default Layout;
