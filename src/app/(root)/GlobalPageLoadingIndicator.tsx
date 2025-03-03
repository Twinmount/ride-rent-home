"use client";

import LazyLoad from "@/components/skelton/LazyLoad";
import { useGlobalContext } from "@/context/GlobalContext";

export default function GlobalPageLoadingIndicator() {
  const { isPageLoading } = useGlobalContext();

  if (!isPageLoading) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 top-16 z-50 bg-white">
      <LazyLoad />
    </div>
  );
}
