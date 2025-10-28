
import React from "react";
import { Outlet } from "react-router-dom";
import { BottomNavigation } from "./BottomNavigation";

interface MobileLayoutProps {
  userProfile: string;
  children?: React.ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ userProfile, children }) => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-white">
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white pb-16">
        <div className="p-3">
          {children || <Outlet />}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};
