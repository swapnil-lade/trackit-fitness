
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider, // Re-added SidebarProvider
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarSeparator,
  SidebarInset,
  useSidebar, // Added useSidebar
} from "@/components/ui/sidebar";
import { DASHBOARD_NAV_LINKS, DASHBOARD_SETTINGS_LINKS, type NavLink } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LucideIcon } from "lucide-react";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar"; // Import new Navbar

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { open: sidebarOpen, setOpen: setSidebarOpen } = useSidebar(); // Get sidebar state

  const renderNavLinks = (links: NavLink[]) =>
    links.map((link) => (
      <SidebarMenuItem key={link.label}>
        <SidebarMenuButton
          asChild
          isActive={pathname === link.href}
          tooltip={link.label}
          // onClick={() => sidebarOpen && setSidebarOpen(false)} // Close sidebar on mobile click
        >
          <Link href={link.href}>
            <link.icon />
            <span>{link.label}</span>
            {link.label === "AI Suggestions" && (
              <SidebarMenuBadge className="bg-primary/20 text-primary">New</SidebarMenuBadge>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  const logoutLinkConfig = DASHBOARD_SETTINGS_LINKS.find(l => l.label === 'Logout');
  const LogoutIcon = logoutLinkConfig ? logoutLinkConfig.icon : null;

  return (
    <SidebarProvider defaultOpen> {/* Restored SidebarProvider */}
      <div className="flex min-h-screen w-full">
        <Sidebar 
            variant="sidebar" 
            collapsible="icon" 
            className="border-r bg-sidebar text-sidebar-foreground data-[collapsed=true]:hidden md:data-[collapsed=true]:flex" // classes for collapse behavior
            // open={sidebarOpen} // Control open state
            // onOpenChange={setSidebarOpen} // Control open state change
        >
          <SidebarHeader className="p-4">
            <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
              <Logo className="h-8 w-auto text-primary group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7" />
              <span className="font-bold text-lg font-headline group-data-[collapsible=icon]:hidden">Trackit</span>
            </Link>
          </SidebarHeader>
          <ScrollArea className="h-[calc(100vh-var(--sidebar-header-h)-var(--sidebar-footer-h)-theme(spacing.8))]">
            <SidebarContent className="p-2 flex-1">
              <SidebarMenu>{renderNavLinks(DASHBOARD_NAV_LINKS)}</SidebarMenu>
            </SidebarContent>
          </ScrollArea>
          <SidebarFooter className="p-2">
            <SidebarSeparator className="my-2" />
            <SidebarMenu>{renderNavLinks(DASHBOARD_SETTINGS_LINKS.filter(link => link.label !== 'Logout' && link.label !== 'Profile' && link.label !== 'Settings'))}</SidebarMenu>
            {/* Profile and Settings links are now in the navbar dropdown, Logout can stay or be removed */}
            {logoutLinkConfig && LogoutIcon && (
               <SidebarMenuItem>
                 <SidebarMenuButton asChild tooltip="Logout">
                    <Link href={logoutLinkConfig.href}>
                      <LogoutIcon />
                      <span>Logout</span>
                    </Link>
                 </SidebarMenuButton>
               </SidebarMenuItem>
            )}
            <SidebarSeparator className="my-2" />
            <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:justify-center">
              <Avatar className="h-9 w-9 group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">john.doe@example.com</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-col flex-1"> {/* Applied flex-1 here */}
          <DashboardNavbar /> {/* Use the new DashboardNavbar */}
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-background"> {/* Main content takes remaining space */}
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
