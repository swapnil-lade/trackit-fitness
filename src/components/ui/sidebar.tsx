
"use client";
import React, { type ReactNode, createContext, useContext, useState, useMemo, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarContextType {
  open: boolean; 
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openMobile: boolean; 
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  toggleSidebar: () => void;
  isCollapsed: boolean; 
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children, defaultOpen = true }: { children: ReactNode, defaultOpen?: boolean }) => {
  const isMobile = useIsMobile();
  
  const [openDesktop, setOpenDesktop] = useState(defaultOpen);
  const [isCollapsed, setIsCollapsed] = useState(!defaultOpen);
  const [openMobile, setOpenMobile] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(false); 
    } else {
      setIsCollapsed(!openDesktop);
      setOpenMobile(false); 
    }
  }, [isMobile, openDesktop]);

  const toggleSidebar = () => {
    if (isMobile) {
      setOpenMobile(prev => !prev);
    } else {
      setOpenDesktop(prevOpen => {
        const newOpenState = !prevOpen;
        setIsCollapsed(!newOpenState);
        return newOpenState;
      });
    }
  };
  
  const value = useMemo(() => ({
    open: isMobile ? openMobile : openDesktop,
    setOpen: (valOrUpdater) => { 
      if (isMobile) {
        setOpenMobile(valOrUpdater);
      } else {
        const newOpenDesktopState = typeof valOrUpdater === 'function' ? valOrUpdater(openDesktop) : valOrUpdater;
        setOpenDesktop(newOpenDesktopState);
        setIsCollapsed(!newOpenDesktopState);
      }
    },
    openMobile, 
    setOpenMobile,
    isMobile,
    toggleSidebar,
    isCollapsed: isMobile ? false : isCollapsed, 
    setIsCollapsed: (valOrUpdater) => { 
      if (!isMobile) {
        const newCollapsedState = typeof valOrUpdater === 'function' ? valOrUpdater(isCollapsed) : valOrUpdater;
        setIsCollapsed(newCollapsedState);
        setOpenDesktop(!newCollapsedState); 
      }
    }
  }), [openDesktop, openMobile, isMobile, isCollapsed, toggleSidebar]);

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};
SidebarProvider.displayName = "SidebarProvider";

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: string, collapsible?: "icon" | "rail" | string }>(
  ({ className, children, variant, collapsible = "icon", ...props }, ref) => {
    const { isMobile, openMobile, isCollapsed } = useSidebar();
    
    const desktopExpandedWidth = "md:w-64"; 
    const desktopCollapsedWidth = "md:w-20"; 
    const mobileOpenWidth = "w-64";

    return (
      <aside
        ref={ref}
        className={cn(
          "transition-all duration-300 ease-in-out",
          "bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
          "flex flex-col", // Ensure it's a flex column for header/content/footer
          isMobile && "fixed inset-y-0 left-0 z-40 transform",
          isMobile && (openMobile ? `${mobileOpenWidth} translate-x-0` : `w-0 -translate-x-full`),
          !isMobile && "sticky top-0 h-screen", 
          !isMobile && collapsible === 'icon' && (isCollapsed ? desktopCollapsedWidth : desktopExpandedWidth),
          !isMobile && collapsible !== 'icon' && desktopExpandedWidth,
          className 
        )}
        data-variant={variant}
        data-collapsible={collapsible}
        data-collapsed={!isMobile && collapsible === 'icon' ? isCollapsed : undefined}
        aria-hidden={isMobile ? !openMobile : undefined}
        {...props}
      >
        {children}
      </aside>
    );
  }
);
Sidebar.displayName = "Sidebar";

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => <header ref={ref} className={cn("group", className)} {...props}>{children}</header>
);
SidebarHeader.displayName = "SidebarHeader";

export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => <div ref={ref} className={cn("group flex-1 flex flex-col", className)} {...props}>{children}</div>
);
SidebarContent.displayName = "SidebarContent";

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => <footer ref={ref} className={cn("group", className)} {...props}>{children}</footer>
);
SidebarFooter.displayName = "SidebarFooter";


export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, children, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      className={cn(className)} 
      {...props}
    >
      {children}
    </Comp>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";


export const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, children, ...props }, ref) => <ul ref={ref} className={cn("space-y-1 flex-1", className)} {...props}>{children}</ul>
);
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, children, ...props }, ref) => <li ref={ref} className={cn("", className)} {...props}>{children}</li>
);
SidebarMenuItem.displayName = "SidebarMenuItem";


export const SidebarMenuButton = React.forwardRef<
  HTMLElement, 
  React.HTMLAttributes<HTMLElement> & { 
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string;
  }
>(({ className, children, asChild = false, isActive, tooltip, ...buttonProps }, ref) => {
  const Comp = asChild ? Slot : "button";
  const domProps = Comp === 'button' ? (buttonProps as React.ButtonHTMLAttributes<HTMLButtonElement>) : buttonProps;

  return (
    <Comp
      ref={ref}
      className={cn(
        "w-full flex items-center text-sm px-3 py-2.5 rounded-md",
        "group-data-[collapsible=icon]:group-data-[collapsed=true]:justify-center group-data-[collapsible=icon]:group-data-[collapsed=true]:px-0", 
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
        className
      )}
      title={tooltip} 
      {...domProps}
    >
      {children}
    </Comp>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";


export const SidebarMenuBadge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => <div ref={ref} className={cn("ml-auto text-xs px-2 py-0.5 rounded-full", className)} {...props}>{children}</div>
);
SidebarMenuBadge.displayName = "SidebarMenuBadge";

export const SidebarSeparator = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => <hr ref={ref} className={cn("my-2 border-sidebar-border", className)} {...props} />
);
SidebarSeparator.displayName = "SidebarSeparator";

export const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          "flex-1 flex flex-col bg-background", // Removed transition-[padding-left]
          className
        )}
        // Removed inline style for paddingLeft
        {...props}
      >
        {children}
      </div>
    );
  }
);
SidebarInset.displayName = "SidebarInset";
