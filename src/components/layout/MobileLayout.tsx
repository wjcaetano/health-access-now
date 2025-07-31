
import React from "react";
import AppSidebar from "./Sidebar";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface MobileLayoutProps {
  userProfile: string;
  children?: React.ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ userProfile, children }) => {
  return (
    <ErrorBoundary>
      <SidebarProvider>
        <div className="min-h-screen flex flex-col w-full bg-background">
          <header className="h-16 flex items-center border-b bg-background px-4">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          </header>
          <AppSidebar userProfile={userProfile} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            <div className="p-3 pb-20">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
};
