
import React from "react";
import Header from "./Header";
import AppSidebar from "./Sidebar";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface DesktopLayoutProps {
  userProfile: string;
  children?: React.ReactNode;
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({ userProfile, children }) => {
  return (
    <ErrorBoundary>
      <SidebarProvider defaultOpen>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar userProfile={userProfile} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <header className="h-16 flex items-center border-b bg-background px-4">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-6 bg-background">
              {children || <Outlet />}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
};
