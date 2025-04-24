"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PriceRangeSlider } from "@/components/ui/price-range-slider";
import Link from "next/link";
import { generateListingUrl } from "@/helpers";
import PriceDialogTrigger from "./PriceDialogTrigger";
import RentalPeriod from "./RentalPeriod";
import MinAndMaxPrice from "./MinAndMaxPrice";
import PriceFilterLoadingSkelton from "./PriceFilterSkelton";
import { usePriceFilter } from "./usePriceFilter";
import useElementVisibility from "@/hooks/useElementVisibility";

export default function PriceFilterDialog({
  isMobileNav = false,
  isListingPage = false,
}: {
  isMobileNav?: boolean;
  isListingPage?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const isVisible = useElementVisibility("footer", 0.5);

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

  const handleApply = () => {
    setIsNavigating(true);
    router.push(dynamicUrl);
  };

  // 💡 Effect to watch for route change completion
  useEffect(() => {
    const currentUrl = `${pathname}?${searchParams.toString()}`;

    if (decodeURIComponent(currentUrl) === decodeURIComponent(dynamicUrl)) {
      setIsNavigating(false);
      setIsDialogOpen(false);
    }
  }, [pathname, searchParams, dynamicUrl]);

  if (isLoading) {
    return <PriceFilterLoadingSkelton isMobileNav={isMobileNav} />;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger disabled={isPriceRangeEmpty || isLoading}>
        {isVisible && (
          <PriceDialogTrigger
            isMobileNav={isMobileNav}
            isLoading={isLoading}
            isDisabled={isPriceRangeEmpty}
          />
        )}
      </DialogTrigger>

      <DialogContent className="!max-h-fit !w-[80vw] overflow-hidden rounded-2xl bg-white !px-2 py-4">
        <DialogHeader>
          <DialogTitle className="text-center text-lg text-gray-700">
            Find one that fits your budget
          </DialogTitle>
        </DialogHeader>

        {availablePeriods.length > 0 && (
          <RentalPeriod
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            availablePeriods={availablePeriods}
          />
        )}

        <div className="mt-4 w-full px-10">
          <PriceRangeSlider
            value={values}
            onValueChange={setValues}
            min={selectedPriceRange.min}
            max={selectedPriceRange.max}
            step={10}
          />
        </div>

        <MinAndMaxPrice min={values[0]} max={values[1]} />

        {isListingPage ? (
          <button
            onClick={handleApply}
            disabled={isNavigating}
            className="flex-center mx-auto w-4/5 rounded-xl bg-yellow/90 px-6 py-2 font-semibold text-white transition-colors hover:bg-yellow"
          >
            {isNavigating ? "Applying..." : "Apply Filter"}
          </button>
        ) : (
          <Link href={dynamicUrl} className="mx-auto w-4/5">
            <span className="flex-center rounded-xl bg-yellow/90 px-6 py-2 font-semibold text-white transition-colors hover:bg-yellow">
              Apply Filter
            </span>
          </Link>
        )}
      </DialogContent>
    </Dialog>
  );
}
