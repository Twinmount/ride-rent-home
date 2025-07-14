"use client";

import VehicleTypesCarousel from "./vehicle-types-carousel/VehicleTypesCarousel";
import VehicleCategories from "./VehicleCategories";
import PriceFilterDialog from "../../dialog/price-filter-dialog/PriceFilterDialog";

export default function VehicleCategoryAndFilter() {
  return (
    <div
      className={`sticky z-30 mb-4 flex items-center justify-between bg-background py-2`}
      style={{
        top: "3.9rem",
      }}
    >
      <div
        className={`mx-auto flex items-center justify-center gap-x-4 p-0 sm:pl-4 lg:gap-x-14`}
      >
        {/* vehicle categories menu bar */}
        <VehicleCategories />

        {/* vehicle types carousel */}
        {/* <VehicleTypesCarousel /> */}

        {/* filter modal */}
        <div className="max-sm:hidden">
          <PriceFilterDialog />
        </div>
      </div>
    </div>
  );
}
