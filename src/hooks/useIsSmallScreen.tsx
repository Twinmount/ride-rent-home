"use client";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

const useIsSmallScreen = (breakpoint = 768) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const pathname = usePathname();

  // Wrap the checkScreenSize function in useCallback to ensure stability
  const checkScreenSize = useCallback(() => {
    setIsSmallScreen(window.innerWidth < breakpoint);
  }, [breakpoint]);

  useEffect(() => {
    // Initial check for screen size
    if (typeof window !== "undefined") {
      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
    }

    // Re-check screen size on pathname change
    checkScreenSize();

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", checkScreenSize);
      }
    };
  }, [breakpoint, pathname, checkScreenSize]);

  return isSmallScreen;
};

export default useIsSmallScreen;
