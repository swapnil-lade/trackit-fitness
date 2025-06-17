
"use client";
import React, { type ReactNode, createContext, useContext, useState, useMemo, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarContextType {
  open: boolean; // Represents expanded state on desktop, or visible state on mobile
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openMobile: boolean; // Explicit mobile visibility state
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  toggleSidebar: () => void;
  isCollapsed: boolean; // Desktop specific: true if sidebar is icon-only
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children, defaultOpen = true }: { children: ReactNode, defaultOpen?: boolean }) => {
  const isMobile = useIsMobile();
  
  // State for desktop: 'open' means expanded.
  // 'isCollapsed' is the inverse of 'open' for desktop icon-only state.
  const [openDesktop, setOpenDesktop] = useState(defaultOpen);
  const [isCollapsed, setIsCollapsed] = useState(!defaultOpen);
  
  // State for mobile: 'openMobile' controls visibility (overlay).
  const [openMobile, setOpenMobile] = useState(false);

  useEffect(() => {
    if (isMobile) {
      // On mobile, desktop states are not directly relevant for display.
      // Ensure 'isCollapsed' is false as it's a desktop concept.
      setIsCollapsed(false);
    } else {
      // On desktop, sync 'isCollapsed' with 'openDesktop'.
      // Close mobile overlay if transitioning from mobile to desktop.
      setOpenMobile(false);
      setIsCollapsed(!openDesktop);
    }
  }, [isMobile, openDesktop]);

  const toggleSidebar = () => {
    if (isMobile) {
      setOpenMobile(prev => !prev);
    } else {
      setOpenDesktop(prevOpen => {
        const newOpenState = !prevOpen;
        setIsCollapsed(!newOpenState); // Sync collapsed state
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
  }), [openDesktop, openMobile, isMobile, isCollapsed]);

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
  ({ className, children, variant, collapsible, ...props }, ref) => {
    const { isMobile, openMobile, isCollapsed } = useSidebar();
    
    const desktopCollapsedWidth = "md:w-20"; // e.g., w-20 for 5rem
    const desktopExpandedWidth = "md:w-64"; // e.g., w-64 for 16rem
    const mobileOpenWidth = "w-64"; // Sidebar width when open on mobile

    return (
      <aside
        ref={ref}
        className={cn(
          "transition-all duration-300 ease-in-out", 
          // Desktop states
          !isMobile && collapsible === 'icon' && (isCollapsed ? desktopCollapsedWidth : desktopExpandedWidth),
          // Mobile states: fixed position for overlay effect
          isMobile && "fixed inset-y-0 left-0 z-50 transform",
          isMobile && (openMobile ? `${mobileOpenWidth} translate-x-0` : "w-0 -translate-x-full"),
          // Default width if not icon collapsible or on desktop if always expanded
          !isMobile && collapsible !== 'icon' && desktopExpandedWidth,
          className 
        )}
        data-variant={variant}
        data-collapsible={collapsible}
        data-collapsed={collapsible === 'icon' && !isMobile ? isCollapsed : undefined}
        aria-hidden={isMobile && !openMobile}
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
  ({ className, children, ...props }, ref) => <div ref={ref} className={cn("group", className)} {...props}>{children}</div>
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
  const { asChild: _asChild, ...domProps } = props;

  return (
    <Comp
      ref={ref}
      className={cn( !asChild ? "" : "", className)} // Removed minimal-sidebar-trigger
      {...(Comp === 'button' ? domProps : props)} 
    >
      {children}
    </Comp>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";


export const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, children, ...props }, ref) => <ul ref={ref} className={cn("space-y-1", className)} {...props}>{children}</ul>
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
        "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0", 
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
    const { isMobile, isCollapsed } = useSidebar();
    // These should match the Tailwind width classes used in Sidebar component
    const expandedWidthRem = 16; // w-64 -> 16rem
    const collapsedWidthRem = 5; // w-20 -> 5rem
    const baseFontSize = 16; // Assuming default browser font size for rem calculation

    // Convert rem to px for style prop
    const expandedWidthPx = `${expandedWidthRem * baseFontSize}px`; // "256px"
    const collapsedWidthPx = `${collapsedWidthRem * baseFontSize}px`; // "80px"


    return (
      <div 
        ref={ref}
        className={cn(
          "transition-[padding-left] duration-300 ease-in-out", // Match sidebar transition
          className
        )}
        style={{
          paddingLeft: isMobile ? '0px' : (isCollapsed ? collapsedWidthPx : expandedWidthPx)
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SidebarInset.displayName = "SidebarInset";

// Stubs for other potential sidebar parts, can be expanded later
export const SidebarRail = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => <button ref={ref} {...props} />
);
SidebarRail.displayName = "SidebarRail";

export const SidebarInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => <input ref={ref} {...props} />
);
SidebarInput.displayName = "SidebarInput";

export const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} {...props} />
);
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} {...props} />
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarGroupAction = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => <button ref={ref} {...props} />
);
SidebarGroupAction.displayName = "SidebarGroupAction";

export const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} {...props} />
);
SidebarGroupContent.displayName = "SidebarGroupContent";


export const SidebarMenuAction = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => <button ref={ref} {...props} />
);
SidebarMenuAction.displayName = "SidebarMenuAction";

export const SidebarMenuSkeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} {...props} />
);
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

export const SidebarMenuSub = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  (props, ref) => <ul ref={ref} {...props} />
);
SidebarMenuSub.displayName = "SidebarMenuSub";

export const SidebarMenuSubItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  (props, ref) => <li ref={ref} {...props} />
);
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

export const SidebarMenuSubButton = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>( 
  (props, ref) => <a ref={ref} {...props} />
);
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";


interface ActualSidebarContextValue { // Renamed to avoid conflict with SidebarContextType
  collapsible?: "icon" | "rail";
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  mobile?: boolean;
  mobileOpen?: boolean;
  onMobileOpen?: (open: boolean) => void;
  fullWidth?: boolean;
}
// Exporting with a different name if needed for clarity, or ensure it's correctly used internally.
export const ActualSidebarContext = React.createContext<ActualSidebarContextValue | null>(null);
ActualSidebarContext.displayName = "ActualSidebarContext";
