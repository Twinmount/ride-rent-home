"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const useIsSmallScreen = (breakpoint = 768) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const pathname = usePathname();

  const checkScreenSize = () => {
    setIsSmallScreen(window.innerWidth < breakpoint);
  };

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
  }, [breakpoint, pathname]);

  return isSmallScreen;
};

export default useIsSmallScreen;
