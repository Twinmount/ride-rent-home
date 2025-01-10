"use client";

import VehicleCategories from "./VehicleCategories";
import { useNavbar } from "@/context/NavbarContext";
import VehicleTypesDialog from "./dialog/VehicleTypesDialog";
import PriceFilterDialog from "./PriceFilterDialog";

export default function VehicleCategoryAndFilter() {
  const { isHidden } = useNavbar();

  return (
    <div
      className={`sticky z-30 mb-4 flex items-center justify-between bg-bgGray ${isHidden && "shadow"}`}
      style={{
        top: isHidden ? "-0.1rem" : "3.9rem",
        transition: "top 0.3s ease-in-out",
      }}
    >
      <div
        className={`mx-auto flex w-[95%] max-w-[95%] items-center justify-start gap-x-6 p-0 pt-3 md:pl-8 md:pt-4 lg:gap-x-16`}
      >
        {/* vehicle categories carousel */}
        <VehicleCategories />

        {/* right side vehicle types and price filter */}
        <div className="flex-center gap-x-3 max-sm:hidden lg:gap-x-6">
          {/* vertical bar separator */}
          <div
            className={`hidden h-12 w-[0.1rem] bg-gray-300 sm:block lg:h-14`}
          ></div>

          <VehicleTypesDialog />

          <PriceFilterDialog />
        </div>
      </div>
    </div>
  );
}
