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

  const handleClick = () => {
    setIsPageLoading(true);
  };

  useEffect(() => {
    // Reset loading state ONLY if the new route starts with the href
    if (currentPath.startsWith(href)) {
      setIsPageLoading(false);
    }
  }, [currentPath, href]); // Runs when the route changes

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};

export default LinkWrapper;
