"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useGlobalContext } from "@/context/GlobalContext";

interface LinkWrapperProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  newTab?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const LinkWrapper = ({
  children,
  href,
  className,
  newTab = false,
  onClick,
}: LinkWrapperProps) => {
  const { setIsPageLoading } = useGlobalContext();
  const currentPath = usePathname();
  const previousPathRef = useRef(currentPath);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const renderDelayRef = useRef<NodeJS.Timeout | null>(null);

  // Handle link click
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>): void => {
      // Allow custom onClick to run first
      if (onClick) {
        onClick(e);
        if (e.defaultPrevented) return;
      }

      // Don't show loading for new tabs
      if (newTab) return;

      // Don't show loading for modified clicks (new tab shortcuts)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) {
        return;
      }

      // Only show loading when navigating to a different page
      if (currentPath !== href) {
        setIsPageLoading(true);

        // Clear any existing timers
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
        if (renderDelayRef.current) {
          clearTimeout(renderDelayRef.current);
        }

        // Safety timeout: force clear loading if navigation takes too long
        loadingTimeoutRef.current = setTimeout(() => {
          setIsPageLoading(false);
          loadingTimeoutRef.current = null;
        }, 5000);
      }
    },
    [onClick, newTab, currentPath, href, setIsPageLoading]
  );

  // Handle path changes (navigation complete)
  useEffect(() => {
    if (previousPathRef.current !== currentPath) {
      previousPathRef.current = currentPath;

      // Clear safety timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }

      // Clear any existing render delay
      if (renderDelayRef.current) {
        clearTimeout(renderDelayRef.current);
      }

      // Delay to ensure content is fully rendered
      renderDelayRef.current = setTimeout(() => {
        setIsPageLoading(false);
        renderDelayRef.current = null;
      }, 1000);
    }
  }, [currentPath, setIsPageLoading]);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      if (renderDelayRef.current) {
        clearTimeout(renderDelayRef.current);
        renderDelayRef.current = null;
      }
      // Force clear loading state on unmount
      setIsPageLoading(false);
    };
  }, [setIsPageLoading]);

  return (
    <Link
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      onClick={handleClick}
      className={className}
      prefetch={true}
      scroll={true}
    >
      {children}
    </Link>
  );
};

export default LinkWrapper;
