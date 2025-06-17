
"use client";

import Link from "next/link";
import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DASHBOARD_SETTINGS_LINKS } from "@/lib/constants";
import type { LucideIcon } from "lucide-react";
import { Menu } from "lucide-react";

export function DashboardNavbar() {
  const { toggleSidebar, openMobile, setOpenMobile, isMobile } = useSidebar();

  const logoutLinkConfig = DASHBOARD_SETTINGS_LINKS.find(l => l.label === 'Logout');
  const LogoutIcon = logoutLinkConfig ? logoutLinkConfig.icon : null;
  
  const profileLinkConfig = DASHBOARD_SETTINGS_LINKS.find(l => l.label === 'Profile');
  const ProfileIcon = profileLinkConfig ? profileLinkConfig.icon : null;

  const settingsLinkConfig = DASHBOARD_SETTINGS_LINKS.find(l => l.label === 'Settings');
  const SettingsIcon = settingsLinkConfig ? settingsLinkConfig.icon : null;


  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      {/* Mobile sidebar trigger: only shown on mobile, triggers full sidebar */}
      {isMobile && (
         <Button size="icon" variant="outline" onClick={toggleSidebar} aria-label="Toggle mobile menu">
            <Menu className="h-5 w-5" />
         </Button>
      )}
      {/* Desktop sidebar trigger: only shown on non-mobile, triggers collapse/expand */}
      {!isMobile && (
        <SidebarTrigger asChild>
          <Button size="icon" variant="outline" onClick={toggleSidebar} aria-label="Toggle sidebar">
            <Menu className="h-5 w-5" />
          </Button>
        </SidebarTrigger>
      )}
      
      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground">
                  john.doe@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {profileLinkConfig && ProfileIcon && (
              <DropdownMenuItem asChild>
                <Link href={profileLinkConfig.href}>
                  <ProfileIcon className="mr-2 h-4 w-4" />
                  <span>{profileLinkConfig.label}</span>
                </Link>
              </DropdownMenuItem>
            )}
            {settingsLinkConfig && SettingsIcon && (
              <DropdownMenuItem asChild>
                <Link href={settingsLinkConfig.href}>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>{settingsLinkConfig.label}</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {logoutLinkConfig && LogoutIcon && (
                 <DropdownMenuItem asChild>
                    <Link href={logoutLinkConfig.href}>
                        <LogoutIcon className="mr-2 h-4 w-4" />
                        <span>{logoutLinkConfig.label}</span>
                    </Link>
                 </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
