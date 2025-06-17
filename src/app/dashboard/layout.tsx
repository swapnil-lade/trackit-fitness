
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
  SidebarTrigger,
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const renderNavLinks = (links: NavLink[], isFooter: boolean = false) =>
    links.map((link) => (
      <SidebarMenuItem key={link.label}>
        <SidebarMenuButton
          asChild
          isActive={pathname === link.href}
          tooltip={link.label}
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

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon" className="border-r">
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
          <SidebarMenu>{renderNavLinks(DASHBOARD_SETTINGS_LINKS.filter(link => link.label !== 'Logout'), true)}</SidebarMenu>
           <SidebarMenuItem>
             <SidebarMenuButton asChild tooltip="Logout">
                <Link href="/login"> {/* Actual logout logic would go here */}
                  <DASHBOARD_SETTINGS_LINKS.find(l => l.label === 'Logout')!.icon />
                  <span>Logout</span>
                </Link>
             </SidebarMenuButton>
           </SidebarMenuItem>
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
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
          <SidebarTrigger asChild>
            <Button size="icon" variant="outline">
              <Logo className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SidebarTrigger>
          <h1 className="text-xl font-headline font-semibold">Trackit</h1>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    