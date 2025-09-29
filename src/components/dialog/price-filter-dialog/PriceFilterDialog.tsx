'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PriceRangeSlider } from '@/components/ui/price-range-slider';
import Link from 'next/link';
import { generateListingUrl } from '@/helpers';
import PriceDialogTrigger from './PriceDialogTrigger';
import RentalPeriod from './RentalPeriod';
import MinAndMaxPrice from './MinAndMaxPrice';
import PriceFilterLoadingSkelton from './PriceFilterSkelton';
import { usePriceFilter } from './usePriceFilter';
import useElementVisibility from '@/hooks/useElementVisibility';

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
  const isVisible = useElementVisibility('footer', 0.5);

  const {
    state,
    category,
    country,
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
    category ? category : 'cars',
    country,
    selectedPeriod
  );

  const handleApply = () => {
    setIsNavigating(true);
    router.push(dynamicUrl);
  };

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
      <DialogTrigger
        disabled={isPriceRangeEmpty || isLoading}
        className="me-0 max-sm:hidden md:me-2"
        aria-label="Open price filter dialog"
        style={{ minWidth: "100px", minHeight: "40px" }}
      >
        {isVisible && (
          <PriceDialogTrigger
            isMobileNav={isMobileNav}
            isLoading={isLoading}
            isDisabled={isPriceRangeEmpty}
          />
        )}
      </DialogTrigger>

      <DialogContent
        className="!max-h-fit !w-[80vw] overflow-hidden rounded-2xl bg-white !px-2 py-4"
        style={{ minHeight: "400px" }}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg text-gray-700">
            Find one that fits your budget
          </DialogTitle>
        </DialogHeader>

        <div
          style={{ minHeight: availablePeriods.length > 0 ? "60px" : "0px" }}
        >
          {availablePeriods.length > 0 && (
            <RentalPeriod
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
              availablePeriods={availablePeriods}
            />
          )}
        </div>

        <div className="mt-4 w-full px-10" style={{ minHeight: "60px" }}>
          <PriceRangeSlider
            value={values}
            onValueChange={setValues}
            min={selectedPriceRange.min}
            max={selectedPriceRange.max}
            step={10}
          />
        </div>

        <div style={{ minHeight: "80px" }}>
          <MinAndMaxPrice
            min={values[0]}
            max={values[1]}
            onValueChange={setValues}
            priceRangeMin={selectedPriceRange.min}
            priceRangeMax={selectedPriceRange.max}
          />
        </div>

        <div
          style={{
            minHeight: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isListingPage ? (
            <button
              onClick={handleApply}
              disabled={isNavigating}
              className="flex-center mx-auto min-h-[44px] w-4/5 min-w-[44px] rounded-xl bg-yellow/90 px-6 py-2 font-semibold text-white transition-colors hover:bg-yellow focus:outline-none focus:ring-2 focus:ring-yellow focus:ring-offset-2"
              aria-label={
                isNavigating ? "Applying price filter" : "Apply price filter"
              }
              style={{ minWidth: "160px" }}
            >
              {isNavigating ? "Applying..." : "Apply Filter"}
            </button>
          ) : (
            <Link
              href={dynamicUrl}
              className="mx-auto w-4/5"
              aria-label="Apply price filter and view results"
              style={{ minWidth: "160px" }}
            >
              <span className="flex-center min-h-[44px] min-w-[44px] rounded-xl bg-yellow/90 px-6 py-2 font-semibold text-white transition-colors hover:bg-yellow focus:outline-none focus:ring-2 focus:ring-yellow focus:ring-offset-2">
                Apply Filter
              </span>
            </Link>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
