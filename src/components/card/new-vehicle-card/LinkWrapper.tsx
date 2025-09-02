'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { useGlobalContext } from '@/context/GlobalContext';

interface LinkWrapperProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  newTab?: boolean;
}

const LinkWrapper = ({
  children,
  href,
  className,
  newTab = false,
}: LinkWrapperProps) => {
  const { setIsPageLoading } = useGlobalContext();

  const currentPath = usePathname(); // Get the current route

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Skip global loading if opening in a new tab
    if (newTab) {
      return;
    }

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
    if (newTab) return;

    // Reset loading state ONLY if the new route starts with the href
    if (currentPath.startsWith(href)) {
      setIsPageLoading(false);
    }

    return () => {
      setIsPageLoading(false); // Ensure it resets when unmounting
    };
  }, [currentPath, href]); // Runs when the route changes

  return (
    <Link
      href={href}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      className={className}
    >
      {children}
    </Link>
  );
};

export default LinkWrapper;
