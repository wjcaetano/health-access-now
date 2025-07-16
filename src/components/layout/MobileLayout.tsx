
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { AppRoutes } from "./AppRoutes";

interface MobileLayoutProps {
  userProfile: string;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ userProfile }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
            <AppRoutes />
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};
