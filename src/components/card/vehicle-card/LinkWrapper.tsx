'use client';

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useGlobalContext } from "@/context/GlobalContext";

interface LinkWrapperProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  newTab?: boolean;
  onClick?: (e: React.MouseEvent) => void;
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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
      if (e.defaultPrevented) {
        return;
      }
    }

    if (newTab) {
      return;
    }

    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) {
      return;
    }

    // Only set loading if navigating to different page
    if (currentPath !== href) {
      setIsPageLoading(true);
    }
  };

  useEffect(() => {
    if (previousPathRef.current !== currentPath) {
      setIsPageLoading(false);
      previousPathRef.current = currentPath;
    }

    const safetyTimer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2500);

    return () => {
      clearTimeout(safetyTimer);
    };
  }, [currentPath, setIsPageLoading]);

  return (
    <Link
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      onClick={handleClick}
      className={className}
    >
      {children}
    </Link>
  );
};

export default LinkWrapper;
