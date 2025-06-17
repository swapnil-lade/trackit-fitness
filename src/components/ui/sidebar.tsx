
"use client";
import React, { type ReactNode, createContext, useContext, useState, useMemo, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { useIsMobile } from '@/hooks/use-mobile'; // Assuming this hook is correct

// Define the shape of the context state
interface SidebarContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openMobile: boolean;
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  toggleSidebar: () => void;
  isCollapsed: boolean; // Add isCollapsed if needed based on 'collapsible' prop
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>; // Add setIsCollapsed
}

// Create the context with a default undefined value to catch misuse
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children, defaultOpen = false }: { children: ReactNode, defaultOpen?: boolean }) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(defaultOpen);
  const [openMobile, setOpenMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(!defaultOpen); // Example state for collapsible

  // Adjust open state based on isMobile and openMobile
  useEffect(() => {
    if (isMobile) {
      setOpen(false); // Collapse sidebar on mobile by default or manage via openMobile
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setOpenMobile(prev => !prev);
    } else {
      setOpen(prev => !prev);
      setIsCollapsed(prev => !prev);
    }
  };
  
  // Memoize the context value
  const value = useMemo(() => ({
    open: isMobile ? openMobile : open, // Derive open state based on mobile
    setOpen: isMobile ? setOpenMobile : setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
    isCollapsed, // Provide isCollapsed
    setIsCollapsed, // Provide setIsCollapsed
  }), [open, setOpen, openMobile, setOpenMobile, isMobile, isCollapsed, setIsCollapsed]);

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

// --- Minimal Stubs for other imported components ---
// (Keeping the stubs as they were, focusing on Provider/Hook fix)
export const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: string, collapsible?: string, open?: boolean, onOpenChange?: (open: boolean) => void }>(
  ({ className, children, variant, collapsible, open: controlledOpen, onOpenChange, ...props }, ref) => {
    const { isMobile, openMobile, open: contextOpen, isCollapsed } = useSidebar();
    const currentOpen = controlledOpen !== undefined ? controlledOpen : (isMobile ? openMobile : contextOpen);
    
    return (
      <aside
        ref={ref}
        className={cn("minimal-sidebar transition-all duration-300 ease-in-out", className, {
            // Example: "md:w-64": currentOpen && !isCollapsed && !isMobile,
            // "md:w-20": isCollapsed && !isMobile,
            // "w-64": currentOpen && isMobile, // Mobile open width
            // "w-0 hidden": !currentOpen && isMobile, // Mobile closed
        })}
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
  ({ className, children, ...props }, ref) => <header ref={ref} className={cn("minimal-sidebar-header group", className)} {...props}>{children}</header>
);
SidebarHeader.displayName = "SidebarHeader";

export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => <div ref={ref} className={cn("minimal-sidebar-content", className)} {...props}>{children}</div>
);
SidebarContent.displayName = "SidebarContent";

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => <footer ref={ref} className={cn("minimal-sidebar-footer group", className)} {...props}>{children}</footer>
);
SidebarFooter.displayName = "SidebarFooter";


export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, children, asChild = false, ...props }, ref) => {
  if (asChild) {
    return (
      <Slot ref={ref} {...props}>
        {children}
      </Slot>
    );
  }
  return (
    <button
      ref={ref}
      className={cn("minimal-sidebar-trigger", className)}
      {...props}
    >
      {children || "Trigger"}
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";


export const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, children, ...props }, ref) => <ul ref={ref} className={cn("minimal-sidebar-menu", className)} {...props}>{children}</ul>
);
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, children, ...props }, ref) => <li ref={ref} className={cn("minimal-sidebar-menu-item", className)} {...props}>{children}</li>
);
SidebarMenuItem.displayName = "SidebarMenuItem";


export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement, // Can be HTMLAnchorElement if asChild points to Link
  React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement> & { // Broaden type for props
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string;
  }
>(({ className, children, asChild = false, isActive, tooltip, ...buttonProps }, ref) => {
  const Comp = asChild ? Slot : "button";
  
  const { 
    asChild: _asChild, 
    isActive: _isActive, 
    tooltip: _tooltip, 
    ...domProps 
  } = buttonProps as any;

  const finalProps = Comp === 'button' ? domProps : buttonProps;

  return (
    <Comp
      ref={ref}
      className={cn("minimal-sidebar-menu-button w-full flex items-center justify-start group-data-[collapsible=icon]:justify-center text-sm px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", 
        className, {
        'bg-sidebar-accent text-sidebar-accent-foreground': isActive,
      })}
      title={tooltip}
      {...finalProps}
    >
      {children}
    </Comp>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";


export const SidebarMenuBadge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => <div ref={ref} className={cn("minimal-sidebar-menu-badge ml-auto group-data-[collapsible=icon]:hidden", className)} {...props}>{children}</div>
);
SidebarMenuBadge.displayName = "SidebarMenuBadge";

export const SidebarSeparator = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => <hr ref={ref} className={cn("minimal-sidebar-separator my-2 border-sidebar-border", className)} {...props} />
);
SidebarSeparator.displayName = "SidebarSeparator";

export const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => <main ref={ref} className={cn("minimal-sidebar-inset md:pl-[var(--sidebar-width,0px)] transition-[padding-left]", className)} {...props}>{children}</main>
);
SidebarInset.displayName = "SidebarInset";


// Stubs for other potentially exported components if they were in the original file
// and are not already covered. These are minimal and may need adjustment
// if they have specific props like 'asChild'.

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

export const SidebarMenuSubButton = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>( // Assuming it's an anchor
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

export { _SidebarContext as ActualSidebarContext }; // Exporting for potential use elsewhere if needed

