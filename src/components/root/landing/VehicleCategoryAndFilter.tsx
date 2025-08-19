"use client";

import VehicleTypesCarousel from "./vehicle-types-carousel/VehicleTypesCarousel";
import VehicleCategories from "./VehicleCategories";
import PriceFilterDialog from "../../dialog/price-filter-dialog/PriceFilterDialog";

export default function VehicleCategoryAndFilter() {
  return (
    <div
      className={`no-global-padding sticky z-30 mb-4 flex items-center justify-between bg-background py-2`}
      style={{
        top: '3.9rem',
      }}
    >
      <div
        className={`mx-auto flex w-full max-w-full items-center justify-center gap-x-4 p-0 md:gap-x-14`}
      >
        {/* vehicle categories menu bar */}
        <VehicleCategories />

        {/* vehicle types carousel */}
        <VehicleTypesCarousel />

        {/* filter modal */}
        <div className="max-sm:hidden">
          <PriceFilterDialog />
        </div>
      </div>
    </div>
  );
}
