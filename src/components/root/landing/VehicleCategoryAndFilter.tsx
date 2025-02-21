"use client";

import VehicleTypesCarousel from "./vehicle-types-carousel/VehicleTypesCarousel";
import VehicleCategories from "./VehicleCategories";
import PriceFilterDialog from "../../dialog/price-filter-dialog/PriceFilterDialog";

export default function VehicleCategoryAndFilter() {
 
  return (
    <div
      className={`sticky z-30 mb-4 flex items-center justify-between bg-lightGray py-2`}
      style={{
        top: "3.9rem",
      }}
    >
      <div
        className={`mx-auto flex w-fit max-w-[98%] items-center justify-center gap-x-4 p-0 sm:pl-4 lg:gap-x-6`}
      >
        {/* vehicle categories menu bar */}
        <VehicleCategories />

        {/* vertical bar */}
        <VerticalBar />

        {/* vehicle types carousel */}
        <VehicleTypesCarousel />

        {/* vertical bar */}
        <VerticalBar className="max-sm:hidden" />

        {/* filter modal */}
        <div className="max-sm:hidden">
          <PriceFilterDialog />
        </div>
      </div>
    </div>
  );
}

// vertical bar component
const VerticalBar = ({ className }: { className?: string }) => (
  <div className={`my-auto h-12 w-[0.1rem] bg-gray-300 lg:h-14 ${className}`} />
);
