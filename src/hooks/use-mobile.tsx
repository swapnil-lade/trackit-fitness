
"use client";

import * as React from "react"

const MOBILE_BREAKPOINT = 768 // md breakpoint in Tailwind

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false) // Default to false or undefined

  React.useEffect(() => {
    // Ensure window is defined (client-side)
    if (typeof window === 'undefined') {
      return;
    }

    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Initial check
    checkDevice()

    // Listener for window resize
    window.addEventListener("resize", checkDevice)

    // Cleanup listener
    return () => {
      window.removeEventListener("resize", checkDevice)
    }
  }, []) // Empty dependency array ensures this runs once on mount and cleanup on unmount

  return isMobile;
}
