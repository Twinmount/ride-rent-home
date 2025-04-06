"use client";
import React, { useState } from "react";
import { RentalDetails } from "@/types/vehicle-details-types";
import { Tag } from "lucide-react";
import { IoSpeedometer } from "react-icons/io5";
import { MotionDivElm } from "@/components/general/framer-motion/MotionElm";
import { AnimatePresence } from "framer-motion";
import { usePriceConverter } from "@/hooks/usePriceConverter";

type RentalDetailsTabProps = {
  rentalDetails: RentalDetails;
};

const RentalDetailsTab = ({ rentalDetails }: RentalDetailsTabProps) => {
  // Filter out only the enabled rental periods
  const enabledRentalPeriods = [
    { period: "Hour", details: rentalDetails.hour },
    { period: "Day", details: rentalDetails.day },
    { period: "Week", details: rentalDetails.week },
    { period: "Month", details: rentalDetails.month },
  ].filter((rental) => rental.details.enabled);

  const { convert } = usePriceConverter();

  // Set default selected period (first enabled period)
  const [selectedPeriod, setSelectedPeriod] = useState(enabledRentalPeriods[0]);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const handleTabChange = (rental: (typeof enabledRentalPeriods)[0]) => {
    const currentIndex = enabledRentalPeriods.findIndex(
      (item) => item.period === selectedPeriod.period,
    );
    const nextIndex = enabledRentalPeriods.findIndex(
      (item) => item.period === rental.period,
    );
    setDirection(nextIndex > currentIndex ? 1 : -1); // Determine direction
    setSelectedPeriod(rental);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    }),
  };

  if (!selectedPeriod) {
    return <div>Loading...</div>;
  }
  return (
    <div className="mx-auto mt-3 w-full max-w-md rounded-xl border bg-white p-4 shadow">
      {/* Tabs */}
      <div className="mb-4 flex flex-col border-b border-gray-200">
        <div className="flex gap-2 text-gray-600">
          <Tag className="text-gray-600" width={15} /> Pricing
        </div>
        <div className="flex items-center justify-evenly">
          {enabledRentalPeriods.map((rental, index) => (
            <button
              key={index}
              className={`flex-1 py-2 text-center font-semibold ${
                selectedPeriod.period === rental.period
                  ? "border-b-2 border-orange text-orange"
                  : "text-gray-600"
              }`}
              onClick={() => handleTabChange(rental)}
            >
              {rental.period === "Hour" && "Hourly"}
              {rental.period === "Day" && "Daily"}
              {rental.period === "Week" && "Weekly"}
              {rental.period === "Month" && "Monthly"}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on selected period */}
      <div className="h-auto max-h-[145px] min-h-[6rem] overflow-y-auto overflow-x-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <MotionDivElm
            key={selectedPeriod.period}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="inset-0 space-y-4"
          >
            <div className="flex items-center justify-between rounded-[0.5rem] bg-[#2c2c2c] px-2 py-1">
              <span className="flex items-center justify-start gap-x-1 font-medium text-slate-200">
                <IoSpeedometer className="mb-1" /> Rental Rate:
              </span>
              <span className="text-lg font-bold text-yellow">
                {selectedPeriod.period === "Hour" &&
                "minBookingHours" in selectedPeriod.details
                  ? `${convert(Number(selectedPeriod.details.rentInAED), "prefix")} / ${selectedPeriod.details.minBookingHours} Hrs`
                  : `${convert(Number(selectedPeriod.details.rentInAED), "prefix")}`}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-[0.5rem] bg-[#2c2c2c] px-2 py-1">
              <span className="flex items-center justify-start gap-x-1 font-medium text-slate-200">
                <IoSpeedometer className="mb-1" />
                Included Mileage Limit:
              </span>
              <span className="text-lg font-bold text-yellow">
                {`${selectedPeriod.details.mileageLimit} Km`}
              </span>
            </div>
          </MotionDivElm>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RentalDetailsTab;
