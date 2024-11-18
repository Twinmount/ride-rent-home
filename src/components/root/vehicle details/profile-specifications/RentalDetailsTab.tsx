import React, { useState } from "react";
import { RentalDetails } from "@/types/vehicle-details-types";
import { Tag } from "lucide-react";
import { IoSpeedometer } from "react-icons/io5";

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

  // Set default selected period (first enabled period)
  const [selectedPeriod, setSelectedPeriod] = useState(enabledRentalPeriods[0]);

  return (
    <div className="w-full max-w-md mx-auto p-4 border rounded-xl shadow bg-white mt-3">
      {/* Tabs */}
      <div className="flex flex-col border-b border-gray-200 mb-4">
        <div className="flex text-gray-600 gap-2">
          <Tag className="text-gray-600" width={15} /> Pricing
        </div>
        <div className="flex items-center justify-evenly">
          {enabledRentalPeriods.map((rental, index) => (
            <button
              key={index}
              className={`flex-1 py-2 text-center font-semibold ${
                selectedPeriod.period === rental.period
                  ? "text-orange border-b-2 border-orange"
                  : "text-gray-600"
              }`}
              onClick={() => setSelectedPeriod(rental)}
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
      <div className="space-y-4">
        <div className="flex justify-between items-center rounded-[0.5rem] px-2 py-1 bg-[#2c2c2c] ">
          <span className="text-slate-200 font-medium flex items-center justify-start gap-x-1">
            <IoSpeedometer className="mb-1" /> Rental Rate:
          </span>
          <span className="text-lg font-bold text-yellow">
            {selectedPeriod.period === "Hour" &&
            "minBookingHours" in selectedPeriod.details
              ? `AED ${selectedPeriod.details.rentInAED} / ${selectedPeriod.details.minBookingHours} Hrs`
              : `AED ${selectedPeriod.details.rentInAED}`}
          </span>
        </div>

        <div className="flex justify-between items-center rounded-[0.5rem] px-2  py-1 bg-[#2c2c2c]">
          <span className="text-slate-200 font-medium flex items-center justify-start gap-x-1">
            <IoSpeedometer className="mb-1" />
            Included Mileage Limit:
          </span>
          <span className="text-lg font-bold text-yellow">
            {`${selectedPeriod.details.mileageLimit} Km`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RentalDetailsTab;
