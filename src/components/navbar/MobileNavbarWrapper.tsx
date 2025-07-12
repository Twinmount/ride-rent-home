"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

export default function MobileNavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHidden, setIsHidden] = useState(false);

  const { scrollY } = useScroll();

  // logic to determine to show or hide the navbar based on the scroll position
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setIsHidden(true); // Navbar hides
    } else {
      setIsHidden(false); // Navbar shows
    }
  });
  return (
    <motion.div
      variants={{
        visible: { y: 0 }, // Navbar is fully visible
        hidden: { y: "115%" }, // Navbar moves completely out of view
      }}
      animate={isHidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "linear" }}
      // hidden on small devices and above.
      className={`fixed bottom-2 left-2 right-2 z-50 flex h-[4rem] flex-col items-center justify-center gap-y-5 rounded-xl border border-t border-gray-200 bg-white shadow-md shadow-black/30 transition-all duration-200 ease-in-out sm:hidden`}
      role="navigation"
    >
      {children}
    </motion.div>
  );
}
