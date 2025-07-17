
import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { Outlet } from "react-router-dom";

interface DesktopLayoutProps {
  userProfile: string;
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({ userProfile }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="grid grid-cols-[250px_1fr] h-screen">
          <Sidebar 
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            userProfile={userProfile}
          />
          <div className="flex flex-col overflow-hidden">
            <Header 
              title="Dashboard"
              toggleSidebar={toggleSidebar}
            />
            <main className="flex-1 overflow-y-auto p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
