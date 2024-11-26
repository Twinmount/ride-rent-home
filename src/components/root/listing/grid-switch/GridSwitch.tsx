"use client";

import "./GridSwitch.scss";
import { IoGridOutline, IoList } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/helpers";
import { useEffect, useCallback } from "react";
import useIsSmallScreen from "@/hooks/useIsSmallScreen"; // import your custom hook

type GridSwitchProps = {
  isGridView: boolean;
};

const GridSwitch = ({ isGridView }: GridSwitchProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSmallScreen = useIsSmallScreen(850); // adjust the breakpoint as needed

  // Memoize the updateUrlView function to prevent redefinition on each render
  const updateUrlView = useCallback(
    (view: "grid" | "list") => {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "view",
        value: view,
      });
      router.push(newUrl, { scroll: false });
    },
    [searchParams, router]
  );

  useEffect(() => {
    const currentView = searchParams.get("view");

    // If on a small screen, set view to "grid" if not already set
    if (isSmallScreen && currentView !== "grid") {
      updateUrlView("grid");
    }
    // Otherwise, set to the initial view (grid or list based on isGridView)
    else if (!isSmallScreen && currentView !== (isGridView ? "grid" : "list")) {
      updateUrlView(isGridView ? "grid" : "list");
    }
  }, [isGridView, searchParams, router, isSmallScreen, updateUrlView]);

  // Handle view change when button is clicked, only if screen is not small
  const handleViewChange = (view: "grid" | "list") => {
    if (!isSmallScreen) {
      updateUrlView(view);
    }
  };

  return (
    <div className="grid-style">
      <button
        className={`icon-container ${isGridView ? "selected" : ""}`}
        aria-label="Switch to grid view"
        onClick={() => handleViewChange("grid")}
      >
        <IoGridOutline className="icon" />
      </button>
      <button
        className={`icon-container ${!isGridView ? "selected" : ""}`}
        aria-label="Switch to list view"
        onClick={() => handleViewChange("list")}
        disabled={isSmallScreen} // disable button if on small screen
      >
        <IoList className="icon" />
      </button>
    </div>
  );
};

export default GridSwitch;
