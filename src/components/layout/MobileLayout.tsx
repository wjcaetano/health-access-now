
import React from "react";
import Header from "./Header";
import AppSidebar from "./Sidebar";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

interface MobileLayoutProps {
  userProfile: string;
  children?: React.ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ userProfile, children }) => {
  return (
    <ErrorBoundary>
      <SidebarProvider>
        <div className="min-h-screen flex flex-col w-full bg-white">
          <Header 
            title="Dashboard"
            toggleSidebar={() => {}}
          />
          <AppSidebar userProfile={userProfile} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
            <div className="p-3 pb-20">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
};
