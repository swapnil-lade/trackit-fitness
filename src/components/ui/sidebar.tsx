
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
  // For desktop, 'open' means expanded. For mobile, 'openMobile' controls visibility.
  const [open, setOpen] = useState(defaultOpen); // For desktop: true means expanded, false means collapsed
  const [openMobile, setOpenMobile] = useState(false); // For mobile: true means visible, false means hidden
  const [isCollapsed, setIsCollapsed] = useState(!defaultOpen); // True if sidebar is in icon-only state (desktop)

  useEffect(() => {
    if (isMobile) {
      // On mobile, 'open' (desktop expanded state) is not relevant.
      // 'openMobile' controls visibility. Collapsed state is also not relevant for mobile overlay.
      setIsCollapsed(false); // Mobile doesn't have a "collapsed" state, it's either open or closed
    } else {
      // On desktop, ensure 'openMobile' is false and 'isCollapsed' reflects 'open'
      setOpenMobile(false);
      setIsCollapsed(!open);
    }
  }, [isMobile, open]);

  const toggleSidebar = () => {
    if (isMobile) {
      setOpenMobile(prev => !prev);
    } else {
      setOpen(prevOpen => {
        const newOpenState = !prevOpen;
        setIsCollapsed(!newOpenState); // Update collapsed state based on new open state
        return newOpenState;
      });
    }
  };
  
  const value = useMemo(() => ({
    open: isMobile ? openMobile : open, // Effective open state (visible/expanded)
    setOpen: isMobile ? setOpenMobile : setOpen,
    openMobile, // Specific mobile visibility state
    setOpenMobile,
    isMobile,
    toggleSidebar,
    isCollapsed: isMobile ? false : isCollapsed, // isCollapsed is only for desktop
    setIsCollapsed: (value) => { // setIsCollapsed should only affect desktop
      if (!isMobile) {
        setIsCollapsed(value);
        setOpen(!value); // Keep 'open' and 'isCollapsed' in sync for desktop
      }
    }
  }), [open, openMobile, isMobile, isCollapsed]);

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

export const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: string, collapsible?: string }>(
  ({ className, children, variant, collapsible, ...props }, ref) => {
    const { isMobile, openMobile, isCollapsed } = useSidebar();
    
    // Determine current open state for applying classes
    // On mobile, openMobile determines if it's shown. On desktop, !isCollapsed means it's expanded.
    const isOpen = isMobile ? openMobile : !isCollapsed;

    return (
      <aside
        ref={ref}
        className={cn(
          "transition-all duration-300 ease-in-out", // Base transition
          // Desktop states
          !isMobile && collapsible === 'icon' && (isCollapsed ? "md:w-20" : "md:w-64"),
          // Mobile states
          isMobile && (openMobile ? "w-64" : "w-0 hidden"), // Mobile open/closed
          // Default width if not icon collapsible (e.g., rail or no collapse) or on desktop if always expanded
          !isMobile && collapsible !== 'icon' && "md:w-64",
          className // Allow additional classes from parent
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
  ({ className, children, ...props }, ref) => <div ref={ref} className={cn("", className)} {...props}>{children}</div>
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
  // Destructure asChild from props to avoid passing it to DOM element if Comp is "button"
  const { asChild: _asChild, ...domProps } = props;

  return (
    <Comp
      ref={ref}
      className={cn( !asChild ? "minimal-sidebar-trigger" : "", className)}
      {...(Comp === 'button' ? domProps : props)} // Pass all props if Slot, only domProps if button
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
  HTMLElement, // Can be HTMLAnchorElement if asChild points to Link, or HTMLButtonElement
  React.HTMLAttributes<HTMLElement> & { // Broaden type for props
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string;
  }
>(({ className, children, asChild = false, isActive, tooltip, ...buttonProps }, ref) => {
  const Comp = asChild ? Slot : "button";
  
  // Ensure type safety for DOM props if Comp is 'button'
  const domProps = Comp === 'button' ? (buttonProps as React.ButtonHTMLAttributes<HTMLButtonElement>) : buttonProps;

  return (
    <Comp
      ref={ref}
      className={cn(
        "w-full flex items-center text-sm px-3 py-2.5 rounded-md",
        "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0", // Center icon when collapsed
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
        className
      )}
      title={tooltip} // Use title for native tooltip, or integrate with Tooltip component
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
    const expandedWidth = "16rem"; // Corresponds to md:w-64
    const collapsedWidth = "5rem";  // Corresponds to md:w-20

    return (
      <div // Changed from main to div for semantic correctness, main is in layout.tsx
        ref={ref}
        className={cn(
          "transition-[padding-left] duration-300 ease-in-out",
          className
        )}
        style={{
          paddingLeft: isMobile ? '0px' : (isCollapsed ? collapsedWidth : expandedWidth)
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SidebarInset.displayName = "SidebarInset";

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

interface SidebarContextValue {
  collapsible?: "icon" | "rail";
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  mobile?: boolean;
  mobileOpen?: boolean;
  onMobileOpen?: (open: boolean) => void;
  fullWidth?: boolean;
}
const _SidebarContext = React.createContext<SidebarContextValue | null>(null);

export { _SidebarContext as ActualSidebarContext };

