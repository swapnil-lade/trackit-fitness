
"use client";
import React, { type ReactNode } from 'react';
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

// --- Minimal SidebarProvider ---
// SidebarProvider is currently removed from layout.tsx for debugging,
// but we keep its definition here in case it's restored later.
export const SidebarProvider = ({ children, defaultOpen }: { children: ReactNode, defaultOpen?: boolean }) => {
  return <div data-testid="sidebar-provider">{children}</div>;
};
SidebarProvider.displayName = "SidebarProvider";

// --- Minimal Stubs for other imported components ---
export const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: string, collapsible?: string }>(
  ({ className, children, ...props }, ref) => <aside ref={ref} className={cn("minimal-sidebar", className)} {...props}>{children}</aside>
);
Sidebar.displayName = "Sidebar";

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => <header ref={ref} className={cn("minimal-sidebar-header", className)} {...props}>{children}</header>
);
SidebarHeader.displayName = "SidebarHeader";

export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => <div ref={ref} className={cn("minimal-sidebar-content", className)} {...props}>{children}</div>
);
SidebarContent.displayName = "SidebarContent";

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => <footer ref={ref} className={cn("minimal-sidebar-footer", className)} {...props}>{children}</footer>
);
SidebarFooter.displayName = "SidebarFooter";

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, children, asChild = false, ...props }, ref) => {
  if (asChild) {
    // When asChild is true, props (including any className passed to SidebarTrigger)
    // are passed to Slot, which forwards them to the child.
    // We don't apply "minimal-sidebar-trigger" directly to Slot.
    return (
      <Slot ref={ref} {...props}>
        {children}
      </Slot>
    );
  }

  // When asChild is false, render a button and apply our specific classes
  // merged with any className passed to SidebarTrigger.
  return (
    <button
      ref={ref}
      className={cn("minimal-sidebar-trigger", className)}
      {...props}
    >
      {children || "Trigger"} {/* Default content if no children and not asChild */}
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
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string;
  }
>(({ className, children, asChild = false, isActive, tooltip, ...buttonProps }, ref) => {
  const Comp = asChild ? Slot : "button";
  // Remove custom props not meant for the DOM element if Comp is 'button'
  const { 
    asChild: _asChild, 
    isActive: _isActive, 
    tooltip: _tooltip, 
    ...restButtonProps 
  } = buttonProps as any;

  const domProps = Comp === 'button' ? restButtonProps : buttonProps;


  return (
    <Comp
      ref={ref}
      className={cn("minimal-sidebar-menu-button", className, {
        // 'bg-accent text-accent-foreground': isActive, // Example for conditional styling
      })}
      title={tooltip} // Use tooltip for the standard HTML title attribute
      {...domProps}
    >
      {children}
    </Comp>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

export const SidebarMenuBadge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => <div ref={ref} className={cn("minimal-sidebar-menu-badge", className)} {...props}>{children}</div>
);
SidebarMenuBadge.displayName = "SidebarMenuBadge";

export const SidebarSeparator = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => <hr ref={ref} className={cn("minimal-sidebar-separator my-2 border-sidebar-border", className)} {...props} />
);
SidebarSeparator.displayName = "SidebarSeparator";

export const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => <main ref={ref} className={cn("minimal-sidebar-inset", className)} {...props}>{children}</main>
);
SidebarInset.displayName = "SidebarInset";

// Stubs for other potentially exported components if they were in the original file
// and are not already covered. These are minimal and may need adjustment
// if they have specific props like 'asChild'.

export const useSidebar = () => {
  return {
    state: "expanded", // "expanded" | "collapsed"
    open: true,
    setOpen: () => {},
    openMobile: false,
    setOpenMobile: () => {},
    isMobile: false,
    toggleSidebar: () => {},
  };
};

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
