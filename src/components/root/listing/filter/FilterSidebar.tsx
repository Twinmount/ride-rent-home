'use client';

import { useState } from 'react';

import ListingFilter from './ListingFilter';
import { motion } from 'framer-motion';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SlidersHorizontal } from 'lucide-react';
import useElementVisibility from '@/hooks/useElementVisibility';
import useFilters from '@/hooks/useFilters';
import ClearIconSVG from './icons/ClearIconSVG';
import FilterOptionsIconSVG from './icons/FilterOptionsIconSVG';

export const FilterSidebar = () => {
  const [open, setOpen] = useState(false);
  const isVisible = useElementVisibility('footer', 0.1);

  const { resetFilters, getAppliedFilterCount } = useFilters();

  const appliedCount = getAppliedFilterCount();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
          transition={{ duration: 0.3 }}
          className={`flex-center h-8 w-24 cursor-pointer gap-2 rounded-[0.5em] border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-secondary max-md:w-20 lg:h-10 lg:w-28 ${isVisible && 'hidden'}`}
        >
          <SlidersHorizontal width={15} />
          <span className="text-sm max-md:hidden"> Filter </span>
          {appliedCount > 0 && (
            <span className="flex-center rounded-xl border border-accent bg-[#FCECD2] px-2 text-accent">
              {appliedCount}
            </span>
          )}
        </motion.span>
      </SheetTrigger>

      <SheetContent
        side={'right'}
        className="w-80 bg-white"
        showCloseButton={false}
      >
        <SheetHeader>
          <SheetTitle className="flex-between border-b pb-4">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="flex-center gap-x-2 text-lg font-medium text-text-tertiary"
            >
              <FilterOptionsIconSVG />
              Filter{' '}
              {appliedCount > 0 && (
                <span className="flex-center rounded-xl border border-accent bg-[#FCECD2] px-3 text-xs text-accent">
                  {appliedCount}
                </span>
              )}
            </button>

            <button
              className="flex-center w-24 gap-x-2 rounded-lg border border-border-default bg-white py-2 text-sm font-medium text-accent"
              onClick={() => {
                resetFilters();
                setTimeout(() => setOpen(false), 300);
              }}
            >
              <ClearIconSVG />
              Clear
            </button>
          </SheetTitle>
        </SheetHeader>

        {/* Filter Component */}
        <ListingFilter setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
};
