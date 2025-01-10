"use client";

import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useParams } from "next/navigation";

import { SearchDialog } from "./SearchDialog";
import PriceFilterDialog from "../root/landing/PriceFilterDialog";
import { User } from "lucide-react";

const MobileNavbar = () => {
  const [isHidden, setIsHidden] = useState(false);
  const params = useParams<{ state: string; category: string }>();

  const state = params.state || "dubai";
  const category = params.category || "cars";

  const { scrollY } = useScroll();

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
        hidden: { y: "100%" }, // Navbar moves completely out of view
      }}
      animate={isHidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "linear" }}
      // make the background light semi transparent small light blur
      className={`global__padding fixed bottom-0 left-0 right-0 z-50 flex h-[4rem] flex-col items-center justify-center gap-y-5 border-t bg-bgGray transition-all duration-200 ease-in-out sm:hidden`}
      role="navigation"
      aria-label="Mobile Actions"
    >
      <div className={`flex-between w-full`}>
        <ul className="flex w-full items-center justify-evenly gap-4">
          <li className="flex-center w-fit flex-col gap-y-1">
            <PriceFilterDialog isMobileNav={true} />
            <span className="text-xs text-gray-600">filter</span>
          </li>

          <li className="flex-center w-fit flex-col gap-y-1">
            <SearchDialog isMobileNav={true} />
            <span className="text-xs text-gray-600">search</span>
          </li>
          <li className="flex-center w-fit flex-col gap-y-1">
            <User />
            <span className="text-xs text-gray-600">account </span>
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default MobileNavbar;
