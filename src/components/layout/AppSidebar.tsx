"use client";

import { useAdaptiveNavigation } from "@/hooks/use-adaptive-navigation";
import { Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarContent } from "@/components/ui/sidebar";
import { BotMessageSquare } from "lucide-react";

interface AppSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export function AppSidebar({ activeView, setActiveView }: AppSidebarProps) {
  const { navItems, recordInteraction } = useAdaptiveNavigation();

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    recordInteraction(viewId);
  };

  return (
    <Sidebar>
        <SidebarHeader className="border-b border-white/20">
            <div className="flex items-center justify-center h-16">
                <BotMessageSquare className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold ml-2 font-headline text-foreground">EcosystemAI</h1>
            </div>
        </SidebarHeader>
        <SidebarContent>
            <SidebarMenu className="p-4">
            {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                    onClick={() => handleNavClick(item.id)}
                    isActive={activeView === item.id}
                    className="justify-start text-base font-medium"
                    tooltip={item.title}
                >
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
            </SidebarMenu>
        </SidebarContent>
    </Sidebar>
  );
}
