"use client";

import React, { useEffect, useRef, useState } from "react";

import Filter from "./Filter";
import { motion } from "framer-motion";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import useElementVisibility from "@/hooks/useElementVisibility";

export const FilterSidebar = () => {
  const [open, setOpen] = useState(false);
  const isVisible = useElementVisibility("footer", 0.1);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
          transition={{ duration: 0.3 }}
          className={`flex-center border-gray-6=300 bottom-20 right-8 z-30 h-10 cursor-pointer gap-2 rounded-[0.5em] border bg-yellow px-3 py-1 text-sm font-semibold text-white max-md:fixed ${isVisible && "hidden"}`}
        >
          <SlidersHorizontal width={15} />
          Filter
        </motion.span>
      </SheetTrigger>

      <SheetContent side={"right"} className="bg w-80 bg-white">
        <SheetHeader>
          <SheetTitle className="custom-heading text-left text-2xl">
            Filter
          </SheetTitle>
        </SheetHeader>

        {/* Filter Component */}
        <Filter setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
};
