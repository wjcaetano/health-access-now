
import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { Outlet } from "react-router-dom";

interface DesktopLayoutProps {
  userProfile: string;
  children?: React.ReactNode;
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({ userProfile, children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className={`grid h-screen ${sidebarCollapsed ? 'grid-cols-[80px_1fr]' : 'grid-cols-[288px_1fr]'} transition-all duration-300`}>
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
              {children || <Outlet />}
            </main>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
