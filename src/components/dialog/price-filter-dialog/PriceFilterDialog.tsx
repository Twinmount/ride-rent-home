"use client";

import { useEffect, useState } from "react";
import { fetchPriceRange } from "@/lib/api/general-api";
import { useQuery } from "@tanstack/react-query";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";

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
import PriceFilterLoadingSkelton from "./PriceFilterSkelton";
import PriceDialogTrigger from "./PriceDialogTrigger";
import RentalPeriod from "./RentalPeriod";
import MinAndMaxPrice from "./MinAndMaxPrice";

type PeriodType = "hour" | "day" | "week" | "month";

export default function PriceFilterDialog({
  isMobileNav = false,
}: {
  isMobileNav?: boolean;
}) {
  const { state, category } = useStateAndCategory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("hour");
  const [values, setValues] = useState([0, 100]);

  // Fetch price range using useQuery
  const { data, isLoading } = useQuery({
    queryKey: ["priceRange", state, category],
    queryFn: () => fetchPriceRange({ state, category }),
    enabled: !!state && !!category,
  });

  // Set the initial values based on the selected period
  useEffect(() => {
    if (data?.result && selectedPeriod) {
      setValues([
        data.result[selectedPeriod].min,
        data.result[selectedPeriod].max,
      ]);
    }
  }, [data, selectedPeriod]);

  // loading skelton
  if (isLoading) return <PriceFilterLoadingSkelton isMobileNav={isMobileNav} />;

  if (!data) return null;

  const dynamicUrl = generateListingUrl(
    values,
    state,
    category,
    selectedPeriod,
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger disabled={isLoading || !data}>
        {/* price filter trigger component for mobile nav and home page */}
        <PriceDialogTrigger isMobileNav={isMobileNav} isLoading={isLoading} />
      </DialogTrigger>
      <DialogContent className="!max-h-fit !w-[80vw] overflow-hidden rounded-2xl bg-white !px-2 py-4">
        <DialogHeader>
          <DialogTitle className="text-center text-lg text-gray-700">
            Filter Price Range for{" "}
            <span className="font-semibold text-black">
              {convertToLabel(category)}
            </span>{" "}
            in{" "}
            <span className="font-semibold text-black">
              {convertToLabel(state)}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Rental Period Selection */}
        <RentalPeriod
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />

        {/* Price Range Slider */}
        <div className="mt-4 w-full px-10">
          <PriceRangeSlider
            value={values}
            onValueChange={setValues}
            min={data.result[selectedPeriod].min}
            max={data.result[selectedPeriod].max}
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
