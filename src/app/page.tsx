"use client";

import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/toaster";
import { DashboardView } from "@/components/views/DashboardView";
import { ChatView } from "@/components/views/ChatView";
import { ProactiveSuggestionsView } from "@/components/views/ProactiveSuggestionsView";

export default function Home() {
  const [activeView, setActiveView] = useState("dashboard");

  const renderActiveView = () => {
    switch (activeView) {
      case "chat":
        return <ChatView />;
      case "suggestions":
        return <ProactiveSuggestionsView />;
      case "dashboard":
      default:
        return <DashboardView />;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar activeView={activeView} setActiveView={setActiveView} />
      <SidebarInset>
        <div className="flex flex-col h-svh">
          <Header activeView={activeView} />
          <main className="flex-1 overflow-y-auto">
            {renderActiveView()}
          </main>
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
