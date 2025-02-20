"use client";

import { usePathname } from "next/navigation";

export default function useIsHomePage() {
  const pathname = usePathname();

  // Check if the page is the home/landing page
  const isHomePage = /^\/[^/]+\/[^/]+$/.test(pathname);

  return isHomePage;
}
