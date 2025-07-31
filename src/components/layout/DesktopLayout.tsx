
import React from "react";
import Header from "./Header";
import AppSidebar from "./Sidebar";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface DesktopLayoutProps {
  userProfile: string;
  children?: React.ReactNode;
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({ userProfile, children }) => {
  return (
    <ErrorBoundary>
      <SidebarProvider defaultOpen>
        <div className="min-h-screen flex w-full bg-white">
          <AppSidebar userProfile={userProfile} />
          <SidebarInset className="flex flex-col flex-1 overflow-hidden">
            <Header 
              title="Dashboard"
              toggleSidebar={() => {}} 
            />
            <main className="flex-1 overflow-y-auto p-6 bg-white">
              {children || <Outlet />}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
};
