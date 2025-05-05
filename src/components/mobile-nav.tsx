"use client";

import { Home, CreditCard, BarChart3, Settings } from "lucide-react";

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden z-10">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeTab === "dashboard" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Home className="h-5 w-5 mb-1" />
          <span className="text-xs">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab("expenses")}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeTab === "expenses" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <CreditCard className="h-5 w-5 mb-1" />
          <span className="text-xs">Expenses</span>
        </button>

        <button
          onClick={() => setActiveTab("reports")}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeTab === "reports" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <BarChart3 className="h-5 w-5 mb-1" />
          <span className="text-xs">Reports</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeTab === "settings" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Settings className="h-5 w-5 mb-1" />
          <span className="text-xs">Settings</span>
        </button>
      </div>
    </div>
  );
}
