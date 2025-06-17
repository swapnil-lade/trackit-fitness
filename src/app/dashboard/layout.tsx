
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarSeparator,
  SidebarInset,
} from "@/components/ui/sidebar";
import { DASHBOARD_NAV_LINKS, DASHBOARD_SETTINGS_LINKS, type NavLink } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar"; 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const renderNavLinks = (links: NavLink[]) =>
    links.map((link) => (
      <SidebarMenuItem key={link.label}>
        <SidebarMenuButton
          asChild
          isActive={pathname === link.href}
          tooltip={link.label}
        >
          <Link href={link.href}>
            <link.icon />
            <span className="group-data-[collapsible=icon]:group-data-[collapsed=true]:hidden">{link.label}</span>
            {/* Removed AI Suggestions Badge as AI features were removed */}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  const logoutLinkConfig = DASHBOARD_SETTINGS_LINKS.find(l => l.label === 'Logout');
  const LogoutIcon = logoutLinkConfig ? logoutLinkConfig.icon : null;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar 
            variant="sidebar" 
            collapsible="icon"
        >
          <SidebarHeader className="p-4 flex items-center group-data-[collapsible=icon]:group-data-[collapsed=true]:justify-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Logo className="h-8 w-auto text-primary group-data-[collapsible=icon]:group-data-[collapsed=true]:h-7 group-data-[collapsible=icon]:group-data-[collapsed=true]:w-7" />
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-2 flex flex-col"> 
            <ScrollArea className="flex-1"> 
              <SidebarMenu>{renderNavLinks(DASHBOARD_NAV_LINKS)}</SidebarMenu>
            </ScrollArea>
          </SidebarContent>
          <SidebarFooter className="p-2">
            <SidebarSeparator className="my-2" />
            <SidebarMenu>{renderNavLinks(DASHBOARD_SETTINGS_LINKS.filter(link => link.label !== 'Logout' && link.label !== 'Profile' && link.label !== 'Settings'))}</SidebarMenu>
            
            {logoutLinkConfig && LogoutIcon && (
               <SidebarMenuItem>
                 <SidebarMenuButton asChild tooltip="Logout">
                    <Link href={logoutLinkConfig.href}>
                      <LogoutIcon />
                      <span className="group-data-[collapsible=icon]:group-data-[collapsed=true]:hidden">Logout</span>
                    </Link>
                 </SidebarMenuButton>
               </SidebarMenuItem>
            )}
            <SidebarSeparator className="my-2" />
            <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:group-data-[collapsed=true]:justify-center">
              <Avatar className="h-9 w-9 group-data-[collapsible=icon]:group-data-[collapsed=true]:h-7 group-data-[collapsible=icon]:group-data-[collapsed=true]:w-7">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar"/>
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="group-data-[collapsible=icon]:group-data-[collapsed=true]:hidden">
                <p className="text-sm font-medium">User</p>
                <p className="text-xs text-muted-foreground">user@example.com</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset> 
          <DashboardNavbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background"> 
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
