"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { useGlobalContext } from "@/context/GlobalContext";

interface LinkWrapperProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const LinkWrapper = ({ children, href, className }: LinkWrapperProps) => {
  const { setIsPageLoading } = useGlobalContext();

  const currentPath = usePathname(); // Get the current route

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If it's a modified click (Ctrl, Cmd, Shift, Alt, Middle-click), do nothing
    if (
      e.metaKey || // Cmd on Mac
      e.ctrlKey || // Ctrl on Windows/Linux
      e.shiftKey ||
      e.altKey ||
      e.button === 1 // Middle-click
    ) {
      return;
    }
  
    setIsPageLoading(true);
  };
  

  useEffect(() => {
    // Reset loading state ONLY if the new route starts with the href
    if (currentPath.startsWith(href)) {
      setIsPageLoading(false);
    }

    return () => {
      setIsPageLoading(false); // Ensure it resets when unmounting
    };
  }, [currentPath, href]); // Runs when the route changes

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};

export default LinkWrapper;
