"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { PriceRangeSlider } from "@/components/ui/price-range-slider";
import Link from "next/link";
import { convertToLabel, generateListingUrl } from "@/helpers";
import PriceDialogTrigger from "./PriceDialogTrigger";
import RentalPeriod from "./RentalPeriod";
import MinAndMaxPrice from "./MinAndMaxPrice";
import PriceFilterLoadingSkelton from "./PriceFilterSkelton";
import { usePriceFilter } from "./usePriceFilter";

export default function PriceFilterDialog({
  isMobileNav = false,
}: {
  isMobileNav?: boolean;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // custom hook
  const {
    state,
    category,
    selectedPeriod,
    setSelectedPeriod,
    values,
    setValues,
    availablePeriods,
    isPriceRangeEmpty,
    isLoading,
    selectedPriceRange,
  } = usePriceFilter();

  const dynamicUrl = generateListingUrl(
    values,
    state,
    category,
    selectedPeriod,
  );

  if (isLoading) {
    return <PriceFilterLoadingSkelton isMobileNav={isMobileNav} />;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger disabled={isPriceRangeEmpty || isLoading}>
        <PriceDialogTrigger
          isMobileNav={isMobileNav}
          isLoading={isLoading}
          isDisabled={isPriceRangeEmpty}
        />
      </DialogTrigger>

      <DialogContent className="!max-h-fit !w-[80vw] overflow-hidden rounded-2xl bg-white !px-2 py-4">
        <DialogHeader>
          <DialogTitle className="text-center text-lg text-gray-700">
            Find one that fits your budget
          </DialogTitle>
        </DialogHeader>

        {/* Rental Period Selection */}
        {availablePeriods.length > 0 && (
          <RentalPeriod
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            availablePeriods={availablePeriods}
          />
        )}

        {/* Price Range Slider */}
        <div className="mt-4 w-full px-10">
          <PriceRangeSlider
            value={values}
            onValueChange={setValues}
            min={selectedPriceRange.min}
            max={selectedPriceRange.max}
            step={10}
          />
        </div>

        {/* Minimum and Maximum Price */}
        <MinAndMaxPrice min={values[0]} max={values[1]} />

        {/* Apply Filter Button */}
        <Link href={dynamicUrl} target="_blank" className="mx-auto w-4/5">
          <span className="flex-center rounded-xl bg-yellow/90 px-6 py-2 font-semibold text-white transition-colors hover:bg-yellow">
            Apply Filter
          </span>
        </Link>
      </DialogContent>
    </Dialog>
  );
}
