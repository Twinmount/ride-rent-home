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

import { PriceRangeSlider } from "@/components/ui/prince-range-slider";
import Link from "next/link";
import { convertToLabel, generateListingUrl } from "@/helpers";
import { SlidersHorizontal } from "lucide-react";

const rentalPeriods = [
  { label: "All", value: "all" },
  { label: "Hourly", value: "hour" },
  { label: "Daily", value: "day" },
  { label: "Weekly", value: "week" },
  { label: "Monthly", value: "month" },
];

type PeriodType = "all" | "hour" | "day" | "week" | "month";

export default function PriceFilterDialog() {
  const { state, category } = useStateAndCategory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("all");
  const [values, setValues] = useState([0, 100]);

  const { data, isLoading } = useQuery({
    queryKey: ["priceRange", state, category],
    queryFn: () => fetchPriceRange(state, category),
    enabled: !!state && !!category,
  });

  useEffect(() => {
    if (data && selectedPeriod) {
      // Update slider values to match the selected period's range
      setValues([data[selectedPeriod].min, data[selectedPeriod].max]);
    }
  }, [data, selectedPeriod]);

  if (isLoading)
    return (
      <div
        className={`flex-center relative bottom-2 h-12 cursor-default gap-2 rounded-[0.5em] border border-gray-300 px-3 py-1 text-sm font-semibold text-gray-500`}
      >
        <SlidersHorizontal width={15} />
        Price
      </div>
    );

  if (!data) return null;

  const dynamicUrl = generateListingUrl(values, state, category);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger
        disabled={isLoading || !data}
        className={`flex-center relative bottom-2 h-12 gap-2 rounded-[0.5em] border border-gray-300 px-3 py-1 text-sm font-semibold ${isLoading && "cursor-default text-gray-500"}`}
      >
        <SlidersHorizontal width={15} />
        Price
      </DialogTrigger>
      <DialogContent className="!max-h-fit !w-[80vw] overflow-hidden rounded-2xl bg-white !px-2 py-4">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">
            Select Price Range for <span>{convertToLabel(category)}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Rental Period Selection */}
        <div className="flex justify-center gap-2 px-4 py-2">
          {rentalPeriods.map((period) => (
            <div
              key={period.value}
              onClick={() => setSelectedPeriod(period.value as PeriodType)}
              className={`cursor-pointer rounded-[0.4rem] px-3 py-1 text-sm ${
                selectedPeriod === period.value
                  ? "bg-yellow text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {period.label}
            </div>
          ))}
        </div>

        {/* Price Range Slider */}
        <div className="mt-4 w-full px-10">
          <PriceRangeSlider
            value={values}
            onValueChange={setValues}
            min={data[selectedPeriod].min}
            max={data[selectedPeriod].max}
            step={10} // Example step value
          />
        </div>

        {/* Minimum and Maximum Price */}
        <div className="flex justify-between px-10 py-4">
          <div className="flex-center w-fit flex-col gap-y-1 text-gray-600">
            <span className="text-sm font-normal">Minimum </span>
            <span className="flex-center flex-center w-28 rounded-2xl border border-slate-300 py-2 font-medium">
              AED {values[0]}
            </span>
          </div>
          <div className="flex-center w-fit flex-col gap-y-1 text-gray-600">
            <span className="text-sm font-normal">Maximum </span>
            <span className="flex-center flex-center w-28 rounded-2xl border border-slate-300 py-2 font-medium">
              AED {values[1]}
            </span>
          </div>
        </div>

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
