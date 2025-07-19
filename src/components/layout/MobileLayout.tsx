
import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { Outlet } from "react-router-dom";

interface MobileLayoutProps {
  userProfile: string;
  children?: React.ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ userProfile, children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header 
          title="Dashboard"
          toggleSidebar={toggleSidebar}
        />
        <Sidebar 
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          userProfile={userProfile}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-3 pb-20">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};
