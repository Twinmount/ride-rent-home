"use client";

import {
  useMotionValueEvent,
  useScroll,
  motion,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function MobileProfileCardWrapper({
  children,
  isExpanded,
  setIsExpanded,
  className = "",
  style = {},
  motionProps = {},
}: {
  children: React.ReactNode;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  style?: React.CSSProperties;
  motionProps?: any;
}) {
  // State for navbar visibility
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const { scrollY } = useScroll();

  // State for checking small screen (<= 640px)
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Track content height for expansion
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("9rem"); // Default height

  // Handle scroll event (Only on small screens)
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!isSmallScreen) return;

    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setIsNavbarHidden(true);
    } else {
      setIsNavbarHidden(false);
    }
  });

  // Detect screen size changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };

    checkScreenSize(); // Initial check
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Adjust height when expanded
  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      setHeight(isExpanded ? `${content.scrollHeight}px` : "9rem");
    }
  }, [isExpanded]);

  // Close when mouse leaves
  const handleMouseLeave = () => {
    if (!isExpanded || isSmallScreen) return;
    setTimeout(() => {
      setIsExpanded(false);
    }, 200);
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={contentRef}
        onMouseLeave={handleMouseLeave}
        className={`mobile-profile-card ${isExpanded ? "expanded-view" : ""} ${className}`}
        style={{
          height: height,
          bottom: isSmallScreen
            ? isNavbarHidden
              ? "0.5rem"
              : "5rem"
            : "0.5rem",
          ...style,
        }}
        animate={{
          opacity: 1, // Added opacity
          ...(isSmallScreen
            ? { bottom: isNavbarHidden ? "0.5rem" : "5rem", height }
            : {}),
        }}
        transition={{ duration: 0.3, ease: "linear" }}
        {...motionProps}
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
